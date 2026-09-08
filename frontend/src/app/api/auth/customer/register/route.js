import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/db'
import Customer from '@/models/Customer'

// Customer Registration
export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email, and password required' }, { status: 400 })
    }
    const existing = await Customer.findOne({ email })
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const customer = await Customer.create({ name, email, passwordHash })

    const token = jwt.sign(
      { id: customer._id, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return NextResponse.json({ token, name: customer.name, email: customer.email }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
