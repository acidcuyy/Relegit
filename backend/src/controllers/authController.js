import bcrypt from 'bcryptjs'
import { prisma }        from '../lib/prisma.js'
import { generateToken } from '../middleware/auth.js'

/* ── POST /api/auth/register ─────────────────────────────── */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter.' })
    }

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return res.status(201).json({
      message: 'Registrasi berhasil!',
      user,
    })
  } catch (err) {
    console.error('[register]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

/* ── POST /api/auth/login ────────────────────────────────── */
export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' })
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role })

    return res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id:        user.id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

/* ── GET /api/auth/me ────────────────────────────────────── */
export async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' })
    return res.json({ user })
  } catch (err) {
    console.error('[me]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}
