import { useState, useEffect, useRef } from 'react'
import {
  User, Shield, Award, History, Settings, Mail, Calendar,
  CheckCircle2, Download, Camera, Upload, Trash2, Edit3,
  Sparkles, Check, AlertCircle, RefreshCw, X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Navbar, Footer } from '../components/Layout'
import './Profile.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BACKEND_URL = API.replace('/api', '')

// Koleksi preset avatar fashion & streetwear keren
const PRESET_AVATARS = [
  { id: 'sneakerhead', label: 'Sneakerhead', emoji: '👟' },
  { id: 'streetwear',  label: 'Streetwear',  emoji: '🧥' },
  { id: 'denim',       label: 'Denim Head',  emoji: '👖' },
  { id: 'cap',         label: 'Cap Collector', emoji: '🧢' },
  { id: 'luxury',      label: 'Luxury Connoisseur', emoji: '🕶️' },
  { id: 'expert',      label: 'AI Authenticator', emoji: '🤖' },
]

export default function ProfilePage() {
  const fileInputRef = useRef(null)

  // Load user data from localStorage or default
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('relegit_user') || 'null') || {
      name: 'Pengguna Relegit',
      email: 'user@relegit.com',
      role: 'Fashion Collector & Authenticator',
      bio: 'Pecinta vintage fashion, denim archival, dan sneaker authenticity enthusiast.',
      avatar: null
    }
  })

  const [token] = useState(() => localStorage.getItem('relegit_token'))
  const [isEditing, setIsEditing] = useState(false)
  const [formName, setFormName] = useState(user.name || '')
  const [formBio, setFormBio] = useState(user.bio || '')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPresets, setShowPresets] = useState(false)

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Update local storage and trigger global navbar update
  const saveUserLocally = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('relegit_user', JSON.stringify(newUser))
    window.dispatchEvent(new Event('relegit_user_updated'))
  }

  // Handle File Upload from Gallery / Device
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WebP).', 'error')
      return
    }

    // Validasi ukuran (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5MB.', 'error')
      return
    }

    setLoading(true)

    // Buat data URL preview
    const reader = new FileReader()
    reader.onload = async (event) => {
      const previewUrl = event.target.result

      // Coba kirim ke Backend jika login
      if (token) {
        try {
          const formData = new FormData()
          formData.append('avatar', file)
          formData.append('name', user.name)

          const { data } = await axios.put(`${API}/auth/profile`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          })

          saveUserLocally(data.user)
          showToast('Foto profil berhasil diupload & disimpan! 🎉')
        } catch (err) {
          console.warn('[Profile] Upload ke backend gagal, menyimpan ke cache lokal:', err.message)
          // Fallback simpan lokal data URL jika backend/DB offline
          saveUserLocally({ avatar: previewUrl })
          showToast('Foto profil berhasil diperbarui! 🎉')
        }
      } else {
        // Mode guest / demo
        saveUserLocally({ avatar: previewUrl })
        showToast('Foto profil berhasil diperbarui! 🎉')
      }

      setLoading(false)
    }

    reader.readAsDataURL(file)
    // Reset input
    e.target.value = ''
  }

  // Handle Hapus Foto Profil
  const handleRemoveAvatar = async () => {
    if (!user.avatar) return
    setLoading(true)

    if (token) {
      try {
        const formData = new FormData()
        formData.append('removeAvatar', 'true')
        const { data } = await axios.put(`${API}/auth/profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        })
        saveUserLocally(data.user)
        showToast('Foto profil berhasil dihapus.')
      } catch (err) {
        saveUserLocally({ avatar: null })
        showToast('Foto profil berhasil dihapus.')
      }
    } else {
      saveUserLocally({ avatar: null })
      showToast('Foto profil berhasil dihapus.')
    }

    setLoading(false)
  }

  // Handle Pilih Preset Avatar
  const handleSelectPreset = async (presetEmoji) => {
    // Generate an SVG data-URI avatar with the selected emoji
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#4c1d95"/>
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="64" fill="url(#bg)"/>
      <text x="64" y="78" font-size="58" text-anchor="middle" dominant-baseline="middle">${presetEmoji}</text>
    </svg>`
    const presetDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`

    setLoading(true)
    saveUserLocally({ avatar: presetDataUrl })
    setShowPresets(false)
    showToast(`Avatar ${presetEmoji} berhasil dipilih! 🎉`)
    setLoading(false)
  }

  // Handle Submit Edit Nama & Bio
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!formName.trim()) {
      showToast('Nama tidak boleh kosong.', 'error')
      return
    }

    setLoading(true)
    if (token) {
      try {
        const formData = new FormData()
        formData.append('name', formName.trim())
        formData.append('bio', formBio.trim())

        const { data } = await axios.put(`${API}/auth/profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        })

        saveUserLocally(data.user)
        setIsEditing(false)
        showToast('Data profil berhasil diperbarui! 🎉')
      } catch (err) {
        console.warn('Update backend error, saving locally:', err.message)
        saveUserLocally({ name: formName.trim(), bio: formBio.trim() })
        setIsEditing(false)
        showToast('Data profil berhasil diperbarui! 🎉')
      }
    } else {
      saveUserLocally({ name: formName.trim(), bio: formBio.trim() })
      setIsEditing(false)
      showToast('Data profil berhasil diperbarui! 🎉')
    }
    setLoading(false)
  }

  // Helper render URL foto
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) {
      return avatarPath
    }
    return `${BACKEND_URL}${avatarPath}`
  }

  return (
    <>
      <Navbar />

      <div className="verify-page" style={{ paddingTop: '6rem' }}>
        <div className="verify-page-bg-orb verify-page-bg-orb-1" />
        <div className="verify-page-bg-orb verify-page-bg-orb-2" />

        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>

            {/* User Profile Card Header */}
            <div className="profile-card">
              <div className="profile-header-layout">
                {/* ── Interactive Avatar ── */}
                <div>
                  <div
                    className="profile-avatar-wrapper"
                    onClick={() => fileInputRef.current?.click()}
                    title="Klik untuk mengganti foto profil"
                  >
                    <div className="profile-avatar-display">
                      {user.avatar ? (
                        <img
                          src={getAvatarUrl(user.avatar)}
                          alt={user.name}
                          className="profile-avatar-img"
                        />
                      ) : (
                        (user.name?.[0] || 'U').toUpperCase()
                      )}
                    </div>

                    <div className="profile-avatar-hover-overlay">
                      <Camera size={22} />
                      <span>Ganti Foto</span>
                    </div>

                    <div className="profile-avatar-badge" title="Ganti foto profil">
                      <Camera size={16} />
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    style={{ display: 'none' }}
                  />
                </div>

                {/* ── User Information ── */}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.2rem' }}>
                      {user.name}
                    </h1>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(!isEditing)}
                      style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                    >
                      <Edit3 size={14} /> {isEditing ? 'Tutup Edit' : 'Edit Profil'}
                    </button>
                  </div>

                  <p style={{ color: 'var(--purple-300)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    <Mail size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                    {user.email}
                  </p>

                  {user.bio && (
                    <p style={{ color: 'var(--gray-300)', fontSize: '0.875rem', marginBottom: '0.75rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{user.bio}"
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-purple">
                      <Shield size={12} /> {user.role || 'Member'}
                    </span>
                    <span className="badge badge-green">
                      <CheckCircle2 size={12} /> Akun Terverifikasi
                    </span>
                  </div>

                  {/* Avatar Quick Action Buttons */}
                  <div className="profile-avatar-actions">
                    <button
                      type="button"
                      className="btn-avatar-action"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                    >
                      <Upload size={13} /> {loading ? 'Memproses...' : 'Unggah Foto Baru'}
                    </button>

                    <button
                      type="button"
                      className="btn-avatar-action"
                      onClick={() => setShowPresets(!showPresets)}
                    >
                      <Sparkles size={13} /> Preset Avatar Keren
                    </button>

                    {user.avatar && (
                      <button
                        type="button"
                        className="btn-avatar-action danger"
                        onClick={handleRemoveAvatar}
                        disabled={loading}
                      >
                        <Trash2 size={13} /> Hapus Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Preset Avatars Drawer ── */}
              {showPresets && (
                <div className="preset-avatars-box">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--purple-300)' }}>
                      Pilih Preset Avatar Streetwear & Fashion:
                    </p>
                    <button
                      onClick={() => setShowPresets(false)}
                      style={{ all: 'unset', cursor: 'pointer', color: 'var(--gray-400)' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="preset-avatars-grid">
                    {PRESET_AVATARS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className="preset-avatar-btn"
                        title={preset.label}
                        onClick={() => handleSelectPreset(preset.emoji)}
                      >
                        {preset.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Edit Profile Form Box (Collapsible) ── */}
            {isEditing && (
              <div className="profile-edit-box">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit3 size={18} className="text-purple" /> Pengaturan Informasi Akun
                </h3>

                <form onSubmit={handleSaveProfile}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap / Display Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio / Fashion Bio</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      placeholder="Contoh: Sneakerhead Jakarta • Vintage Denim Archivalist • Jordan 1 Collector"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={14} className="spin" /> Menyimpan...
                        </>
                      ) : (
                        <>
                          <Check size={14} /> Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* User Statistics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--purple-400)' }}>12</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Total Audit Fashion</p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399' }}>10</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Item Authentic (Original)</p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: '#f87171' }}>2</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Terdeteksi Fake</p>
              </div>
            </div>

            {/* User Saved Certificates */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} className="text-purple" /> Sertifikat Digital Tersimpan
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>Levi's 511 Slim Fit Jeans</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>ID: RLG-2026-5110-LEVI • 92% Authentic</p>
                  </div>
                  <Link to="/verify" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                    <Download size={14} /> View Certificate
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {toast && (
        <div className="profile-toast">
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="#f87171" />
          ) : (
            <CheckCircle2 size={18} color="#34d399" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <Footer />
    </>
  )
}
