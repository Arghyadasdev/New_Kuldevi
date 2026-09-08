import { NextResponse } from 'next/server'
import { supabaseForRequest } from '@/lib/supabaseServer'

// Get all unique categories
export async function GET(request) {
  try {
    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase.from('products').select('category')
    if (error) throw error
    const categories = [...new Set((data || []).map(p => p.category))]
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
