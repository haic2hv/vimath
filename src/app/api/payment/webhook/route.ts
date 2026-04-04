import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS for server-side operations
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, serviceKey);
}

// SePay Webhook / IPN endpoint
export async function POST(request: NextRequest) {
    // Validate webhook authorization from SePay
    // SePay supports: "Apikey <key>" format
    const authHeader = request.headers.get('Authorization');
    const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
        const isValid =
            authHeader === `Apikey ${webhookSecret}` ||
            authHeader === `Bearer ${webhookSecret}` ||
            authHeader === webhookSecret;

        if (!authHeader || !isValid) {
            console.log('❌ Unauthorized webhook request. Header:', authHeader);
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
    }

    const supabase = getSupabaseAdmin();

    try {
        const body = await request.json();
        console.log('🔔 SePay webhook received:', JSON.stringify(body));

        // SePay sends: content, transferAmount, referenceCode, id, gateway, etc.
        const content = body.content || body.description || '';
        const transferAmount = body.transferAmount || body.amount || 0;
        const referenceCode = body.referenceCode || body.code || '';
        const transactionId = body.id || '';

        if (!content && !transferAmount) {
            console.log('❌ Empty webhook payload');
            return NextResponse.json({ success: true }); // Return 200 to avoid SePay retry
        }

        console.log(`📝 Content: "${content}", Amount: ${transferAmount}, Ref: ${referenceCode}, TxnId: ${transactionId}`);

        // Extract order code from content
        // Formats: "SEVQR HMATH XXXXXXXX", "HMATH XXXXXXXX", "hmath xxxxxxxx"
        const match = content.match(/HMATH\s+([A-Z0-9]+)/i);
        if (!match) {
            console.log('❌ No HMATH order code found in content:', content);
            return NextResponse.json({ success: true }); // Return 200 to avoid retry
        }

        const orderCode = match[1].toUpperCase();
        console.log(`🔍 Looking for order with code: ${orderCode}`);

        // Find order by sepayRef
        const { data: order, error: orderError } = await supabase
            .from('Order')
            .select('*, profile:Profile(*)')
            .eq('sepayRef', orderCode)
            .eq('status', 'pending')
            .single();

        if (!order || orderError) {
            console.log(`❌ Order not found for code "${orderCode}": ${orderError?.message || 'no data'}`);
            
            // Also try case-insensitive search
            const { data: orderAlt } = await supabase
                .from('Order')
                .select('*, profile:Profile(*)')
                .ilike('sepayRef', orderCode)
                .eq('status', 'pending')
                .single();

            if (!orderAlt) {
                // Log all pending orders for debugging
                const { data: pendingOrders } = await supabase
                    .from('Order')
                    .select('id, sepayRef, status, amount')
                    .eq('status', 'pending')
                    .limit(10);
                console.log('📋 Pending orders:', JSON.stringify(pendingOrders));
                return NextResponse.json({ success: true }); // Return 200
            }
            
            // Use the alt order
            return await processOrder(supabase, orderAlt, referenceCode, orderCode);
        }

        return await processOrder(supabase, order, referenceCode, orderCode);
    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json({ success: true }); // Return 200 to avoid retry on errors
    }
}

async function processOrder(
    supabase: ReturnType<typeof createClient>,
    order: any,
    referenceCode: string,
    orderCode: string
) {
    console.log(`✅ Found order: ${order.id}, type: ${order.type}, tokenAmount: ${order.tokenAmount}`);

    // Update order status to paid
    const { error: updateOrderErr } = await supabase
        .from('Order')
        .update({ status: 'paid', sepayRef: referenceCode || orderCode })
        .eq('id', order.id);

    if (updateOrderErr) {
        console.log(`❌ Failed to update order: ${updateOrderErr.message}`);
    }

    // Add tokens to user balance
    const currentBalance = order.profile?.tokenBalance || 0;
    const newBalance = currentBalance + order.tokenAmount;

    const { error: updateProfileErr } = await supabase
        .from('Profile')
        .update({ tokenBalance: newBalance })
        .eq('id', order.profileId);

    if (updateProfileErr) {
        console.log(`❌ Failed to update profile: ${updateProfileErr.message}`);
        return NextResponse.json({ success: false, message: 'Failed to add tokens' });
    }

    console.log(`🎉 Added ${order.tokenAmount} tokens. New balance: ${newBalance}`);
    return NextResponse.json({ success: true, message: 'Payment confirmed, tokens added' });
}

// Allow GET for webhook verification
export async function GET() {
    return NextResponse.json({ status: 'ok', service: 'hmath-webhook' });
}
