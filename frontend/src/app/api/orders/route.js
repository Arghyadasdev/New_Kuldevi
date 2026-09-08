import { NextResponse } from 'next/server'
import { supabaseForRequest, requireAdmin, requireCustomer, supabaseAdmin } from '@/lib/supabaseServer'
import { toCamel, toCamelList } from '@/lib/serialize'

// Create a new order (Customer only)
export async function POST(request) {
  try {
    const { user, error: authError } = await requireCustomer(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const { items, shippingAddress, couponCode } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 })
    }

    const supabase = supabaseForRequest(request)

    // Verify prices and calculate total (to prevent frontend tampering)
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const { data: product, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product)
        .maybeSingle()
      if (prodError) throw prodError
      if (!product) {
        return NextResponse.json({ message: `Product not found: ${item.name}` }, { status: 404 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${product.name}` }, { status: 400 })
      }

      orderItems.push({
        product: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      })
      totalAmount += product.price * item.quantity

      // Deduct stock immediately
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: product.stock - item.quantity })
        .eq('id', product.id)
      if (stockError) throw stockError
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        items: orderItems,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        coupon_code: couponCode || null,
      })
      .select()
      .single()
    if (error) throw error

    return NextResponse.json(toCamel(order), { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// Get all orders (Admin only)
export async function GET(request) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const supabase = supabaseForRequest(request)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error

    // Attach customer name/email (auth.users isn't joinable via PostgREST directly)
    const admin = supabaseAdmin()
    const orders = await Promise.all((data || []).map(async (order) => {
      const { data: userData } = await admin.auth.admin.getUserById(order.customer_id)
      return {
        ...toCamel(order),
        customer: userData?.user
          ? { name: userData.user.user_metadata?.name, email: userData.user.email }
          : null,
      }
    }))

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
