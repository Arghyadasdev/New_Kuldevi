import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin } from '@/lib/supabaseServer'
import { toCamel } from '@/lib/serialize'

// Toggle coupon status (Admin only)
export async function PUT(request, { params }) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { id } = await params
    const supabase = supabaseForRequest(request)

    const { data: coupon, error: findError } = await supabase.from('coupons').select('*').eq('id', id).maybeSingle()
    if (findError) throw findError
    if (!coupon) return NextResponse.json({ message: 'Coupon not found' }, { status: 404 })

    const { data, error } = await supabase
      .from('coupons')
      .update({ is_active: !coupon.is_active })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(toCamel(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
