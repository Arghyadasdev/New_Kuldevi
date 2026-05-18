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

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

console.log('[ENV] JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✓' : 'MISSING ✗')
console.log('[ENV] MONGO_URI:', process.env.MONGO_URI || '(using default)')

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stationery-catalog')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
