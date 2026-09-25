import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, LogOut, User, History, Upload } from 'lucide-react'
import './Layout.css'

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')

/* ── Navbar ─────────────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('relegit_user') || 'null')
  })
  const navigate = useNavigate()

  const token = localStorage.getItem('relegit_token')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)

    const handleUserUpdate = () => {
      setCurrentUser(JSON.parse(localStorage.getItem('relegit_user') || 'null'))
    }
    window.addEventListener('relegit_user_updated', handleUserUpdate)
    window.addEventListener('storage', handleUserUpdate)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('relegit_user_updated', handleUserUpdate)
      window.removeEventListener('storage', handleUserUpdate)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('relegit_token')
    localStorage.removeItem('relegit_user')
    setCurrentUser(null)
    window.dispatchEvent(new Event('relegit_user_updated'))
    window.dispatchEvent(new Event('relegit_auth_changed'))
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-icon">
              <Shield size={18} />
            </span>
            Relegit
          </Link>

          {/* Desktop Links */}
          <ul className="navbar-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/verify">Authenticate</NavLink></li>
            <li><NavLink to="/history">History</NavLink></li>
            <li><NavLink to="/community">Community (V2)</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {token ? (
              <>
                <div
                  className="navbar-avatar"
                  title={currentUser?.name || 'Profile'}
                  onClick={() => navigate('/profile')}
                  style={{ overflow: 'hidden', padding: 0 }}
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:') ? currentUser.avatar : `${BACKEND_URL}${currentUser.avatar}`}
                      alt={currentUser.name || 'User'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    (currentUser?.name?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Daftar Gratis</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            id="navbar-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link></li>
          <li><Link to="/verify" onClick={() => setMenuOpen(false)}>📷 Authenticate</Link></li>
          <li><Link to="/history" onClick={() => setMenuOpen(false)}>🕒 History</Link></li>
          <li><Link to="/community" onClick={() => setMenuOpen(false)}>👥 Community (V2)</Link></li>
          <li><Link to="/profile" onClick={() => setMenuOpen(false)}>👤 Profile</Link></li>
          {token ? (
            <>
              <li style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', background: 'var(--gradient-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:') ? currentUser.avatar : `${BACKEND_URL}${currentUser.avatar}`}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    (currentUser?.name?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{currentUser?.name || 'User'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--purple-300)' }}>{currentUser?.email}</div>
                </div>
              </li>
              <li><button onClick={handleLogout} style={{all:'unset',cursor:'pointer',padding:'0.75rem 1rem',display:'block',color:'#f87171',width:'100%'}}>🚪 Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)}>🔑 Login</Link></li>
              <li><Link to="/register" onClick={() => setMenuOpen(false)}>✨ Daftar</Link></li>
            </>
          )}
        </ul>
      </div>
      {menuOpen && (
        <div
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:998}}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */
export function Footer() {
  const [activeModal, setActiveModal] = useState(null) // 'privasi' | 'syarat' | 'kontak' | null

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="navbar-logo" style={{display:'inline-flex'}}>
                <span className="navbar-logo-icon"><Shield size={16}/></span>
                Relegit
              </Link>
              <p>Platform autentikasi keaslian fashion berbasis AI. Verifikasi barang fashion Anda secara cepat, akurat, dan terpercaya.</p>
            </div>

            <div>
              <p className="footer-heading">Fitur</p>
              <ul className="footer-links">
                <li><Link to="/verify">AI Verify</Link></li>
                <li><Link to="/history">Riwayat</Link></li>
                <li><Link to="/about">Cara Kerja</Link></li>
              </ul>
            </div>

            <div>
              <p className="footer-heading">Akun</p>
              <ul className="footer-links">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Daftar</Link></li>
              </ul>
            </div>

            <div>
              <p className="footer-heading">Legal & Kontak</p>
              <ul className="footer-links">
                <li>
                  <button onClick={() => setActiveModal('privasi')} style={{ all: 'unset', cursor: 'pointer' }}>
                    Privasi
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('syarat')} style={{ all: 'unset', cursor: 'pointer' }}>
                    Syarat & Ketentuan
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('kontak')} style={{ all: 'unset', cursor: 'pointer' }}>
                    Kontak Kami
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Relegit. All rights reserved.</p>
            <p>Dibangun untuk komunitas fashion Indonesia 🇮🇩</p>
          </div>
        </div>
      </footer>

      {/* Interactive Legal Modals */}
      {activeModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)',
            padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative'
          }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
              }}
            >
              ×
            </button>

            {activeModal === 'privasi' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--purple-300)' }}>
                  🔒 Kebijakan Privasi Relegit
                </h3>
                <p style={{ color: 'var(--gray-300)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1rem' }}>
                  Relegit berkomitmen penuh untuk melindungi kerahasiaan dan privasi data pengguna. Semua foto fashion yang diunggah hanya digunakan untuk keperluan analisis AI dan audit autentikasi keaslian barang.
                </p>
                <ul style={{ color: 'var(--gray-300)', lineHeight: 1.7, fontSize: '0.9rem', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                  <li>Foto Anda disimpan dengan enkripsi aman di server kami.</li>
                  <li>Data pribadi pengguna tidak akan dijual atau dibagikan ke pihak ketiga.</li>
                  <li>Anda berhak menghapus riwayat verifikasi dan akun Anda kapan saja.</li>
                </ul>
              </div>
            )}

            {activeModal === 'syarat' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--purple-300)' }}>
                  📜 Syarat & Ketentuan Layanan
                </h3>
                <p style={{ color: 'var(--gray-300)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1rem' }}>
                  Dengan menggunakan platform Relegit, Anda menyetujui syarat dan ketentuan berikut:
                </p>
                <ul style={{ color: 'var(--gray-300)', lineHeight: 1.7, fontSize: '0.9rem', paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                  <li>Hasil verifikasi berbasis analisis AI dan dirancang sebagai alat bantu pendukung autentikasi.</li>
                  <li>Dilarang mengunggah gambar yang melanggar hukum, konten terlarang, atau bukan produk fashion.</li>
                  <li>Sertifikat digital Relegit diterbitkan secara sah untuk tiap audit yang berhasil diselesaikan.</li>
                </ul>
              </div>
            )}

            {activeModal === 'kontak' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--purple-300)' }}>
                  💬 Hubungi Kami
                </h3>
                <p style={{ color: 'var(--gray-300)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                  Ada pertanyaan, kendala, atau masukan untuk pengembangan platform Relegit? Tim kami siap membantu!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.9rem' }}>📧 <strong>Email Support:</strong> support@relegit.com</p>
                  <p style={{ fontSize: '0.9rem' }}>📱 <strong>WhatsApp Community:</strong> +62 812-3456-7890</p>
                  <p style={{ fontSize: '0.9rem' }}>⏰ <strong>Jam Operasional:</strong> Senin – Minggu (08.00 – 22.00 WIB)</p>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary mt-4"
              onClick={() => setActiveModal(null)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}
