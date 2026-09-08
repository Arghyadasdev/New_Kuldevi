import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/db'
import Admin from '@/models/Admin'

// Admin login
export async function POST(request) {
  try {
    await connectDB()
    const { username, password } = await request.json()
    const admin = await Admin.findOne({ username })
    if (!admin || !(await admin.comparePassword(password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return NextResponse.json({ token, username: admin.username })
  } catch (error) {
    console.error('[AUTH /login error]', error.message)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
