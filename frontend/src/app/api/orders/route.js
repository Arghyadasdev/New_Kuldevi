import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { getAuthAdmin, getAuthCustomer } from '@/lib/auth'

// Create a new order (Customer only)
export async function POST(request) {
  try {
    await connectDB()
    const { payload: customer, error } = getAuthCustomer(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { items, shippingAddress } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 })
    }

    // Verify prices and calculate total (to prevent frontend tampering)
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return NextResponse.json({ message: `Product not found: ${item.name}` }, { status: 404 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${product.name}` }, { status: 400 })
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      })
      totalAmount += (product.price * item.quantity)

      // Deduct stock immediately
      product.stock -= item.quantity
      await product.save()
    }

    const order = new Order({
      customer: customer.id,
      items: orderItems,
      totalAmount,
      shippingAddress
    })

    const savedOrder = await order.save()
    return NextResponse.json(savedOrder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// Get all orders (Admin only)
export async function GET(request) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
