import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import { getAuthAdmin } from '@/lib/auth'

// Quick stock update (admin only)
export async function PATCH(request, { params }) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { id } = await params
    const { stockChange, newStock } = await request.json()

    let update = {}
    if (stockChange !== undefined) {
      update = { $inc: { stock: parseInt(stockChange) } }
    } else if (newStock !== undefined) {
      update = { $set: { stock: Math.max(0, parseInt(newStock)) } }
    } else {
      return NextResponse.json({ message: 'Must provide stockChange or newStock' }, { status: 400 })
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true })

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // Prevent negative stock if using $inc
    if (product.stock < 0) {
      product.stock = 0
      await product.save()
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
