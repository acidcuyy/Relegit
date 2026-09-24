import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import path       from 'path'
import { fileURLToPath } from 'url'

import authRoutes   from './routes/authRoutes.js'
import verifyRoutes from './routes/verifyRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 5000

/* ── Middleware ───────────────────────────────────────────── */
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded images statically
app.use('/uploads', express.static(
  path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')
))

/* ── Routes ───────────────────────────────────────────────── */
app.use('/api/auth',   authRoutes)
app.use('/api/verify', verifyRoutes)

/* ── Health Check ─────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({
    status:  'ok',
    service: 'Relegit API',
    time:    new Date().toISOString(),
  })
})

/* ── 404 Handler ──────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' })
})

/* ── Error Handler ────────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 10MB.' })
  }
  res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan server.' })
})

/* ── Start Server ─────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🚀 Relegit API berjalan di http://localhost:${PORT}`)
  console.log(`📊 Health: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}\n`)
})
