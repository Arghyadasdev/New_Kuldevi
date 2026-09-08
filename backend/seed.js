import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import Admin from './models/Admin.js'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '.env') })

const sampleProducts = [
  // Pens
  { name: 'Pilot G2 Premium Gel Pens (Pack of 5)', description: 'Fine point, black ink gel pens for ultra-smooth writing.', price: 250, category: 'Pens', stock: 150, sku: 'PEN-004', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&auto=format&fit=crop&q=60' },
  { name: 'Uniball Jetstream Sport', description: 'Quick-drying, smear-resistant ballpoint pen.', price: 120, category: 'Pens', stock: 300, sku: 'PEN-005', image: '' },
  { name: 'Lamy Safari Fountain Pen - Matte Black', description: 'Iconic German fountain pen with medium steel nib.', price: 2450, category: 'Pens', stock: 45, sku: 'PEN-006', image: 'https://images.unsplash.com/photo-1581403061611-39665bc7e4d4?w=500&auto=format&fit=crop&q=60' },
  { name: 'Zebra Sarasa Clip 0.5mm (Vintage Colors)', description: 'Set of 5 vintage colored gel pens.', price: 450, category: 'Pens', stock: 85, sku: 'PEN-007', image: '' },

  // Notebooks
  { name: 'Moleskine Classic Hardcover', description: 'Ruled notebook, large, black.', price: 1800, category: 'Notebooks', stock: 120, sku: 'NB-002', image: 'https://images.unsplash.com/photo-1531346878377-a541e4b11340?w=500&auto=format&fit=crop&q=60' },
  { name: 'Leuchtturm1917 Dotted Journal', description: 'A5 size, dotted pages, perfect for bullet journaling.', price: 2100, category: 'Notebooks', stock: 90, sku: 'NB-003', image: 'https://images.unsplash.com/photo-1571366992791-2ad2078656cb?w=500&auto=format&fit=crop&q=60' },
  { name: 'Classmate Pulse Spiral Notebook', description: 'A4 size, 300 pages, unruled.', price: 165, category: 'Notebooks', stock: 500, sku: 'NB-004', image: '' },
  
  // Art Supplies
  { name: 'Winsor & Newton Cotman Watercolours', description: '12 half-pan sketchers pocket box.', price: 1600, category: 'Art Supplies', stock: 40, sku: 'ART-003', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60' },
  { name: 'Prismacolor Premier Colored Pencils (48 Pack)', description: 'Soft core colored pencils for blending and shading.', price: 4200, category: 'Art Supplies', stock: 25, sku: 'ART-004', image: 'https://images.unsplash.com/photo-1582851571216-724391ea6b6f?w=500&auto=format&fit=crop&q=60' },
  { name: 'Strathmore 400 Series Sketch Pad', description: '9x12 inch, 100 sheets, 60lb paper.', price: 750, category: 'Art Supplies', stock: 110, sku: 'ART-005', image: '' },
  
  // Office Supplies
  { name: 'Post-it Notes 3x3 (Pack of 5)', description: 'Canary yellow sticky notes.', price: 220, category: 'Office Supplies', stock: 400, sku: 'OFF-001', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=60' },
  { name: 'Kangaroo Stapler with Pins', description: 'Heavy duty stapler includes box of 1000 staples.', price: 340, category: 'Office Supplies', stock: 160, sku: 'OFF-002', image: '' },
  { name: 'Binder Clips (Assorted Sizes)', description: 'Tub of 60 binder clips.', price: 150, category: 'Office Supplies', stock: 350, sku: 'OFF-003', image: 'https://images.unsplash.com/photo-1594980596870-8caa52a79d00?w=500&auto=format&fit=crop&q=60' },

  // Desk Accessories
  { name: 'Bamboo Desk Organizer', description: 'Multi-compartment organizer for pens and phone.', price: 850, category: 'Desk Accessories', stock: 55, sku: 'DSK-001', image: 'https://images.unsplash.com/photo-1507914372368-b2b085ca884d?w=500&auto=format&fit=crop&q=60' },
  { name: 'Leather Mouse Pad (Extended)', description: 'Premium vegan leather desk mat.', price: 1200, category: 'Desk Accessories', stock: 80, sku: 'DSK-002', image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500&auto=format&fit=crop&q=60' },
  { name: 'Metallic Pen Stand', description: 'Rose gold mesh pen holder.', price: 299, category: 'Desk Accessories', stock: 220, sku: 'DSK-003', image: '' },
]

async function seed() {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI)
    
    console.log('Clearing existing products...')
    await Product.deleteMany({})
    
    console.log('Inserting new sample products...')
    await Product.insertMany(sampleProducts)
    
    const count = await Product.countDocuments()
    console.log(`Successfully seeded ${count} products!`)

    // Ensure admin exists
    const adminCount = await Admin.countDocuments()
    if (adminCount === 0) {
      console.log('Creating default admin account...')
      const passwordHash = await bcrypt.hash('admin123', 12)
      await Admin.create({ username: 'admin', passwordHash })
    }

    console.log('Seeding complete. Exiting.')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seed()
