import { NextResponse } from 'next/server'
import { supabaseForRequest, requireCustomer } from '@/lib/supabaseServer'

// Toggle item in wishlist
export async function POST(request, { params }) {
  try {
    const { user, error: authError } = await requireCustomer(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { productId } = await params
    const supabase = supabaseForRequest(request)

    const { data: existing, error: findError } = await supabase
      .from('wishlists')
      .select('id')
      .eq('customer_id', user.id)
      .eq('product_id', productId)
      .maybeSingle()
    if (findError) throw findError

    if (existing) {
      const { error } = await supabase.from('wishlists').delete().eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('wishlists')
        .insert({ customer_id: user.id, product_id: productId })
      if (error) throw error
    }

    const { data: rows, error: listError } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('customer_id', user.id)
    if (listError) throw listError

    return NextResponse.json({ wishlist: (rows || []).map(r => r.product_id) })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
