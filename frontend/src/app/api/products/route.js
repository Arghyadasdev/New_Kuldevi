import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin } from '@/lib/supabaseServer'
import { toCamel, toCamelList } from '@/lib/serialize'

// Get all products with optional filtering (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort')

    const supabase = supabaseForRequest(request)
    let query = supabase.from('products').select('*')

    if (category) query = query.eq('category', category)
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    if (minPrice) query = query.gte('price', Number(minPrice))
    if (maxPrice) query = query.lte('price', Number(maxPrice))

    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else query = query.order('created_at', { ascending: false }) // default newest

    if (limit) query = query.limit(parseInt(limit))

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(toCamelList(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Create new product (admin only)
export async function POST(request) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const body = await request.json()
    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        stock: body.stock,
        sku: body.sku,
        image: body.image,
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(toCamel(data), { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
