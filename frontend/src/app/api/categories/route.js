import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'

// Get all unique categories
export async function GET() {
  try {
    await connectDB()
    const categories = await Product.distinct('category')
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
