import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Product from '@/models/Product'
import Admin from '@/models/Admin'

let cached = global._mongooseCache
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null, seeded: false }
}

async function connect() {
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL || process.env.NODE_ENV === 'production'
  let dbUri = process.env.MONGO_URI

  console.log('[ENV] JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✓' : 'MISSING ✗')
  console.log('[ENV] MONGO_URI:', dbUri || '(using default)')
  console.log('[ENV] CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'SET ✓' : 'MISSING ✗')

  if (dbUri) {
    try {
      await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 })
      console.log('MongoDB connected to ATLAS')
      return
    } catch (atlasErr) {
      console.error('Atlas connection failed:', atlasErr.message)
      if (isVercel) {
        console.error('CRITICAL: Cannot connect to MongoDB Atlas on Vercel.')
        console.error('Please ensure you have allowed access from anywhere (0.0.0.0/0) in MongoDB Atlas Network Access.')
        throw atlasErr
      }
      console.log('Falling back to in-memory database...')
    }
  } else if (isVercel) {
    throw new Error('MONGO_URI is missing. Set it in Vercel Environment Variables.')
  } else {
    console.log('No MONGO_URI provided, starting in-memory database...')
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
  console.log('In-memory MongoDB connected')
}

async function seedIfNeeded() {
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
}

export default async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = connect().then(() => mongoose.connection)
  }
  cached.conn = await cached.promise

  if (!cached.seeded) {
    cached.seeded = true
    await seedIfNeeded()
  }

  return cached.conn
}
