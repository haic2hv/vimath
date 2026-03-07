import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    try {
        const { plan, userId, email } = await request.json();

        if (!plan || !userId || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const amount = plan === '6months' ? 4900 : 9900;
        const planLabel = plan === '6months' ? 'Gói Học kỳ (6 Tháng)' : 'Gói Năm học (12 Tháng)';

        // Get or create profile
        let { data: profile } = await supabase
            .from('Profile')
            .select('id')
            .eq('userId', userId)
            .single();

        if (!profile) {
            const { data: newProfile } = await supabase
                .from('Profile')
                .insert({ userId, email, isPremium: false, role: 'user' })
                .select('id')
                .single();
            profile = newProfile;
        }

        if (!profile) {
            return NextResponse.json({ error: 'Could not create profile' }, { status: 500 });
        }

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('Order')
            .insert({
                profileId: profile.id,
                plan,
                amount,
                status: 'pending',
            })
            .select('id')
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
        }

        // Build SePay payment URL
        // SePay Payment Gateway redirect URL format
        const merchantId = process.env.SEPAY_MERCHANT_ID || '';
        const orderCode = order.id.slice(0, 8).toUpperCase();
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?order=${order.id}`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`;

        // SePay QR Payment URL (simple bank transfer with content matching)
        // The content format allows SePay webhook to identify the transaction
        const paymentContent = `HMATH ${orderCode}`;

        // Update order with reference code
        await supabase
            .from('Order')
            .update({ sepayRef: orderCode })
            .eq('id', order.id);

        // Generate SePay VietQR code URL
        const bankCode = process.env.SEPAY_BANK_CODE || '';
        const bankAccount = process.env.SEPAY_BANK_ACCOUNT || '';
        const qrUrl = bankCode && bankAccount
            ? `https://qr.sepay.vn/img?bank=${bankCode}&acc=${bankAccount}&template=compact&amount=${amount}&des=${encodeURIComponent(paymentContent)}`
            : '';

        return NextResponse.json({
            orderId: order.id,
            orderCode,
            amount,
            planLabel,
            paymentContent,
            qrUrl,
        });
    } catch (error) {
        console.error('Payment create error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
