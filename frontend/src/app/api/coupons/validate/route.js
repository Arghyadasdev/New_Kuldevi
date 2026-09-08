import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Coupon from '@/models/Coupon'

// Validate a coupon (Public)
export async function POST(request) {
  try {
    await connectDB()
    const { code } = await request.json()
    if (!code) return NextResponse.json({ message: 'Code is required' }, { status: 400 })

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

    if (!coupon) {
      return NextResponse.json({ message: 'Invalid or inactive coupon code' }, { status: 404 })
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ message: 'This coupon has expired' }, { status: 400 })
    }

    return NextResponse.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage
    })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
