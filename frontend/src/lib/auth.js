import jwt from 'jsonwebtoken'

function verify(request) {
  const header = request.headers.get('authorization')
  if (!header || !header.startsWith('Bearer ')) {
    return { error: { status: 401, message: 'Unauthorized' } }
  }
  try {
    return { payload: jwt.verify(header.slice(7), process.env.JWT_SECRET) }
  } catch {
    return { error: { status: 401, message: 'Invalid or expired token' } }
  }
}

// Mirrors backend/middleware/auth.js's requireAuth (admin-only)
export function getAuthAdmin(request) {
  const { payload, error } = verify(request)
  if (error) return { error }
  if (payload.role === 'customer') {
    return { error: { status: 403, message: 'Admin access required' } }
  }
  return { payload }
}

// Mirrors backend/middleware/auth.js's requireCustomerAuth
export function getAuthCustomer(request) {
  const { payload, error } = verify(request)
  if (error) return { error }
  if (payload.role !== 'customer') {
    return { error: { status: 403, message: 'Customer access required' } }
  }
  return { payload }
}
