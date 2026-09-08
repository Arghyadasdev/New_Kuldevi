import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin, supabaseAdmin } from '@/lib/supabaseServer'

// Get all customers (Admin only) — every Supabase Auth user who isn't in the admins table
export async function GET(request) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const admin = supabaseAdmin()
    const { data: adminRows, error: adminError } = await admin.from('admins').select('user_id')
    if (adminError) throw adminError
    const adminIds = new Set((adminRows || []).map(a => a.user_id))

    const { data: userList, error: usersError } = await admin.auth.admin.listUsers({ perPage: 1000 })
    if (usersError) throw usersError

    const supabase = supabaseForRequest(request)
    const customers = await Promise.all(
      userList.users
        .filter(u => !adminIds.has(u.id))
        .map(async (u) => {
          const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('customer_id', u.id)
          return {
            _id: u.id,
            name: u.user_metadata?.name || u.email,
            email: u.email,
            orderCount: count || 0,
            createdAt: u.created_at,
          }
        })
    )
    customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
