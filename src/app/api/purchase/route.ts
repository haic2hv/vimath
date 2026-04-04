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
        const { userId, itemType, itemSlug, tokenPrice } = await request.json();

        if (!userId || !itemType || !itemSlug || tokenPrice === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['exam', 'course'].includes(itemType)) {
            return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
        }

        const price = Number(tokenPrice);
        if (price <= 0) {
            return NextResponse.json({ error: 'Item is free, no purchase needed' }, { status: 400 });
        }

        // Get profile
        const { data: profile, error: profileError } = await supabase
            .from('Profile')
            .select('id, tokenBalance')
            .eq('userId', userId)
            .single();

        if (!profile || profileError) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Check if already purchased
        const { data: existingPurchase } = await supabase
            .from('Purchase')
            .select('id')
            .eq('profileId', profile.id)
            .eq('itemType', itemType)
            .eq('itemSlug', itemSlug)
            .single();

        if (existingPurchase) {
            return NextResponse.json({ error: 'Already purchased', hasAccess: true }, { status: 409 });
        }

        // Check sufficient tokens
        if (profile.tokenBalance < price) {
            return NextResponse.json({
                error: 'Insufficient tokens',
                currentBalance: profile.tokenBalance,
                required: price,
            }, { status: 402 });
        }

        // Deduct tokens
        const newBalance = profile.tokenBalance - price;
        const { error: updateErr } = await supabase
            .from('Profile')
            .update({ tokenBalance: newBalance })
            .eq('id', profile.id);

        if (updateErr) {
            return NextResponse.json({ error: 'Failed to deduct tokens' }, { status: 500 });
        }

        // Create purchase record
        const { error: purchaseErr } = await supabase
            .from('Purchase')
            .insert({
                profileId: profile.id,
                itemType,
                itemSlug,
                tokenAmount: price,
            });

        if (purchaseErr) {
            // Rollback token deduction
            await supabase
                .from('Profile')
                .update({ tokenBalance: profile.tokenBalance })
                .eq('id', profile.id);
            return NextResponse.json({ error: 'Failed to create purchase record' }, { status: 500 });
        }

        // Create order record for history
        await supabase
            .from('Order')
            .insert({
                profileId: profile.id,
                type: 'purchase',
                amount: 0,
                tokenAmount: price,
                status: 'paid',
            });

        return NextResponse.json({
            success: true,
            newBalance,
            message: `Purchased ${itemType} "${itemSlug}" for ${price} tokens`,
        });
    } catch (error) {
        console.error('Purchase error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
