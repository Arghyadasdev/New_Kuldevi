import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Review from '@/models/Review'
import Product from '@/models/Product'
import { getAuthCustomer } from '@/lib/auth'

// Get reviews for a product
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { productId } = await params
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// Create a new review
export async function POST(request, { params }) {
  try {
    await connectDB()
    const { payload: customer, error } = getAuthCustomer(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { productId } = await params
    const { rating, comment } = await request.json()

    // Check if review already exists
    const existingReview = await Review.findOne({ product: productId, customer: customer.id })
    if (existingReview) {
      return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 })
    }

    const review = new Review({
      product: productId,
      customer: customer.id,
      customerName: customer.name,
      rating: Number(rating),
      comment
    })

    await review.save()

    // Update Product average rating and num reviews
    const reviews = await Review.find({ product: productId })
    const numReviews = reviews.length
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      numReviews
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
