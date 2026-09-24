import { Link } from 'react-router-dom'
import {
  Shield, Upload, Zap, Eye, CheckCircle2,
  Star, ArrowRight, Lock, TrendingUp, Award
} from 'lucide-react'
import { Navbar, Footer } from '../components/Layout'
import './Home.css'

const FEATURES = [
  {
    icon: <Zap size={24} />,
    title: 'Analisis Instan',
    desc: 'Model AI EfficientNet kami memproses gambar dalam hitungan detik, memberikan hasil verifikasi real-time tanpa menunggu lama.',
  },
  {
    icon: <Eye size={24} />,
    title: 'Deteksi Detail Mikro',
    desc: 'Sistem mendeteksi jahitan, logo, material, pola, dan detail kecil yang membedakan barang original dari KW.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Kepercayaan Tinggi',
    desc: 'Confidence score transparan dari 0–100% membantu komunitas fashion membuat keputusan pembelian yang tepat.',
  },
  {
    icon: <Lock size={24} />,
    title: 'Privasi Terjaga',
    desc: 'Gambar Anda diproses secara aman dan tidak disimpan permanen. Privasi komunitas adalah prioritas kami.',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Terus Belajar',
    desc: 'Model diperbarui secara berkala dengan data komunitas, sehingga semakin akurat seiring waktu.',
  },
  {
    icon: <Award size={24} />,
    title: 'Laporan Lengkap',
    desc: 'Setiap analisis menghasilkan laporan detail: kategori item, merek terdeteksi, poin mencurigakan, dan saran.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Upload Foto',
    desc: 'Unggah foto produk fashion yang ingin Anda verifikasi — bisa dari galeri atau kamera langsung.',
  },
  {
    n: '02',
    title: 'AI Menganalisis',
    desc: 'Model EfficientNet-B0 kami memindai setiap detail visual dalam milidetik.',
  },
  {
    n: '03',
    title: 'Terima Hasil',
    desc: 'Dapatkan verdict LEGIT / FAKE / SUSPICIOUS beserta confidence score dan laporan detail.',
  },
]

export default function Home() {
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

            <h1 className="hero-title">
              Verifikasi Keaslian Fashion{' '}
              <span className="hero-title-gradient">Lebih Cerdas</span>
            </h1>

            <p className="hero-subtitle">
              Relegit menggunakan kecerdasan buatan untuk mendeteksi keaslian barang fashion
              secara akurat. Solusi untuk komunitas yang sering bertanya — <em>original atau KW?</em>
            </p>

            <div className="hero-actions">
              <Link to="/verify" className="btn btn-primary" id="hero-cta-verify">
                <Upload size={16} /> Coba Verifikasi Gratis
              </Link>
              <Link to="/about" className="btn btn-secondary" id="hero-cta-about">
                Pelajari Cara Kerja <ArrowRight size={16} />
              </Link>
            </div>

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
              <Star size={11} /> Mulai Gratis Sekarang
            </div>
            <h2 className="cta-title">
              Hentikan Keraguan.<br />Mulai Verifikasi.
            </h2>
            <p className="cta-subtitle">
              Bergabung dengan ribuan anggota komunitas fashion Indonesia yang sudah menggunakan Relegit.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" id="cta-register">
                Daftar Gratis <ArrowRight size={16} />
              </Link>
              <Link to="/verify" className="btn btn-secondary" id="cta-try">
                <Upload size={16} /> Coba Tanpa Daftar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
