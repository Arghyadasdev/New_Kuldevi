import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const router = express.Router()

// One-time setup: create first admin (only works if no admin exists)
router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments()
    if (count > 0) {
      return res.status(403).json({ message: 'Admin already exists' })
    }
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await Admin.create({ username, passwordHash })
    res.status(201).json({ message: 'Admin created', username: admin.username })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const admin = await Admin.findOne({ username })
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, username: admin.username })
  } catch (error) {
    console.error('[AUTH /login error]', error.message)
    res.status(500).json({ message: error.message })
  }
})

export default router
