import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Coupon from '@/models/Coupon'
import { getAuthAdmin } from '@/lib/auth'

// Toggle coupon status (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { id } = await params
    const coupon = await Coupon.findById(id)
    if (!coupon) return NextResponse.json({ message: 'Coupon not found' }, { status: 404 })

    coupon.isActive = !coupon.isActive
    await coupon.save()
    return NextResponse.json(coupon)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
