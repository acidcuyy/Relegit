import { useState, useEffect } from 'react'

export default function Home() {
  const [token, setToken] = useState(() => localStorage.getItem('relegit_token'))
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem('relegit_user') || 'null'))

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('relegit_token'))
      setUser(JSON.parse(localStorage.getItem('relegit_user') || 'null'))
    }

    window.addEventListener('relegit_auth_changed', handleAuthChange)
    window.addEventListener('relegit_user_updated', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('relegit_auth_changed', handleAuthChange)
      window.removeEventListener('relegit_user_updated', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg-orb hero-bg-orb-1" />
        <div className="hero-bg-orb hero-bg-orb-2" />
        <div className="hero-bg-grid" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={12} /> AI-Powered Fashion Authentication
            </div>

            {token && user ? (
              <>
                <h1 className="hero-title">
                  Selamat Datang Kembali, <br />
                  <span className="hero-title-gradient">{user.name}</span>
                </h1>

                <p className="hero-subtitle">
                  Siap melakukan audit keaslian fashion hari ini? Pilih fitur verifikasi interaktif atau cek riwayat sertifikat Anda.
                </p>

                <div className="hero-actions">
                  <Link to="/verify" className="btn btn-primary" id="hero-cta-verify">
                    <Upload size={16} /> Mulai Verifikasi Baru
                  </Link>
                  <Link to="/history" className="btn btn-secondary" id="hero-cta-history">
                    Lihat Riwayat Audit <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="hero-title">
                  Verifikasi Keaslian Fashion{' '}
                  <span className="hero-title-gradient">Lebih Cerdas</span>
                </h1>

                <p className="hero-subtitle">
                  Relegit menggunakan kecerdasan buatan untuk mendeteksi keaslian barang fashion
                  secara akurat. Solusi untuk komunitas yang sering bertanya — <em>original atau KW?</em>
                </p>

                <div className="hero-actions">
                  <Link to="/login" className="btn btn-primary" id="hero-cta-login">
                    <Upload size={16} /> Masuk & Verifikasi
                  </Link>
                  <Link to="/register" className="btn btn-secondary" id="hero-cta-register">
                    Daftar Akun Gratis <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            )}

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>92%+</strong>
                <span>Akurasi Model</span>
              </div>
              <div className="hero-stat">
                <strong>&lt;3s</strong>
                <span>Waktu Analisis</span>
              </div>
              <div className="hero-stat">
                <strong>10K+</strong>
                <span>Verifikasi Dilakukan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="hero-visual">
          <div className="hero-phone-mockup animate-float">
            <div className="phone-screen-badge badge badge-purple">
              <Shield size={10} /> Relegit AI
            </div>
            <div className="phone-image-area">👟</div>
            <div className="phone-result-card">
              <p className="phone-result-label">Hasil Verifikasi</p>
              <p className="phone-result-value">✅ LEGIT</p>
              <div className="phone-confidence-bar">
                <div className="phone-confidence-fill" />
              </div>
              <p className="phone-confidence-text">Confidence: 92%</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Kenapa Relegit?</span>
            <h2 className="section-title">
              Fitur yang Dirancang untuk Komunitas
            </h2>
            <p className="section-subtitle">
              Dari komunitas Facebook fashion Indonesia untuk komunitas — cepat, akurat, dan mudah digunakan.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="how-section section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Cara Kerja</span>
            <h2 className="section-title">Semudah 3 Langkah</h2>
            <p className="section-subtitle">
              Tidak perlu keahlian teknis. Cukup foto dan biarkan AI kami bekerja.
            </p>
          </div>

          <div className="steps-grid">
            {STEPS.map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-number">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-card">
            <div className="badge badge-purple" style={{ margin: '0 auto 1.5rem', display: 'inline-flex' }}>
              <Star size={11} /> {token ? 'Dashboard Pengguna' : 'Mulai Gratis Sekarang'}
            </div>

            {token ? (
              <>
                <h2 className="cta-title">
                  Siap Melakukan Audit Baru?
                </h2>
                <p className="cta-subtitle">
                  Mulai proses autentikasi produk fashion Anda sekarang atau kelola sertifikat keaslian tersimpan.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/verify" className="btn btn-primary" id="cta-verify">
                    <Upload size={16} /> Verifikasi Produk Baru
                  </Link>
                  <Link to="/profile" className="btn btn-secondary" id="cta-profile">
                    Lihat Sertifikat Saya <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="cta-title">
                  Hentikan Keraguan.<br />Mulai Verifikasi.
                </h2>
                <p className="cta-subtitle">
                  Bergabung dengan ribuan anggota komunitas fashion Indonesia yang sudah menggunakan Relegit.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/register" className="btn btn-primary" id="cta-register">
                    Daftar Akun Gratis <ArrowRight size={16} />
                  </Link>
                  <Link to="/login" className="btn btn-secondary" id="cta-login">
                    Masuk ke Akun
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
