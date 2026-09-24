import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, LogOut, User, History, Upload } from 'lucide-react'
import './Layout.css'

/* ── Navbar ─────────────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('relegit_token')
  const user  = JSON.parse(localStorage.getItem('relegit_user') || 'null')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('relegit_token')
    localStorage.removeItem('relegit_user')
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
                  title={user?.name || 'Profile'}
                  onClick={() => navigate('/profile')}
                >
                  {(user?.name?.[0] || 'U').toUpperCase()}
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
            <li><button onClick={handleLogout} style={{all:'unset',cursor:'pointer',padding:'0.75rem 1rem',display:'block',color:'#f87171'}}>🚪 Logout</button></li>
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
  return (
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
            <p className="footer-heading">Legal</p>
            <ul className="footer-links">
              <li><Link to="#">Privasi</Link></li>
              <li><Link to="#">Syarat</Link></li>
              <li><Link to="#">Kontak</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Relegit. All rights reserved.</p>
          <p>Dibangun untuk komunitas fashion Indonesia 🇮🇩</p>
        </div>
      </div>
    </footer>
  )
}
