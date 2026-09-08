import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import { getAuthAdmin } from '@/lib/auth'

// Get all products with optional filtering (public)
export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort')

    let query = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    let productsQuery = Product.find(query)

    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit))
    }

    let sortObj = { createdAt: -1 } // Default newest
    if (sort === 'price_asc') sortObj = { price: 1 }
    if (sort === 'price_desc') sortObj = { price: -1 }
    if (sort === 'newest') sortObj = { createdAt: -1 }

    const products = await productsQuery.sort(sortObj)
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Create new product (admin only)
export async function POST(request) {
  try {
    await connectDB()
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const body = await request.json()
    const product = new Product(body)
    const savedProduct = await product.save()
    return NextResponse.json(savedProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
