import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Coupon from '@/models/Coupon'
import { getAuthAdmin } from '@/lib/auth'

// Delete a coupon (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { id } = await params
    await Coupon.findByIdAndDelete(id)
    return NextResponse.json({ message: 'Coupon deleted' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
