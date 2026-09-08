import express from 'express'
const router = express.Router()
import Product from '../models/Product.js'
import requireAuth from '../middleware/auth.js'

// Get all products with optional filtering (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit, minPrice, maxPrice, sort } = req.query
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
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new product (admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const product = new Product(req.body)
    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update product (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Quick stock update (admin only)
router.patch('/:id/stock', requireAuth, async (req, res) => {
  try {
    const { stockChange, newStock } = req.body
    
    let update = {}
    if (stockChange !== undefined) {
      update = { $inc: { stock: parseInt(stockChange) } }
    } else if (newStock !== undefined) {
      update = { $set: { stock: Math.max(0, parseInt(newStock)) } }
    } else {
      return res.status(400).json({ message: 'Must provide stockChange or newStock' })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    
    // Prevent negative stock if using $inc
    if (product.stock < 0) {
      product.stock = 0
      await product.save()
    }
    
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete product (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
