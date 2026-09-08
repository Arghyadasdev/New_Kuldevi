import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Customer from '@/models/Customer'
import { getAuthAdmin } from '@/lib/auth'

// Get total customer count (Admin only)
export async function GET(request) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const count = await Customer.countDocuments()
    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
