import mongoose from 'mongoose'
import Product from './models/Product.js'

// Sample data
const sampleProducts = [
  {
    name: 'Premium Ballpoint Pen Set',
    description: 'A set of 12 premium ballpoint pens with smooth ink flow and comfortable grip. Perfect for everyday writing and professional use.',
    price: 24.99,
    category: 'Pens',
    stock: 50,
    sku: 'PEN-001',
    image: ''
  },
  {
    name: 'Leather Bound Notebook',
    description: 'Elegant leather-bound notebook with 200 pages of high-quality paper. Ideal for journaling, note-taking, and sketching.',
    price: 34.99,
    category: 'Notebooks',
    stock: 30,
    sku: 'NB-001',
    image: ''
  },
  {
    name: 'Watercolor Paint Set',
    description: 'Professional-grade watercolor paint set with 24 vibrant colors. Includes brushes and palette for artists of all levels.',
    price: 45.99,
    category: 'Art Supplies',
    stock: 25,
    sku: 'ART-001',
    image: ''
  },
  {
    name: 'Desk Organizer',
    description: 'Multi-compartment desk organizer to keep your workspace tidy. Made from durable bamboo with multiple storage slots.',
    price: 29.99,
    category: 'Office Supplies',
    stock: 40,
    sku: 'OFF-001',
    image: ''
  },
  {
    name: 'Gel Pen Pack',
    description: 'Pack of 20 colorful gel pens with 0.5mm tip. Perfect for bullet journaling, coloring, and creative projects.',
    price: 18.99,
    category: 'Pens',
    stock: 60,
    sku: 'PEN-002',
    image: ''
  },
  {
    name: 'Spiral Notebook College Ruled',
    description: 'Classic spiral notebook with 100 sheets of college-ruled paper. Durable cover and perforated pages for easy removal.',
    price: 5.99,
    category: 'Notebooks',
    stock: 100,
    sku: 'NB-002',
    image: ''
  },
  {
    name: 'Sketchbook A4',
    description: 'Professional sketchbook with 80 sheets of 150gsm acid-free paper. Perfect for pencil, charcoal, and light watercolor.',
    price: 15.99,
    category: 'Art Supplies',
    stock: 45,
    sku: 'ART-002',
    image: ''
  },
  {
    name: 'Stapler with Staples',
    description: 'Heavy-duty stapler with 1000 staples included. Can staple up to 20 sheets at once. Ergonomic design for comfort.',
    price: 12.99,
    category: 'Office Supplies',
    stock: 55,
    sku: 'OFF-002',
    image: ''
  },
  {
    name: 'A4 Paper Ream',
    description: 'Premium quality A4 paper, 500 sheets per ream. 80gsm weight, perfect for printing and copying. Bright white finish.',
    price: 8.99,
    category: 'Paper',
    stock: 80,
    sku: 'PAP-001',
    image: ''
  },
  {
    name: 'Expanding File Folder',
    description: '13-pocket expanding file organizer for document storage. Durable poly material with elastic closure and labels.',
    price: 14.99,
    category: 'Folders',
    stock: 35,
    sku: 'FLD-001',
    image: ''
  },
  {
    name: 'Scientific Calculator',
    description: 'Advanced scientific calculator with 240 functions. Solar and battery powered. Perfect for students and professionals.',
    price: 19.99,
    category: 'Calculators',
    stock: 40,
    sku: 'CAL-001',
    image: ''
  },
  {
    name: 'Highlighter Set',
    description: 'Set of 6 pastel highlighters with chisel tip. Quick-drying, smear-resistant ink. Perfect for studying and note-taking.',
    price: 9.99,
    category: 'Highlighters',
    stock: 70,
    sku: 'HGH-001',
    image: ''
  }
]

// Seed database
mongoose.connect('mongodb://localhost:27017/stationery-catalog')
.then(async () => {
  console.log('Connected to MongoDB')
  
  // Clear existing products
  await Product.deleteMany({})
  console.log('Cleared existing products')
  
  // Insert sample products
  await Product.insertMany(sampleProducts)
  console.log('Sample products inserted successfully')
  
  mongoose.connection.close()
  console.log('Database connection closed')
})
.catch((err) => {
  console.error('Error seeding database:', err)
  process.exit(1)
})
