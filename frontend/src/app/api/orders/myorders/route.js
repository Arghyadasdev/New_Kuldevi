import { NextResponse } from 'next/server'
import { supabaseForRequest, requireCustomer } from '@/lib/supabaseServer'
import { toCamelList } from '@/lib/serialize'

// Get logged in customer's orders
export async function GET(request) {
  try {
    const { user, error: authError } = await requireCustomer(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(toCamelList(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
