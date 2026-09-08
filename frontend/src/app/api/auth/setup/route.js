import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import Admin from '@/models/Admin'

// One-time setup: create first admin (only works if no admin exists)
export async function POST(request) {
  try {
    await connectDB()
    const count = await Admin.countDocuments()
    if (count > 0) {
      return NextResponse.json({ message: 'Admin already exists' }, { status: 403 })
    }
    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password required' }, { status: 400 })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await Admin.create({ username, passwordHash })
    return NextResponse.json({ message: 'Admin created', username: admin.username }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
