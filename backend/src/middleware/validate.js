import { z } from 'zod'

/* ── Zod Validation Schemas ──────────────────────────────── */

export const registerSchema = z.object({
  name: z.string({ required_error: 'Nama lengkap wajib diisi.' })
    .min(2, 'Nama lengkap minimal 2 karakter.')
    .max(100, 'Nama terlalu panjang.'),
  username: z.string({ required_error: 'Username wajib diisi.' })
    .min(3, 'Username minimal 3 karakter.')
    .max(30, 'Username maksimal 30 karakter.')
    .regex(/^[a-zA-Z0-9._]+$/, 'Username hanya boleh huruf, angka, titik (.), dan underscore (_) tanpa spasi.'),
  email: z.string({ required_error: 'Email wajib diisi.' })
    .email('Format email tidak valid.'),
  password: z.string({ required_error: 'Password wajib diisi.' })
    .min(8, 'Password minimal 8 karakter.'),
})

export const loginSchema = z.object({
  username: z.string({ required_error: 'Username wajib diisi.' })
    .min(1, 'Username tidak boleh kosong.'),
  password: z.string({ required_error: 'Password wajib diisi.' })
    .min(1, 'Password tidak boleh kosong.'),
})

/* ── Middleware Generator ────────────────────────────────── */

export function validateRequest(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstIssue = err.issues[0]
        return res.status(400).json({
          message: firstIssue ? firstIssue.message : 'Validasi data gagal.',
          errors: err.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
        })
      }
      next(err)
    }
  }
}
