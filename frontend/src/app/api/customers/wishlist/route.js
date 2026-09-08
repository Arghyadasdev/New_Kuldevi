import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Customer from '@/models/Customer'
import { getAuthCustomer } from '@/lib/auth'

// Get customer wishlist
export async function GET(request) {
  try {
    await connectDB()
    const { payload, error } = getAuthCustomer(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const customer = await Customer.findById(payload.id).populate('wishlist')
    return NextResponse.json(customer.wishlist || [])
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
