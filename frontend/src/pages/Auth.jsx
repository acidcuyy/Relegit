import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import './Auth.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/* ── Login Page ──────────────────────────────────────────────── */
export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const onChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Semua kolom wajib diisi.'); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/login`, form)
      localStorage.setItem('relegit_token', data.token)
      localStorage.setItem('relegit_user',  JSON.stringify(data.user))
      navigate('/verify')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali email & password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon"><Shield size={20} /></span>
          Relegit
        </div>

        <h1 className="auth-title">Selamat Datang Kembali</h1>
        <p className="auth-subtitle">Masuk ke akun Relegit Anda</p>

        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
              <input
                id="login-email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="email"
                name="email"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-with-action">
              <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)', zIndex: 1 }} />
              <input
                id="login-password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Password Anda"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-footer-text">
          Belum punya akun? <Link to="/register">Daftar Gratis</Link>
        </p>
      </div>
    </div>
  )
}

/* ── Register Page ───────────────────────────────────────────── */
export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const onChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Semua kolom wajib diisi.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.')
      return
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${API}/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon"><Shield size={20} /></span>
          Relegit
        </div>

        <h1 className="auth-title">Buat Akun Baru</h1>
        <p className="auth-subtitle">Bergabung dan mulai verifikasi fashion Anda</p>

        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            {error}
          </div>
        )}

        {success && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            Registrasi berhasil! Mengarahkan ke halaman login...
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Nama Lengkap</label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              name="name"
              placeholder="Nama Anda"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
              <input
                id="reg-email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="email"
                name="email"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-with-action">
              <input
                id="reg-password"
                className="form-input"
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Minimal 8 karakter"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPw(v => !v)}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Konfirmasi Password</label>
            <input
              id="reg-confirm"
              className="form-input"
              type={showPw ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Ulangi password"
              value={form.confirmPassword}
              onChange={onChange}
              autoComplete="new-password"
            />
          </div>

          <button
            id="register-submit"
            className="btn btn-primary auth-submit"
            type="submit"
            disabled={loading || success}
          >
            {loading ? 'Mendaftarkan...' : 'Buat Akun'}
          </button>
        </form>

        <p className="auth-footer-text">
          Sudah punya akun? <Link to="/login">Masuk Sekarang</Link>
        </p>
      </div>
    </div>
  )
}
