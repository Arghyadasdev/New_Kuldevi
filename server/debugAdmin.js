/**
 * Debug: check what admins exist in DB and test password
 * Usage: node server/debugAdmin.js
 */
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '.env') })

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from './models/Admin.js'
import readline from 'readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

async function main() {
  console.log('MONGO_URI:', process.env.MONGO_URI || '(not set — using default)')
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '(set)' : '(NOT SET — this is the problem!)')
  console.log('')

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stationery-catalog')
  console.log('MongoDB connected\n')

  const admins = await Admin.find({}, 'username createdAt')
  console.log(`Admins in DB: ${admins.length}`)
  admins.forEach(a => console.log(` - username: "${a.username}"  created: ${a.createdAt}`))

  if (admins.length === 0) {
    console.log('\nNo admins found. Run: node server/createAdmin.js')
    process.exit(0)
  }

  console.log('')
  const testUser = await ask('Test username to verify: ')
  const testPass = await ask('Test password: ')

  const admin = await Admin.findOne({ username: testUser.trim() })
  if (!admin) {
    console.log(`\nNo admin found with username "${testUser.trim()}"`)
    process.exit(0)
  }

  const match = await bcrypt.compare(testPass.trim(), admin.passwordHash)
  console.log(`\nPassword match: ${match ? 'YES ✓' : 'NO ✗'}`)
  if (!match) console.log('Stored hash:', admin.passwordHash)

  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => { rl.close(); mongoose.disconnect() })
