import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Coupon from '@/models/Coupon'
import { getAuthAdmin } from '@/lib/auth'

// Get all coupons (Admin only)
export async function GET(request) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const coupons = await Coupon.find().sort({ createdAt: -1 })
    return NextResponse.json(coupons)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Create a new coupon (Admin only)
export async function POST(request) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { code, discountPercentage, expiryDate } = await request.json()

    const existing = await Coupon.findOne({ code: code.toUpperCase() })
    if (existing) {
      return NextResponse.json({ message: 'Coupon code already exists' }, { status: 400 })
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    })

    const savedCoupon = await coupon.save()
    return NextResponse.json(savedCoupon, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
