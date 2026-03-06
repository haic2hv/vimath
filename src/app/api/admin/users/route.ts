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

// Toggle premium for a user manually
export async function PATCH(request: NextRequest) {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { profileId, isPremium, premiumUntil } = await request.json();

    const { error } = await supabase
        .from('Profile')
        .update({ isPremium, premiumUntil })
        .eq('id', profileId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
