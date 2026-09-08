import { NextResponse } from 'next/server'
import { supabaseForRequest, requireCustomer } from '@/lib/supabaseServer'
import { toCamelList } from '@/lib/serialize'

// Get customer wishlist (full product objects)
export async function GET(request) {
  try {
    const { user, error: authError } = await requireCustomer(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase
      .from('wishlists')
      .select('product:products(*)')
      .eq('customer_id', user.id)
    if (error) throw error

    const products = (data || []).map(row => row.product).filter(Boolean)
    return NextResponse.json(toCamelList(products))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
