import jwt from 'jsonwebtoken'

const JWT_SECRET  = process.env.JWT_SECRET  || 'relegit_secret'
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'

/* ── Generate Token ──────────────────────────────────────── */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

/* ── Middleware: requireAuth ─────────────────────────────── */
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kadaluarsa.' })
  }
}

/* ── Middleware: optionalAuth ────────────────────────────── */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization']
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      req.user = jwt.verify(token, JWT_SECRET)
    } catch { /* ignore */ }
  }
  next()
}
