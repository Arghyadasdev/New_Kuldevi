import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import { getAuthAdmin } from '@/lib/auth'

// Update order status (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { id } = await params
    const { status } = await request.json()
    const order = await Order.findById(id)

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    order.status = status
    const updatedOrder = await order.save()
    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
