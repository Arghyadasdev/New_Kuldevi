import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin } from '@/lib/supabaseServer'
import { toCamel } from '@/lib/serialize'

// Get single product by ID (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    if (!data) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(toCamel(data))
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Update product (admin only)
export async function PUT(request, { params }) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { id } = await params
    const body = await request.json()
    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        stock: body.stock,
        sku: body.sku,
        image: body.image,
        updated_at: new Date().toISOString(),
      })
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

// Delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { id } = await params
    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase.from('products').delete().eq('id', id).select().maybeSingle()
    if (error) throw error
    if (!data) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
