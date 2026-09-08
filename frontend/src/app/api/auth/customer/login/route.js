import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/db'
import Customer from '@/models/Customer'

// Customer Login
export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()
    const customer = await Customer.findOne({ email })
    if (!customer || !(await customer.comparePassword(password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }
    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return NextResponse.json({ token, name: customer.name, email: customer.email })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
