// One-time admin creation script for Supabase
// Usage: node scripts/createAdmin.js
//
// Before running, set SUPABASE_SERVICE_KEY in .env or export it:
//   $env:SUPABASE_SERVICE_KEY="your-service-role-key"
//
// Get service role key from: Supabase Dashboard → Settings → API → service_role

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hudavygusqnjwttcrzdm.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_KEY env var not set.')
  console.error('Get it from: Supabase Dashboard → Settings → API → service_role')
  process.exit(1)
}

// Admin credentials — change these
const ADMIN_EMAIL = 'admin@kuldevistationers.com'
const ADMIN_PASSWORD = 'Kuldevi@Admin2025!'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createAdmin() {
  console.log(`Creating admin user: ${ADMIN_EMAIL}`)

  // 1. Create user in Supabase Auth
  const { data: { user }, error: signUpErr } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  })

  if (signUpErr) {
    if (signUpErr.message.includes('already registered')) {
      console.log('User already exists — skipping creation, will still insert into admins table.')
      // Fetch existing user
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const existing = users.find(u => u.email === ADMIN_EMAIL)
      if (!existing) { console.error('Could not find existing user.'); process.exit(1) }
      await insertAdmin(existing.id, ADMIN_EMAIL)
    } else {
      console.error('Failed to create user:', signUpErr.message)
      process.exit(1)
    }
    return
  }

  console.log(`User created: ${user.id}`)
  await insertAdmin(user.id, ADMIN_EMAIL)
}

async function insertAdmin(userId, email) {
  const { error } = await supabase.from('admins').upsert({ user_id: userId, email }, { onConflict: 'user_id' })
  if (error) {
    console.error('Failed to insert into admins table:', error.message)
    console.error('Make sure you ran database/schema.sql in Supabase first.')
    process.exit(1)
  }
  console.log('Admin created successfully!')
  console.log(`  Email:    ${email}`)
  console.log(`  Password: ${ADMIN_PASSWORD}`)
  console.log('\nLogin at: http://localhost:3000/admin/login')
}

createAdmin()
