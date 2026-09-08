import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Customer from '@/models/Customer'
import Order from '@/models/Order'
import { getAuthAdmin } from '@/lib/auth'

// Get all customers (Admin only)
export async function GET(request) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const customers = await Customer.find().select('-passwordHash').sort({ createdAt: -1 })

    // Attach order count to each customer for dashboard
    const customersWithStats = await Promise.all(customers.map(async (c) => {
      const orderCount = await Order.countDocuments({ customer: c._id })
      return { ...c.toObject(), orderCount }
    }))

    return NextResponse.json(customersWithStats)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
