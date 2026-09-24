import { useState, useRef, useCallback } from 'react'
import {
  Upload, ImageIcon, X, Shield, AlertTriangle, CheckCircle2,
  XCircle, RefreshCw, Download, History, Search, ChevronRight,
  Camera, ArrowLeft, Check, Layers, Cpu, Award, FileText, QrCode
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Navbar, Footer } from '../components/Layout'
import './Verify.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/* ── Brand, Category, Model & Photo Parts Dataset ────────────────── */
const BRANDS = [
  { id: 'levis', name: "Levi's", logo: '👖', popular: true },
  { id: 'nike', name: 'Nike', logo: '👟', popular: true },
  { id: 'adidas', name: 'Adidas', logo: '👟', popular: true },
  { id: 'carhartt', name: 'Carhartt', logo: '🧥', popular: true },
  { id: 'gucci', name: 'Gucci', logo: '👜', popular: false },
  { id: 'louis-vuitton', name: 'Louis Vuitton', logo: '💼', popular: false },
  { id: 'others', name: 'Merek Lainnya...', logo: '🏷️', popular: false },
]

const CATEGORIES = {
  levis: [
    { id: 'jeans', name: 'Jeans', count: '6 Foto Diperlukan' },
    { id: 'jacket', name: 'Jacket', count: '5 Foto Diperlukan' },
    { id: 'shirt', name: 'Shirt', count: '4 Foto Diperlukan' },
    { id: 'others', name: 'Lainnya', count: '4 Foto Diperlukan' },
  ]
}

const MODELS = {
  jeans: [
    { id: '501', name: '501 Original Fit' },
    { id: '511', name: '511 Slim Fit (Rekomendasi Flow)', badge: 'Populer' },
    { id: '502', name: '502 Taper Fit' },
    { id: '505', name: '505 Regular Fit' },
    { id: '550', name: '550 Relaxed Fit' },
    { id: 'others', name: 'Model Lainnya' },
  ]
}

const REQUIRED_PARTS_LEVIS_511 = [
  { id: 'back', label: 'Back View', desc: 'Tampak belakang celana secara penuh', req: true, sample: '👖' },
  { id: 'patch', label: 'Leather Patch', desc: 'Patch kulit dua kuda di pinggang belakang', req: true, sample: '🏷️' },
  { id: 'pocket', label: 'Back Pocket Stitching', desc: 'Jahitan arcuate di saku belakang', req: true, sample: '📐' },
  { id: 'button', label: 'Front Button', desc: 'Grafir teks pada tombol logam utama', req: true, sample: '🔘' },
  { id: 'redtab', label: 'Red Tab', desc: 'Tag merah khas Levi\'s terpasang di saku', req: true, sample: '🏷️' },
  { id: 'washtag', label: 'Wash Tag & Code', desc: 'Label petunjuk pencucian & kode produksi', req: true, sample: '🏷️' },
]

/* ── Main Multi-step Verify Page Component ────────────────────────── */
export default function VerifyPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('relegit_token')

  // Flow Wizard Steps:
  // 1: Brand | 2: Category | 3: Model | 4: Guide | 5: Upload Parts | 6: AI Processing | 7: Result
  const [step, setStep]                   = useState(1)
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]) // Levi's default
  const [searchBrand, setSearchBrand]     = useState('')
  const [selectedCategory, setSelectedCat]= useState('jeans')
  const [selectedModel, setSelectedModel] = useState('511')

  // Multi-part photos state
  const [currentPartIdx, setCurrentPartIdx] = useState(0)
  const [partPhotos, setPartPhotos]         = useState({}) // { back: file, patch: file, ... }
  const [partPreviews, setPartPreviews]     = useState({}) // { back: url, patch: url, ... }
  const [qualityStatus, setQualityStatus]   = useState(null) // 'pass' | 'fail' | null
  const [qualityFeedback, setQualityFeedback] = useState([])

  // AI Pipeline Processing State
  const [procStage, setProcStage] = useState(0) // 0: Validasi, 1: Model per Bagian, 2: Consistency Engine
  const [resultData, setResultData] = useState(null)
  const [activeTab, setActiveTab]   = useState('evidence') // 'evidence' | 'analysis' | 'certificate'
  const [errorMsg, setErrorMsg]     = useState('')

  const fileInputRef = useRef(null)

  // Filtered brands
  const filteredBrands = BRANDS.filter(b =>
    b.name.toLowerCase().includes(searchBrand.toLowerCase())
  )

  // Handle part photo upload
  const handlePartUpload = (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
    if (!allowed.includes(file.type)) {
      setErrorMsg('Format file harus JPG, PNG, WebP, atau HEIC')
      return
    }

    const currentPart = REQUIRED_PARTS_LEVIS_511[currentPartIdx]
    const previewUrl = URL.createObjectURL(file)

    setPartPhotos(prev => ({ ...prev, [currentPart.id]: file }))
    setPartPreviews(prev => ({ ...prev, [currentPart.id]: previewUrl }))
    setErrorMsg('')

    // Simulate Photo Quality Validation Check (Step 7 in flowchart)
    // Random or mock deterministic quality check for demonstration
    const isGoodQuality = true // Passed validation
    if (isGoodQuality) {
      setQualityStatus('pass')
      setQualityFeedback([
        `${currentPart.label} terlihat jelas dan proporsional.`,
        'Pencahayaan memadai & fokus objek tajam.',
        'Siap dilanjutkan ke bagian berikutnya.'
      ])
    } else {
      setQualityStatus('fail')
      setQualityFeedback([
        'Foto terlalu blur atau kurang fokus.',
        'Pencahayaan kurang terang.',
        'Framing objek tidak pas dengan panduan.'
      ])
    }
  }

  // Move to next photo part
  const handleNextPart = () => {
    setQualityStatus(null)
    setQualityFeedback([])
    if (currentPartIdx < REQUIRED_PARTS_LEVIS_511.length - 1) {
      setCurrentPartIdx(prev => prev + 1)
    } else {
      // All parts completed! Start AI Authentication Process (Step 9 in flowchart)
      startAuthenticationEngine()
    }
  }

  // Trigger AI Consistency Engine Processing Pipeline
  const startAuthenticationEngine = async () => {
    setStep(6) // Processing Screen
    setProcStage(0)

    // Stage 1: Validasi Semua Foto (1s)
    setTimeout(() => {
      setProcStage(1) // Stage 2: Model AI per Bagian
    }, 1200)

    // Stage 2: Consistency Engine (2.4s)
    setTimeout(() => {
      setProcStage(2)
    }, 2400)

    // Finalize Result (3.6s)
    setTimeout(() => {
      // Calculate realistic evidence score based on uploaded photos count
      const totalUploaded = Object.keys(partPhotos).length || 6
      const mockScore = 92

      setResultData({
        verdict: 'LEGIT',
        confidence: mockScore,
        brand: selectedBrand.name,
        category: 'Jeans',
        model: selectedModel,
        evidenceCount: `${totalUploaded}/6`,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        certId: `RLG-2026-${Math.floor(1000 + Math.random() * 9000)}-LEVI511`,
        partScores: [
          { name: 'Back View', score: 94, status: 'Authentic' },
          { name: 'Leather Patch', score: 91, status: 'Authentic' },
          { name: 'Back Pocket', score: 89, status: 'Authentic' },
          { name: 'Front Button', score: 90, status: 'Authentic' },
          { name: 'Red Tab', score: 93, status: 'Authentic' },
          { name: 'Wash Tag', score: 91, status: 'Authentic' },
        ],
        consistencyMetrics: {
          stitchingDensity: '98% Match (Double-needle arcuate pattern)',
          tagCodeVerification: 'Valid Batch #511-0426',
          hardwareEngraving: 'Authentic Levi Strauss & Co. Stamp',
          fabricWeave: '14oz Cotton Denim (Right-hand twill)',
          anomalyScore: '0.02 (Sangat Rendah)'
        }
      })
      setStep(7) // Result & Detail View
    }, 3800)
  }

  const resetWizard = () => {
    setStep(1)
    setCurrentPartIdx(0)
    setPartPhotos({})
    setPartPreviews({})
    setQualityStatus(null)
    setResultData(null)
    setProcStage(0)
  }

  return (
    <>
      <Navbar />

      <div className="verify-page">
        <div className="verify-page-bg-orb verify-page-bg-orb-1" />
        <div className="verify-page-bg-orb verify-page-bg-orb-2" />

        <div className="container">
          {/* Header Title */}
          <div className="verify-header">
            <div className="badge badge-purple" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>
              <Shield size={12} /> AI Fashion Authentication Engine
            </div>
            <h1>
              Verifikasi <span className="text-gradient">Keaslian</span> Fashion (Levi's Flow)
            </h1>
            <p>Panduan alur langkah demi langkah sesuai standar autentikasi komunitas fashion.</p>
          </div>

          {/* Wizard Navigation Progress Stepper */}
          <div className="stepper-bar">
            <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
              <span className="step-num">1</span>
              <span className="step-txt">Brand</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-txt">Kategori</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 3 ? 'active' : ''} ${step > 3 ? 'done' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-txt">Model</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 4 ? 'active' : ''} ${step > 4 ? 'done' : ''}`}>
              <span className="step-num">4</span>
              <span className="step-txt">Panduan</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 5 ? 'active' : ''} ${step > 5 ? 'done' : ''}`}>
              <span className="step-num">5</span>
              <span className="step-txt">Ambil Foto</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 6 ? 'active' : ''} ${step > 6 ? 'done' : ''}`}>
              <span className="step-num">6</span>
              <span className="step-txt">Proses AI</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 7 ? 'active' : ''}`}>
              <span className="step-num">7</span>
              <span className="step-txt">Hasil</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              STEP 1: PILIH BRAND (Choose Brand)
             ───────────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <h2>2. PILIH BRAND</h2>
                <p>Pilih merek produk fashion yang ingin Anda verifikasi</p>
              </div>

              {/* Search Bar */}
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari brand (misal: Levi's, Nike, Adidas...)..."
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                />
              </div>

              {/* Brand Grid */}
              <div className="brand-grid">
                {filteredBrands.map((b) => (
                  <button
                    key={b.id}
                    className={`brand-card ${selectedBrand.id === b.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBrand(b)
                      setStep(2)
                    }}
                  >
                    <span className="brand-logo">{b.logo}</span>
                    <span className="brand-name">{b.name}</span>
                    <ChevronRight size={18} className="brand-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 2: PILIH KATEGORI (Choose Category)
             ───────────────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <button className="btn-back" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <h2>3. PILIH KATEGORI ({selectedBrand.name})</h2>
                <p>Pilih jenis pakaian atau item fashion Anda</p>
              </div>

              <div className="category-grid">
                {(CATEGORIES.levis || []).map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCat(cat.id)
                      setStep(3)
                    }}
                  >
                    <div className="category-info">
                      <h3>{cat.name}</h3>
                      <p>{cat.count}</p>
                    </div>
                    <ChevronRight size={20} className="brand-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 3: PILIH MODEL (Choose Model)
             ───────────────────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <button className="btn-back" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <h2>4. PILIH MODEL (Jeans)</h2>
                <p>Pilih tipe/seri model celana Jeans Anda</p>
              </div>

              <div className="model-grid">
                {(MODELS.jeans || []).map((mod) => (
                  <button
                    key={mod.id}
                    className={`model-card ${selectedModel === mod.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedModel(mod.id)
                      setStep(4)
                    }}
                  >
                    <div className="model-content">
                      <span className="model-code">{mod.id}</span>
                      <span className="model-title">{mod.name}</span>
                    </div>
                    {mod.badge && <span className="model-badge">{mod.badge}</span>}
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 4: PANDUAN FOTO (Photo Requirements Checklist)
             ───────────────────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <button className="btn-back" onClick={() => setStep(3)}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <h2>5. PANDUAN FOTO ({selectedBrand.name} {selectedModel})</h2>
                <p>Kami membutuhkan <strong>6 foto detail</strong> untuk memverifikasi keaslian barang Anda dengan akurasi 98%.</p>
              </div>

              <div className="guide-checklist">
                {REQUIRED_PARTS_LEVIS_511.map((item, idx) => (
                  <div key={item.id} className="guide-item">
                    <span className="guide-num">{idx + 1}</span>
                    <div className="guide-text">
                      <h4>{item.label} <span className="tag-req">(Required)</span></h4>
                      <p>{item.desc}</p>
                    </div>
                    <span className="guide-icon">{item.sample}</span>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-full-width mt-4" onClick={() => setStep(5)}>
                <Camera size={18} /> Mulai Ambil / Upload Foto
              </button>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 5 & 6: AMBIL FOTO PER BAGIAN & VALIDASI KUALITAS FOTO
             ───────────────────────────────────────────────────────────── */}
          {step === 5 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <button className="btn-back" onClick={() => setStep(4)}>
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <span className="part-counter">
                    Bagian {currentPartIdx + 1} dari {REQUIRED_PARTS_LEVIS_511.length}
                  </span>
                </div>
                <h2>6. AMBIL FOTO ({REQUIRED_PARTS_LEVIS_511[currentPartIdx].label})</h2>
                <p>{REQUIRED_PARTS_LEVIS_511[currentPartIdx].desc}</p>
              </div>

              {/* Interactive Camera Framing & Upload Viewport */}
              <div className="photo-framing-box">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
                  style={{ display: 'none' }}
                  onChange={(e) => handlePartUpload(e.target.files[0])}
                />

                {partPreviews[REQUIRED_PARTS_LEVIS_511[currentPartIdx].id] ? (
                  <div className="captured-preview-container">
                    <img
                      src={partPreviews[REQUIRED_PARTS_LEVIS_511[currentPartIdx].id]}
                      alt="Uploaded part"
                      className="captured-img"
                    />
                    {/* Corner Reticle Overlays */}
                    <div className="frame-corner top-left" />
                    <div className="frame-corner top-right" />
                    <div className="frame-corner bottom-left" />
                    <div className="frame-corner bottom-right" />
                  </div>
                ) : (
                  <div
                    className="framing-placeholder"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="reticle-box">
                      <Camera size={48} className="reticle-icon" />
                      <div className="frame-corner top-left" />
                      <div className="frame-corner top-right" />
                      <div className="frame-corner bottom-left" />
                      <div className="frame-corner bottom-right" />
                    </div>
                    <p className="framing-hint">
                      Klik di sini atau seret foto <strong>{REQUIRED_PARTS_LEVIS_511[currentPartIdx].label}</strong> Anda
                    </p>
                    <p className="framing-subtext">Pastikan objek terlihat jelas dan tidak terlipat.</p>
                  </div>
                )}
              </div>

              {/* Photo Quality Feedback Section (Step 7 in flowchart) */}
              {qualityStatus && (
                <div className={`quality-feedback-card ${qualityStatus === 'pass' ? 'pass' : 'fail'}`}>
                  <div className="feedback-header">
                    {qualityStatus === 'pass' ? (
                      <>
                        <CheckCircle2 size={24} className="text-green" />
                        <h3>Foto Diterima & Memenuhi Standar!</h3>
                      </>
                    ) : (
                      <>
                        <XCircle size={24} className="text-red" />
                        <h3>Foto Tidak Memenuhi Standar</h3>
                      </>
                    )}
                  </div>
                  <ul>
                    {qualityFeedback.map((fb, idx) => (
                      <li key={idx}>• {fb}</li>
                    ))}
                  </ul>

                  {qualityStatus === 'pass' ? (
                    <button className="btn btn-primary mt-3" onClick={handleNextPart}>
                      <Check size={18} /> {currentPartIdx === REQUIRED_PARTS_LEVIS_511.length - 1 ? 'Selesai & Jalankan AI Engine' : 'Lanjut ke Bagian Berikutnya'}
                    </button>
                  ) : (
                    <button className="btn btn-danger mt-3" onClick={() => fileInputRef.current?.click()}>
                      <RefreshCw size={18} /> Ambil Ulang Foto
                    </button>
                  )}
                </div>
              )}

              {/* Multipart Progress Overview Checklist (Step 8 in flowchart) */}
              <div className="parts-progress-bar mt-4">
                <h4>8. ULANGI UNTUK SEMUA BAGIAN:</h4>
                <div className="parts-grid-summary">
                  {REQUIRED_PARTS_LEVIS_511.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`part-thumb-slot ${partPhotos[p.id] ? 'completed' : ''} ${currentPartIdx === idx ? 'current' : ''}`}
                      onClick={() => {
                        setCurrentPartIdx(idx)
                        setQualityStatus(null)
                      }}
                    >
                      <span className="part-thumb-name">{p.label}</span>
                      {partPhotos[p.id] ? (
                        <CheckCircle2 size={16} className="check-icon" />
                      ) : (
                        <span className="pending-num">{idx + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 7: PROSES AUTHENTICATION (Consistency Engine AI)
             ───────────────────────────────────────────────────────────── */}
          {step === 6 && (
            <div className="wizard-card animated-fade text-center py-5">
              <div className="ai-processing-container">
                <div className="pulse-ai-glow">
                  <Cpu size={56} className="ai-cpu-icon" />
                </div>

                <h2>9. PROSES AUTHENTICATION</h2>
                <p style={{ color: 'var(--gray-400)', marginBottom: '2.5rem' }}>
                  AI Consistency Engine sedang menganalisis 6 titik bukti keaslian fashion Anda.
                </p>

                {/* Processing Pipeline Stages */}
                <div className="pipeline-stages">
                  <div className={`pipeline-box ${procStage >= 0 ? 'active' : ''}`}>
                    <Layers size={20} />
                    <span>Validasi Semua Foto</span>
                    {procStage > 0 && <CheckCircle2 size={16} className="text-green ms-auto" />}
                  </div>

                  <div className={`pipeline-box ${procStage >= 1 ? 'active' : ''}`}>
                    <Cpu size={20} />
                    <span>Model AI per Bagian (EfficientNet-B0)</span>
                    {procStage > 1 && <CheckCircle2 size={16} className="text-green ms-auto" />}
                  </div>

                  <div className={`pipeline-box ${procStage >= 2 ? 'active' : ''}`}>
                    <Shield size={20} />
                    <div>
                      <strong>Consistency Engine</strong>
                      <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>
                        Konsistensi model • Informasi tag • Hubungan antar komponen • Deteksi anomali
                      </p>
                    </div>
                    {procStage > 2 && <CheckCircle2 size={16} className="text-green ms-auto" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 8 & 9: HASIL AUTENTIKASI & DETAIL HASIL (Result View)
             ───────────────────────────────────────────────────────────── */}
          {step === 7 && resultData && (
            <div className="wizard-card animated-fade">
              {/* Top Result Banner */}
              <div className="result-verdict-banner">
                <div className="verdict-icon-wrap">
                  <CheckCircle2 size={48} className="text-green" />
                </div>
                <h2 className="verdict-title">Likely Authentic</h2>
                <div className="verdict-score">{resultData.confidence}%</div>
                <p className="verdict-subtext">Evidence analyzed: {resultData.evidenceCount}</p>
              </div>

              {/* Detail Navigation Tabs */}
              <div className="detail-tabs mt-4">
                <button
                  className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evidence')}
                >
                  <ImageIcon size={16} /> Evidence (Bukti Foto)
                </button>
                <button
                  className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analysis')}
                >
                  <Cpu size={16} /> Analysis (Consistency Engine)
                </button>
                <button
                  className={`tab-btn ${activeTab === 'certificate' ? 'active' : ''}`}
                  onClick={() => setActiveTab('certificate')}
                >
                  <Award size={16} /> Sertifikat Keaslian
                </button>
              </div>

              {/* Tab Content 1: Evidence */}
              {activeTab === 'evidence' && (
                <div className="tab-content animated-fade">
                  <h3>11. DETAIL HASIL — BUKTI AUDIT BAGIAN</h3>
                  <div className="evidence-grid mt-3">
                    {resultData.partScores.map((pt, i) => (
                      <div key={i} className="evidence-card">
                        <div className="evidence-img-box">
                          {partPreviews[REQUIRED_PARTS_LEVIS_511[i]?.id] ? (
                            <img src={partPreviews[REQUIRED_PARTS_LEVIS_511[i]?.id]} alt={pt.name} />
                          ) : (
                            <div className="placeholder-thumb">👖</div>
                          )}
                        </div>
                        <div className="evidence-info">
                          <h4>{pt.name}</h4>
                          <span className="badge badge-green">{pt.status}</span>
                          <span className="confidence-num">Confidence: {pt.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content 2: Analysis */}
              {activeTab === 'analysis' && (
                <div className="tab-content animated-fade">
                  <h3>Laporan Analisis Consistency Engine</h3>
                  <div className="analysis-metrics-list mt-3">
                    <div className="metric-row">
                      <span className="metric-name">Kerapatan & Pola Jahitan Arcuate</span>
                      <span className="metric-val">{resultData.consistencyMetrics.stitchingDensity}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Verifikasi Kode Tag & Batch</span>
                      <span className="metric-val">{resultData.consistencyMetrics.tagCodeVerification}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Grafir Tombol Logam Hardware</span>
                      <span className="metric-val">{resultData.consistencyMetrics.hardwareEngraving}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Anyaman & Bobot Kain Denim</span>
                      <span className="metric-val">{resultData.consistencyMetrics.fabricWeave}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Deteksi Anomali AI</span>
                      <span className="metric-val text-green">{resultData.consistencyMetrics.anomalyScore}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 3: Certificate */}
              {activeTab === 'certificate' && (
                <div className="tab-content animated-fade">
                  <div className="digital-certificate-card">
                    <div className="cert-header">
                      <Shield size={32} className="cert-shield" />
                      <div>
                        <h2>SERTIFIKAT KEASLIAN DIGITAL</h2>
                        <p>Relegit AI Fashion Authentication System</p>
                      </div>
                      <span className="cert-badge">VERIFIED ORIGINAL</span>
                    </div>

                    <div className="cert-body">
                      <div className="cert-info-grid">
                        <div>
                          <p className="cert-label">Brand</p>
                          <p className="cert-val">{resultData.brand}</p>
                        </div>
                        <div>
                          <p className="cert-label">Model / Seri</p>
                          <p className="cert-val">511 Slim Fit</p>
                        </div>
                        <div>
                          <p className="cert-label">Tanggal Audit</p>
                          <p className="cert-val">{resultData.date}</p>
                        </div>
                        <div>
                          <p className="cert-label">Tingkat Kepercayaan</p>
                          <p className="cert-val text-green">{resultData.confidence}% Authentic</p>
                        </div>
                      </div>

                      <div className="cert-footer">
                        <div className="cert-qr">
                          <QrCode size={64} />
                          <span className="cert-id">{resultData.certId}</span>
                        </div>
                        <button className="btn btn-secondary" onClick={() => window.print()}>
                          <Download size={16} /> Unduh Sertifikat (PDF)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="wizard-actions mt-4">
                <button className="btn btn-primary" onClick={resetWizard}>
                  <RefreshCw size={16} /> Verifikasi Produk Lain
                </button>
                <Link to="/history" className="btn btn-secondary">
                  <History size={16} /> Lihat di Riwayat Akun
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
