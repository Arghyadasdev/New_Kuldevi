import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '.env') })

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import orderRoutes from './routes/orders.js'
import customerRoutes from './routes/customers.js'
import reviewRoutes from './routes/reviews.js'
import couponRoutes from './routes/coupons.js'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Product from './models/Product.js'
import Admin from './models/Admin.js'
import bcrypt from 'bcryptjs'

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return cb(null, true)
    }
    cb(new Error(`CORS blocked: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json())

console.log('[ENV] JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✓' : 'MISSING ✗')
console.log('[ENV] MONGO_URI:', process.env.MONGO_URI || '(using default)')
console.log('[ENV] CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'SET ✓' : 'MISSING ✗')

let dbUri = process.env.MONGO_URI
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL || process.env.NODE_ENV === 'production'

if (dbUri) {
  try {
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 })
    console.log('MongoDB connected to ATLAS')
  } catch (atlasErr) {
    console.error('Atlas connection failed:', atlasErr.message)
    if (isVercel) {
      console.error('CRITICAL: Cannot connect to MongoDB Atlas on Vercel.')
      console.error('Please ensure you have allowed access from anywhere (0.0.0.0/0) in MongoDB Atlas Network Access.')
      throw atlasErr
    }
    console.log('Falling back to in-memory database...')
    const mongod = await MongoMemoryServer.create()
    dbUri = mongod.getUri()
    await mongoose.connect(dbUri)
    console.log('In-memory MongoDB connected')
  }
} else {
  if (isVercel) {
    throw new Error('MONGO_URI is missing. Set it in Vercel Environment Variables.')
  }
  console.log('No MONGO_URI provided, starting in-memory database...')
  const mongod = await MongoMemoryServer.create()
  dbUri = mongod.getUri()
  await mongoose.connect(dbUri)
}

console.log(`MongoDB connected successfully to ${dbUri && dbUri.includes('memory') ? 'IN-MEMORY' : 'ATLAS'} DATABASE`)

const count = await Product.countDocuments()
if (count === 0) {
  const sampleProducts = [
    { name: 'Reynolds Blue Ballpoint Pen (Pack of 10)', description: 'Smooth writing.', price: 55, category: 'Pens', stock: 200, sku: 'PEN-001', image: '' },
    { name: 'Cello Gel Pen Set (20 Colors)', description: 'Pack of 20 colorful gel pens.', price: 180, category: 'Pens', stock: 80, sku: 'PEN-002', image: '' },
    { name: 'Parker Vector Fountain Pen', description: 'Classic Parker Vector.', price: 350, category: 'Pens', stock: 30, sku: 'PEN-003', image: '' },
    { name: 'A4 Ruled Notebook (200 Pages)', description: 'Premium A4 single-ruled notebook.', price: 80, category: 'Notebooks', stock: 150, sku: 'NB-001', image: '' },
    { name: 'Faber-Castell Color Pencils (36 Shades)', description: 'Faber-Castell colour pencils.', price: 395, category: 'Art Supplies', stock: 60, sku: 'ART-002', image: '' }
  ]
  await Product.insertMany(sampleProducts)
  console.log('Database seeded automatically!')
}

const adminCount = await Admin.countDocuments()
if (adminCount === 0) {
  const passwordHash = await bcrypt.hash('admin123', 12)
  await Admin.create({ username: 'admin', passwordHash })
  console.log('Admin account created! Username: admin | Password: admin123')
}

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default app
