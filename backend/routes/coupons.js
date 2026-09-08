import express from 'express'
const router = express.Router()
import Coupon from '../models/Coupon.js'
import requireAuth from '../middleware/auth.js'

// Get all coupons (Admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json(coupons)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new coupon (Admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate } = req.body
    
    const existing = await Coupon.findOne({ code: code.toUpperCase() })
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' })
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    })

    const savedCoupon = await coupon.save()
    res.status(201).json(savedCoupon)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Toggle coupon status (Admin only)
router.put('/:id/toggle', requireAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })

    coupon.isActive = !coupon.isActive
    await coupon.save()
    res.json(coupon)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a coupon (Admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ message: 'Coupon deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Validate a coupon (Public)
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body
    if (!code) return res.status(400).json({ message: 'Code is required' })

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })
    
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' })
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' })
    }

    res.json({ 
      code: coupon.code, 
      discountPercentage: coupon.discountPercentage 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
