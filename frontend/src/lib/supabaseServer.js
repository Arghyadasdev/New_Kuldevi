import { createClient } from '@supabase/supabase-js'

// RLS-respecting client scoped to the calling user's access token, so
// auth.uid() inside RLS policies resolves to whoever sent the request.
export function supabaseForRequest(request) {
  const authHeader = request.headers.get('authorization') || ''
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}

// Service-role client, bypasses RLS. Server-only — never expose this key to the browser.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

// Resolves the calling user (or null) from the request's bearer token.
export async function getRequestUser(request) {
  const authHeader = request.headers.get('authorization') || ''
  if (!authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const client = supabaseForRequest(request)
  const { data, error } = await client.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

async function isAdminUser(request, userId) {
  const client = supabaseForRequest(request)
  const { data } = await client.from('admins').select('user_id').eq('user_id', userId).maybeSingle()
  return !!data
}

// Mirrors the old getAuthAdmin(request) shape: { user } or { error: { status, message } }
export async function requireAdmin(request) {
  const user = await getRequestUser(request)
  if (!user) return { error: { status: 401, message: 'Unauthorized' } }
  if (!(await isAdminUser(request, user.id))) {
    return { error: { status: 403, message: 'Admin access required' } }
  }
  return { user }
}

// Mirrors the old getAuthCustomer(request) shape
export async function requireCustomer(request) {
  const user = await getRequestUser(request)
  if (!user) return { error: { status: 401, message: 'Unauthorized' } }
  if (await isAdminUser(request, user.id)) {
    return { error: { status: 403, message: 'Customer access required' } }
  }
  return { user }
}
