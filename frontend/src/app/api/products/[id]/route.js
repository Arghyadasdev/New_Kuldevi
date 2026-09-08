import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import { getAuthAdmin } from '@/lib/auth'

// Get single product by ID (public)
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Update product (admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { id } = await params
    const body = await request.json()
    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// Delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { id } = await params
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
