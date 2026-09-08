import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin, supabaseAdmin } from '@/lib/supabaseServer'
import { toCamel } from '@/lib/serialize'

// Get dashboard analytics (Admin only)
export async function GET(request) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const supabase = supabaseForRequest(request)

    const { count: totalOrders, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    if (countError) throw countError

    const { data: revenueRows, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .neq('status', 'Cancelled')
    if (revenueError) throw revenueError
    const totalRevenue = (revenueRows || []).reduce((sum, o) => sum + Number(o.total_amount), 0)

    const { data: recentRows, error: recentError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    if (recentError) throw recentError

    const admin = supabaseAdmin()
    const recentOrders = await Promise.all((recentRows || []).map(async (order) => {
      const { data: userData } = await admin.auth.admin.getUserById(order.customer_id)
      return {
        ...toCamel(order),
        customer: userData?.user ? { name: userData.user.user_metadata?.name } : null,
      }
    }))

    return NextResponse.json({ totalOrders, totalRevenue, recentOrders })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
