import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, serviceKey);
}

const TOKEN_PACKAGES: Record<number, number> = {
    20: 20000,
    50: 50000,
    100: 100000,
    200: 200000,
    500: 500000,
};

export async function POST(request: NextRequest) {
    const supabase = getSupabaseAdmin();
    try {
        const { tokenPackage, userId, email } = await request.json();

        if (!tokenPackage || !userId || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const tokens = Number(tokenPackage);
        const amount = TOKEN_PACKAGES[tokens];
        if (!amount) {
            return NextResponse.json({ error: 'Invalid token package' }, { status: 400 });
        }

        // Get or create profile
        let { data: profile } = await supabase
            .from('Profile')
            .select('id')
            .eq('userId', userId)
            .single();

        if (!profile) {
            const { data: newProfile } = await supabase
                .from('Profile')
                .insert({ userId, email, tokenBalance: 0, role: 'user' })
                .select('id')
                .single();
            profile = newProfile;
        }

        if (!profile) {
            return NextResponse.json({ error: 'Could not create profile' }, { status: 500 });
        }

        // Create topup order
        const { data: order, error: orderError } = await supabase
            .from('Order')
            .insert({
                profileId: profile.id,
                type: 'topup',
                amount,
                tokenAmount: tokens,
                status: 'pending',
            })
            .select('id')
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
        }

        // Build SePay payment info
        const orderCode = order.id.slice(0, 8).toUpperCase();
        const paymentContent = `SEVQR HMATH ${orderCode}`;

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

        const formatAmount = new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

        return NextResponse.json({
            orderId: order.id,
            orderCode,
            amount,
            formatAmount,
            tokenAmount: tokens,
            paymentContent,
            qrUrl,
        });
    } catch (error) {
        console.error('Payment create error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
