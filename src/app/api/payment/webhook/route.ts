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
    const supabase = getSupabaseAdmin();

    try {
        const body = await request.json();
        console.log('🔔 SePay webhook received:', JSON.stringify(body));

        // SePay sends these fields:
        // gateway, transactionDate, accountNumber, subAccount,
        // transferType, transferAmount, accumulated, code,
        // content, referenceCode, description
        const content = body.content || body.description || '';
        const transferAmount = body.transferAmount || body.amount || 0;
        const referenceCode = body.referenceCode || body.code || '';

        if (!content) {
            console.log('❌ No content in webhook');
            return NextResponse.json({ success: false, message: 'No content' });
        }

        console.log(`📝 Content: "${content}", Amount: ${transferAmount}, Ref: ${referenceCode}`);

        // Extract order code from content (format: "SEVQR HMATH XXXXXXXX" or "HMATH XXXXXXXX")
        const match = content.match(/HMATH\s+([A-Z0-9]+)/i);
        if (!match) {
            console.log('❌ No HMATH order code found in content');
            return NextResponse.json({ success: false, message: 'No matching order code' });
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
            console.log(`❌ Order not found: ${orderError?.message || 'no data'}`);
            return NextResponse.json({ success: false, message: 'Order not found' });
        }

        console.log(`✅ Found order: ${order.id}, plan: ${order.plan}, amount: ${order.amount}`);

        // Update order status to paid
        const { error: updateOrderErr } = await supabase
            .from('Order')
            .update({ status: 'paid', sepayRef: referenceCode || orderCode })
            .eq('id', order.id);

        if (updateOrderErr) {
            console.log(`❌ Failed to update order: ${updateOrderErr.message}`);
        }

        // Calculate premium expiry
        const now = new Date();
        const months = order.plan === '6months' ? 6 : 12;

        let premiumUntil: Date;
        if (order.profile?.premiumUntil && new Date(order.profile.premiumUntil) > now) {
            premiumUntil = new Date(order.profile.premiumUntil);
        } else {
            premiumUntil = new Date(now);
        }
        premiumUntil.setMonth(premiumUntil.getMonth() + months);

        // Activate premium for user
        const { error: updateProfileErr } = await supabase
            .from('Profile')
            .update({
                isPremium: true,
                premiumUntil: premiumUntil.toISOString(),
            })
            .eq('id', order.profileId);

        if (updateProfileErr) {
            console.log(`❌ Failed to update profile: ${updateProfileErr.message}`);
            return NextResponse.json({ success: false, message: 'Failed to activate premium' });
        }

        console.log(`🎉 Premium activated until ${premiumUntil.toISOString()}`);
        return NextResponse.json({ success: true, message: 'Payment confirmed' });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Allow GET for webhook verification
export async function GET() {
    return NextResponse.json({ status: 'ok', service: 'hmath-webhook' });
}
