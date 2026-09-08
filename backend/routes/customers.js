import express from 'express'
const router = express.Router()
import Customer from '../models/Customer.js'
import Order from '../models/Order.js'
import requireAuth, { requireCustomerAuth } from '../middleware/auth.js'

// --- WISHLIST ROUTES ---

// Get customer wishlist
router.get('/wishlist', requireCustomerAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id).populate('wishlist')
    res.json(customer.wishlist || [])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Toggle item in wishlist
router.post('/wishlist/:productId', requireCustomerAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id)
    const productId = req.params.productId

    const index = customer.wishlist.indexOf(productId)
    if (index === -1) {
      customer.wishlist.push(productId)
    } else {
      customer.wishlist.splice(index, 1)
    }

    await customer.save()
    res.json({ wishlist: customer.wishlist })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// --- ADMIN ROUTES ---

// Get all customers (Admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const customers = await Customer.find().select('-passwordHash').sort({ createdAt: -1 })
    
    // Attach order count to each customer for dashboard
    const customersWithStats = await Promise.all(customers.map(async (c) => {
      const orderCount = await Order.countDocuments({ customer: c._id })
      return { ...c.toObject(), orderCount }
    }))

    res.json(customersWithStats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get total customer count (Admin only)
router.get('/count', requireAuth, async (req, res) => {
  try {
    const count = await Customer.countDocuments()
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
