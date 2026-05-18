/**
 * Create or reset admin account:
 *   node server/createAdmin.js
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
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stationery-catalog')
  console.log('Connected to MongoDB\n')

  const existing = await Admin.countDocuments()
  if (existing > 0) {
    const overwrite = await ask(`${existing} admin(s) exist. Overwrite all? (yes/no): `)
    if (overwrite.trim().toLowerCase() !== 'yes') {
      console.log('Aborted.')
      process.exit(0)
    }
    await Admin.deleteMany({})
    console.log('Existing admins deleted.\n')
  }

  const username = await ask('Username: ')
  const password = await ask('Password: ')

  const passwordHash = await bcrypt.hash(password.trim(), 12)
  await Admin.create({ username: username.trim(), passwordHash })

  console.log(`\nAdmin "${username.trim()}" created successfully!`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => { rl.close(); mongoose.disconnect() })
