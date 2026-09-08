import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Review from '@/models/Review'
import Product from '@/models/Product'
import { getAuthCustomer } from '@/lib/auth'

// Delete a review (Customer can delete their own, Admin can delete any - simplified for now)
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { payload: customer, error } = getAuthCustomer(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const { id } = await params
    const review = await Review.findById(id)
    if (!review) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 })
    }

    if (review.customer.toString() !== customer.id) {
      return NextResponse.json({ message: 'Not authorized to delete this review' }, { status: 403 })
    }

    const productId = review.product
    await review.deleteOne()

    // Update Product average rating and num reviews
    const reviews = await Review.find({ product: productId })
    const numReviews = reviews.length
    const averageRating = numReviews > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews) : 0

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      numReviews
    })

    return NextResponse.json({ message: 'Review deleted' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
