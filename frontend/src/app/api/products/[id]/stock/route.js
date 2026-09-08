import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin } from '@/lib/supabaseServer'
import { toCamel } from '@/lib/serialize'

// Quick stock update (admin only)
export async function PATCH(request, { params }) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { id } = await params
    const { stockChange, newStock } = await request.json()
    const supabase = supabaseForRequest(request)

    let nextStock
    if (newStock !== undefined) {
      nextStock = Math.max(0, parseInt(newStock))
    } else if (stockChange !== undefined) {
      const { data: current, error: fetchError } = await supabase.from('products').select('stock').eq('id', id).maybeSingle()
      if (fetchError) throw fetchError
      if (!current) return NextResponse.json({ message: 'Product not found' }, { status: 404 })
      nextStock = Math.max(0, current.stock + parseInt(stockChange))
    } else {
      return NextResponse.json({ message: 'Must provide stockChange or newStock' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('products')
      .update({ stock: nextStock, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    if (!data) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(toCamel(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
