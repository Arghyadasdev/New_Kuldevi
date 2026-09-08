import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin } from '@/lib/supabaseServer'
import { toCamel, toCamelList } from '@/lib/serialize'

// Get all coupons (Admin only)
export async function GET(request) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(toCamelList(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Create a new coupon (Admin only)
export async function POST(request) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { code, discountPercentage, expiryDate } = await request.json()
    const supabase = supabaseForRequest(request)

    const { data: existing } = await supabase
      .from('coupons')
      .select('id')
      .eq('code', code.toUpperCase())
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ message: 'Coupon code already exists' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('coupons')
      .insert({
        code,
        discount_percentage: discountPercentage,
        expiry_date: expiryDate ? new Date(expiryDate).toISOString() : null,
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(toCamel(data), { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
