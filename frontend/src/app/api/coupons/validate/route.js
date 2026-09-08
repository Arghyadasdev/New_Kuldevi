import { NextResponse } from 'next/server'
import { supabaseForRequest } from '@/lib/supabaseServer'

// Validate a coupon (Public)
export async function POST(request) {
  try {
    const { code } = await request.json()
    if (!code) return NextResponse.json({ message: 'Code is required' }, { status: 400 })

    const supabase = supabaseForRequest(request)
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle()
    if (error) throw error

    if (!coupon) {
      return NextResponse.json({ message: 'Invalid or inactive coupon code' }, { status: 404 })
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({ message: 'This coupon has expired' }, { status: 400 })
    }

    return NextResponse.json({
      code: coupon.code,
      discountPercentage: coupon.discount_percentage,
    })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
