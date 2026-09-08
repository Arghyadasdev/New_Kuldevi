import express from 'express'
const router = express.Router()
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import requireAuth, { requireCustomerAuth } from '../middleware/auth.js'

// Create a new order (Customer only)
router.post('/', requireCustomerAuth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' })
    }

    // Verify prices and calculate total (to prevent frontend tampering)
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` })
      }
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      })
      totalAmount += (product.price * item.quantity)

      // Deduct stock immediately
      product.stock -= item.quantity
      await product.save()
    }

    const order = new Order({
      customer: req.customer.id,
      items: orderItems,
      totalAmount,
      shippingAddress
    })

    const savedOrder = await order.save()
    res.status(201).json(savedOrder)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get logged in customer's orders
router.get('/myorders', requireCustomerAuth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.customer.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all orders (Admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update order status (Admin only)
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get dashboard analytics (Admin only)
router.get('/analytics/dashboard', requireAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      totalOrders,
      totalRevenue,
      recentOrders
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
