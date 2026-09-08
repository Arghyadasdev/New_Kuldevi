import { NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/supabaseServer'

// Get total customer count (Admin only)
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

    const count = userList.users.filter(u => !adminIds.has(u.id)).length
    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
