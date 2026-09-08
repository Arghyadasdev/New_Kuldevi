import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin } from '@/lib/supabaseServer'
import { toCamel } from '@/lib/serialize'

// Update order status (Admin only)
export async function PUT(request, { params }) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { id } = await params
    const { status } = await request.json()
    const supabase = supabaseForRequest(request)

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    if (!data) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json(toCamel(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
