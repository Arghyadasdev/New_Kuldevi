import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Customer from '@/models/Customer'
import { getAuthCustomer } from '@/lib/auth'

// Toggle item in wishlist
export async function POST(request, { params }) {
  try {
    await connectDB()
    const { payload, error } = getAuthCustomer(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { productId } = await params
    const customer = await Customer.findById(payload.id)

    const index = customer.wishlist.indexOf(productId)
    if (index === -1) {
      customer.wishlist.push(productId)
    } else {
      customer.wishlist.splice(index, 1)
    }

    await customer.save()
    return NextResponse.json({ wishlist: customer.wishlist })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
