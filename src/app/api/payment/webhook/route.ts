import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// SePay Webhook / IPN endpoint
// SePay will POST transaction data here when payment is received
export async function POST(request: NextRequest) {
    try {
        // Verify API key from SePay (optional but recommended)
        const apiKey = request.headers.get('Authorization');
        const expectedKey = process.env.SEPAY_WEBHOOK_SECRET;

        if (expectedKey && apiKey !== `Bearer ${expectedKey}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // SePay webhook payload typically includes:
        // - transferAmount: amount transferred
        // - content: transfer content/description
        // - referenceCode: reference code
        // - transactionDate: date of transaction
        const { transferAmount, content, referenceCode, transactionDate } = body;

        if (!content) {
            return NextResponse.json({ success: false, message: 'No content' }, { status: 400 });
        }

        // Extract order code from content (format: "VINAMATH XXXXXXXX")
        const match = content.match(/VINAMATH\s+([A-Z0-9]+)/i);
        if (!match) {
            return NextResponse.json({ success: false, message: 'No matching order code' });
        }

        const orderCode = match[1].toUpperCase();

        // Find order by sepayRef
        const { data: order, error: orderError } = await supabase
            .from('Order')
            .select('*, profile:Profile(*)')
            .eq('sepayRef', orderCode)
            .eq('status', 'pending')
            .single();

        if (!order || orderError) {
            return NextResponse.json({ success: false, message: 'Order not found' });
        }

        // Verify amount matches
        if (transferAmount && Number(transferAmount) < order.amount) {
            return NextResponse.json({ success: false, message: 'Insufficient amount' });
        }

        // Update order status to paid
        await supabase
            .from('Order')
            .update({ status: 'paid' })
            .eq('id', order.id);

        // Calculate premium expiry
        const now = new Date();
        const months = order.plan === '6months' ? 6 : 12;

        // If user already has premium, extend from current expiry
        let premiumUntil: Date;
        if (order.profile?.premiumUntil && new Date(order.profile.premiumUntil) > now) {
            premiumUntil = new Date(order.profile.premiumUntil);
        } else {
            premiumUntil = new Date(now);
        }
        premiumUntil.setMonth(premiumUntil.getMonth() + months);

        // Activate premium for user
        await supabase
            .from('Profile')
            .update({
                isPremium: true,
                premiumUntil: premiumUntil.toISOString(),
            })
            .eq('id', order.profileId);

        return NextResponse.json({ success: true, message: 'Payment confirmed' });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Allow GET for webhook verification
export async function GET() {
    return NextResponse.json({ status: 'ok', service: 'vinamath-webhook' });
}
