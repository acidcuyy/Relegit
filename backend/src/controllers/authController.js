import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { prisma }        from '../lib/prisma.js'
import { generateToken } from '../middleware/auth.js'

/* ── POST /api/auth/register ─────────────────────────────── */
export async function register(req, res) {
  try {
    const { name, username, email, password } = req.body

    // Validation
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Nama lengkap, username, dan password wajib diisi.' })
    }
    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    // Check existing username
    const existingUser = await prisma.user.findUnique({ where: { username: cleanUsername } })
    if (existingUser) {
      return res.status(409).json({ message: 'Username sudah digunakan, silakan pilih username lain.' })
    }

    // Check existing email
    const existingEmail = await prisma.user.findFirst({ where: { email: cleanEmail } })
    if (existingEmail) {
      return res.status(409).json({ message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        username: cleanUsername,
        email: email ? email.toLowerCase().trim() : null,
        password: hashed,
      },
      select: { id: true, name: true, username: true, email: true, avatar: true, bio: true, role: true, createdAt: true },
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
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi.' })
    }

    const cleanUsername = username.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { username: cleanUsername } })
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah.' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Username atau password salah.' })
    }

    const token = generateToken({ id: user.id, username: user.username, role: user.role })

    return res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id:        user.id,
        name:      user.name,
        username:  user.username,
        email:     user.email,
        avatar:    user.avatar || null,
        bio:       user.bio || null,
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
      select: { id: true, name: true, email: true, avatar: true, bio: true, role: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' })
    return res.json({ user })
  } catch (err) {
    console.error('[me]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

/* ── PUT /api/auth/profile ────────────────────────────────── */
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id
    const { name, bio, removeAvatar } = req.body

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!currentUser) {
      return res.status(404).json({ message: 'User tidak ditemukan.' })
    }

    const dataToUpdate = {}
    if (name && name.trim()) {
      dataToUpdate.name = name.trim()
    }
    if (typeof bio !== 'undefined') {
      dataToUpdate.bio = bio ? bio.trim() : null
    }

    // Handle avatar upload
    if (req.file) {
      const avatarUrl = `/uploads/${req.file.filename}`
      dataToUpdate.avatar = avatarUrl

      // Clean up old local avatar file if exists
      if (currentUser.avatar && currentUser.avatar.startsWith('/uploads/')) {
        const oldFile = currentUser.avatar.replace('/uploads/', '')
        const oldPath = path.join(process.cwd(), 'uploads', oldFile)
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath) } catch (_) {}
        }
      }
    } else if (removeAvatar === 'true' || removeAvatar === true) {
      dataToUpdate.avatar = null

      if (currentUser.avatar && currentUser.avatar.startsWith('/uploads/')) {
        const oldFile = currentUser.avatar.replace('/uploads/', '')
        const oldPath = path.join(process.cwd(), 'uploads', oldFile)
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath) } catch (_) {}
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id:        true,
        name:      true,
        email:     true,
        avatar:    true,
        bio:       true,
        role:      true,
        createdAt: true,
      },
    })

    return res.json({
      message: 'Profil berhasil diperbarui!',
      user: updatedUser,
    })
  } catch (err) {
    console.error('[updateProfile]', err)
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path) } catch (_) {}
    }
    return res.status(500).json({ message: err.message || 'Gagal memperbarui profil.' })
  }
}
