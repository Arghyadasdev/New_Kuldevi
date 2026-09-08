import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import { getAuthCustomer } from '@/lib/auth'

// Get logged in customer's orders
export async function GET(request) {
  try {
    await connectDB()
    const { payload: customer, error } = getAuthCustomer(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const orders = await Order.find({ customer: customer.id }).sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
