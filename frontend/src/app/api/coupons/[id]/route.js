import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin } from '@/lib/supabaseServer'

// Delete a coupon (Admin only)
export async function DELETE(request, { params }) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { id } = await params
    const supabase = supabaseForRequest(request)
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'Coupon deleted' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
