/**
 * Create an admin account in Supabase Auth + the admins table:
 *   npm run create-admin
 */
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createClient } from '@supabase/supabase-js'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env') })

const ADMIN_EMAIL_DOMAIN = 'kuldevi.internal'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set in frontend/.env')
    process.exit(1)
  }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const username = (await ask('Username: ')).trim()
  const password = (await ask('Password: ')).trim()
  const email = `${username}@${ADMIN_EMAIL_DOMAIN}`

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  })
  if (createError) {
    console.error('Failed to create user:', createError.message)
    process.exit(1)
  }

  const { error: adminError } = await supabase
    .from('admins')
    .upsert({ user_id: created.user.id, email })
  if (adminError) {
    console.error('Failed to insert into admins table:', adminError.message)
    process.exit(1)
  }

  console.log(`\nAdmin "${username}" created successfully!`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => rl.close())
