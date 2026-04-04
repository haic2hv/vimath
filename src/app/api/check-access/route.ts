import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, serviceKey);
}

export async function GET(request: NextRequest) {
    const supabase = getSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const itemType = searchParams.get('itemType');
    const itemSlug = searchParams.get('itemSlug');

    if (!userId || !itemType || !itemSlug) {
        return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    // Get profile
    const { data: profile } = await supabase
        .from('Profile')
        .select('id')
        .eq('userId', userId)
        .single();

    if (!profile) {
        return NextResponse.json({ hasAccess: false });
    }

    // Check purchase
    const { data: purchase } = await supabase
        .from('Purchase')
        .select('id')
        .eq('profileId', profile.id)
        .eq('itemType', itemType)
        .eq('itemSlug', itemSlug)
        .single();

    return NextResponse.json({ hasAccess: !!purchase });
}
