import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin
    const { data: profile } = await supabase
        .from('Profile')
        .select('role')
        .eq('userId', userId)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Total users
    const { count: totalUsers } = await supabase
        .from('Profile')
        .select('id', { count: 'exact', head: true });

    // Premium users
    const { count: premiumUsers } = await supabase
        .from('Profile')
        .select('id', { count: 'exact', head: true })
        .eq('isPremium', true);

    // Total orders
    const { data: paidOrders } = await supabase
        .from('Order')
        .select('amount')
        .eq('status', 'paid');

    const totalRevenue = paidOrders?.reduce((sum, o) => sum + o.amount, 0) || 0;
    const totalOrders = paidOrders?.length || 0;

    // Recent orders
    const { data: recentOrders } = await supabase
        .from('Order')
        .select('*, profile:Profile(email)')
        .order('createdAt', { ascending: false })
        .limit(10);

    // Recent users
    const { data: recentUsers } = await supabase
        .from('Profile')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(5);

    return NextResponse.json({
        totalUsers: totalUsers || 0,
        premiumUsers: premiumUsers || 0,
        totalRevenue,
        totalOrders,
        recentOrders: recentOrders || [],
        recentUsers: recentUsers || [],
    });
}
