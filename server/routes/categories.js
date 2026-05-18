import express from 'express'
const router = express.Router()
import Product from '../models/Product.js'

// Get all unique categories
router.get('/', async (req, res) => {
  try {
    const categories = await Product.distinct('category')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
