import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import { getAuthAdmin } from '@/lib/auth'

// Get dashboard analytics (Admin only)
export async function GET(request) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const totalOrders = await Order.countDocuments()

    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      recentOrders
    })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
