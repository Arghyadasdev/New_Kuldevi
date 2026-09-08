import express from 'express'
const router = express.Router()
import Review from '../models/Review.js'
import Product from '../models/Product.js'
import { requireCustomerAuth } from '../middleware/auth.js'

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new review
router.post('/product/:productId', requireCustomerAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const productId = req.params.productId
    const customerId = req.customer.id

    // Check if review already exists
    const existingReview = await Review.findOne({ product: productId, customer: customerId })
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' })
    }

    const review = new Review({
      product: productId,
      customer: customerId,
      customerName: req.customer.name,
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

    res.status(201).json(review)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a review (Customer can delete their own, Admin can delete any - simplified for now)
router.delete('/:id', requireCustomerAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    if (review.customer.toString() !== req.customer.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
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

    res.json({ message: 'Review deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
