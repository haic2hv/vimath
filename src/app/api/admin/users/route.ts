import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function verifyAdmin(request: NextRequest) {
    const authHeader = request.headers.get('x-user-id');
    if (!authHeader) return false;

    const { data: profile } = await supabase
        .from('Profile')
        .select('role')
        .eq('userId', authHeader)
        .single();

    return profile?.role === 'admin';
}

export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    let query = supabase
        .from('Profile')
        .select('*, orders:Order(*)', { count: 'exact' })
        .order('createdAt', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (search) {
        query = query.ilike('email', `%${search}%`);
    }

    const { data: users, count, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users, total: count, page, limit });
}

// Update user tokens (gift/adjust tokens)
export async function PATCH(request: NextRequest) {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { profileId, tokenAmount, action } = await request.json();

    if (!profileId || tokenAmount === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get current balance
    const { data: profile } = await supabase
        .from('Profile')
        .select('tokenBalance')
        .eq('id', profileId)
        .single();

    if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    let newBalance: number;
    if (action === 'set') {
        newBalance = Number(tokenAmount);
    } else {
        // Default: add tokens
        newBalance = profile.tokenBalance + Number(tokenAmount);
    }

    if (newBalance < 0) newBalance = 0;

    const { error } = await supabase
        .from('Profile')
        .update({ tokenBalance: newBalance })
        .eq('id', profileId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, newBalance });
}
