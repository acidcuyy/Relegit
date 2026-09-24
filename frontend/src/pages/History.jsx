import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { History, Upload, Shield, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { Navbar, Footer } from '../components/Layout'
import './History.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const VERDICT_COLORS = {
  LEGIT:       { text: '#4ade80', label: '✅ LEGIT' },
  FAKE:        { text: '#f87171', label: '❌ FAKE' },
  SUSPICIOUS:  { text: '#fbbf24', label: '⚠️ SUSPICIOUS' },
}

const FILTERS = ['Semua', 'LEGIT', 'FAKE', 'SUSPICIOUS']

export default function HistoryPage() {
  const navigate  = useNavigate()
  const [history, setHistory]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter,  setFilter]    = useState('Semua')
  const [error,   setError]     = useState('')

  const token = localStorage.getItem('relegit_token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchHistory()
  }, [token])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/verify/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setHistory(data.history || [])
    } catch (err) {
      setError('Gagal memuat riwayat. Coba refresh.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'Semua'
    ? history
    : history.filter(h => h.verdict === filter)

  /* Stats */
  const total     = history.length
  const legitCnt  = history.filter(h => h.verdict === 'LEGIT').length
  const fakeCnt   = history.filter(h => h.verdict === 'FAKE').length
  const suspCnt   = history.filter(h => h.verdict === 'SUSPICIOUS').length

  return (
    <>
      <Navbar />

      <div className="history-page">
        <div className="container">
          {/* Header */}
          <div className="history-header">
            <div>
              <div className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>
                <History size={11} /> Riwayat Verifikasi
              </div>
              <h1>Riwayat Anda</h1>
            </div>
            <Link to="/verify" className="btn btn-primary" id="history-new-verify">
              <Upload size={15} /> Verifikasi Baru
            </Link>
          </div>

          {/* Stats */}
          <div className="history-stats">
            <div className="history-stat-card">
              <p className="history-stat-number" style={{ color: 'var(--purple-400)' }}>{total}</p>
              <p className="history-stat-label">Total</p>
            </div>
            <div className="history-stat-card">
              <p className="history-stat-number" style={{ color: '#4ade80' }}>{legitCnt}</p>
              <p className="history-stat-label">Legit</p>
            </div>
            <div className="history-stat-card">
              <p className="history-stat-number" style={{ color: '#f87171' }}>{fakeCnt}</p>
              <p className="history-stat-label">Fake</p>
            </div>
            <div className="history-stat-card">
              <p className="history-stat-number" style={{ color: '#fbbf24' }}>{suspCnt}</p>
              <p className="history-stat-label">Suspicious</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="history-filter-bar">
            {FILTERS.map(f => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <AlertTriangle size={16} /> {error}
              <button className="btn btn-ghost" onClick={fetchHistory} style={{ marginLeft: 'auto' }}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="history-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}>
                  <div style={{ height: 180, background: 'var(--bg-card-2)' }} className="skeleton-line" />
                  <div style={{ padding: '1.25rem' }}>
                    <div className="skeleton-line" style={{ height: 20, width: '60%', marginBottom: '0.75rem' }} />
                    <div className="skeleton-line" style={{ height: 14, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="history-grid">
              {filtered.length === 0 ? (
                <div className="history-empty">
                  <div className="history-empty-icon">
                    <History size={32} />
                  </div>
                  <h3>
                    {filter === 'Semua'
                      ? 'Belum ada riwayat verifikasi'
                      : `Tidak ada item dengan verdict "${filter}"`}
                  </h3>
                  <p>
                    {filter === 'Semua'
                      ? 'Mulai verifikasi fashion Anda sekarang!'
                      : 'Coba filter lain atau tambah verifikasi baru.'}
                  </p>
                  <Link to="/verify" className="btn btn-primary" id="history-empty-cta">
                    <Upload size={15} /> Verifikasi Sekarang
                  </Link>
                </div>
              ) : (
                filtered.map((item) => {
                  const vc = VERDICT_COLORS[item.verdict] || VERDICT_COLORS.SUSPICIOUS
                  const pct = Math.round((item.confidence || 0) * 100)
                  const date = new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })
                  return (
                    <div key={item.id} className="history-card">
                      <div className="history-card-img">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="Fashion item" loading="lazy" />
                        ) : (
                          <span>👕</span>
                        )}
                      </div>
                      <div className="history-card-body">
                        <div className="history-card-top">
                          <span className="history-card-verdict" style={{ color: vc.text }}>
                            {vc.label}
                          </span>
                          <span className={`badge ${
                            item.verdict === 'LEGIT' ? 'badge-green' :
                            item.verdict === 'FAKE'  ? 'badge-red'   : 'badge-yellow'
                          }`}>{pct}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="history-card-meta">
                          <span>🏷️ {item.category || 'Fashion'}</span>
                          <span>📅 {date}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
