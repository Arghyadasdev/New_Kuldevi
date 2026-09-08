import jwt from 'jsonwebtoken'

export default function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    if (decoded.role === 'customer') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    req.admin = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireCustomerAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Customer access required' })
    }
    req.customer = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
