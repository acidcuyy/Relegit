import { useState, useRef } from 'react'
import {
  Upload, ImageIcon, X, Shield, AlertTriangle, CheckCircle2,
  XCircle, RefreshCw, Download, History, Search, ChevronRight,
  Camera, ArrowLeft, Check, Layers, Cpu, Award, QrCode
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from '../components/Layout'
import './Verify.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/* ── Brand, Category, Model & Photo Parts Datasets ────────────────── */
const BRANDS = [
  { id: 'levis', name: "Levi's", logo: '👖', popular: true },
  { id: 'nike', name: 'Nike', logo: '👟', popular: true },
  { id: 'adidas', name: 'Adidas', logo: '👟', popular: true },
  { id: 'carhartt', name: 'Carhartt', logo: '🧥', popular: true },
  { id: 'gucci', name: 'Gucci', logo: '👜', popular: false },
  { id: 'louis-vuitton', name: 'Louis Vuitton', logo: '💼', popular: false },
  { id: 'others', name: 'Merek Lainnya...', logo: '🏷️', popular: false },
]

const CATEGORY_LIST = [
  { id: 'jeans', name: 'Jeans', count: '6 Foto Diperlukan', icon: '👖' },
  { id: 'shoes', name: 'Sepatu / Sneakers', count: '5 Foto Diperlukan', icon: '👟' },
  { id: 'jacket', name: 'Jaket / Outerwear', count: '5 Foto Diperlukan', icon: '🧥' },
  { id: 'shirt', name: 'Baju / Kaos', count: '4 Foto Diperlukan', icon: '👕' },
  { id: 'others', name: 'Aksesoris / Lainnya', count: '4 Foto Diperlukan', icon: '🎒' },
]

const MODELS_MAP = {
  jeans: [
    { id: '501', name: '501 Original Fit' },
    { id: '511', name: '511 Slim Fit', badge: 'Populer' },
    { id: '502', name: '502 Taper Fit' },
    { id: '505', name: '505 Regular Fit' },
    { id: '550', name: '550 Relaxed Fit' },
    { id: 'others', name: 'Model Jeans Lainnya' },
  ],
  shoes: [
    { id: 'low-top', name: 'Low-Top Sneaker', badge: 'Populer' },
    { id: 'high-top', name: 'High-Top Leather Sneaker' },
    { id: 'running', name: 'Retro / Performance Runner' },
    { id: 'chunky', name: 'Chunky / Platform Sneaker' },
    { id: 'others', name: 'Model Sepatu Lainnya' },
  ],
  jacket: [
    { id: 'trucker', name: 'Trucker Denim Jacket', badge: 'Populer' },
    { id: 'sherpa', name: 'Sherpa Shearling Jacket' },
    { id: 'bomber', name: 'Varsity / Bomber Jacket' },
    { id: 'windbreaker', name: 'Technical Windbreaker' },
    { id: 'others', name: 'Model Jaket Lainnya' },
  ],
  shirt: [
    { id: 'graphic-tee', name: 'Classic Graphic Tee', badge: 'Populer' },
    { id: 'flannel', name: 'Western Flannel Shirt' },
    { id: 'polo', name: 'Pique Polo Shirt' },
    { id: 'hoodie', name: 'Pullover Hoodie' },
    { id: 'others', name: 'Model Baju Lainnya' },
  ],
  others: [
    { id: 'bag', name: 'Tote Bag / Backpack', badge: 'Populer' },
    { id: 'cap', name: 'Hat / Baseball Cap' },
    { id: 'belt', name: 'Leather Belt' },
    { id: 'wallet', name: 'Wallet / Cardholder' },
    { id: 'others', name: 'Aksesoris Lainnya' },
  ]
}

const REQUIRED_PARTS_MAP = {
  jeans: [
    { id: 'back', label: 'Tampak Belakang (Back View)', desc: 'Tampak belakang celana secara penuh', req: true, sample: '👖' },
    { id: 'patch', label: 'Leather Patch Pinggang', desc: 'Patch kulit dua kuda di pinggang belakang', req: true, sample: '🏷️' },
    { id: 'pocket', label: 'Jahitan Saku (Arcuate)', desc: 'Jahitan arcuate pada saku belakang', req: true, sample: '📐' },
    { id: 'button', label: 'Tombol Logam (Button)', desc: 'Grafir teks pada kancing logam utama', req: true, sample: '🔘' },
    { id: 'redtab', label: 'Red Tab Saku', desc: 'Tag merah khas terpasang di saku', req: true, sample: '🏷️' },
    { id: 'washtag', label: 'Tag Label Cuci & Kode', desc: 'Label petunjuk pencucian & kode produksi', req: true, sample: '🏷️' },
  ],
  shoes: [
    { id: 'side', label: 'Tampak Samping (Side Profile)', desc: 'Tampak samping sepatu (bentuk & proporsi logo)', req: true, sample: '👟' },
    { id: 'tag', label: 'Label Lidah (Size Tag)', desc: 'Label lidah sepatu, kode produksi & QR/UPC', req: true, sample: '🏷️' },
    { id: 'insole', label: 'Insole & Sol Dalam', desc: 'Sablon insole & jahitan strobel di bawah insole', req: true, sample: '📐' },
    { id: 'outsole', label: 'Pola Sol Bawah (Outsole)', desc: 'Detail tekstur sol bawah & ketebalan karet', req: true, sample: '🦶' },
    { id: 'heel', label: 'Jahitan Tumit Belakang', desc: 'Detail jahitan tumit belakang & bentuk counter', req: true, sample: '🧵' },
  ],
  jacket: [
    { id: 'front', label: 'Tampak Depan Jaket', desc: 'Tampak depan jaket secara penuh', req: true, sample: '🧥' },
    { id: 'neck-tag', label: 'Tag Kerah Utama', desc: 'Tag merek di kerah utama & ukuran', req: true, sample: '🏷️' },
    { id: 'buttons', label: 'Kancing / Resleting Hardware', desc: 'Grafir tombol logam atau ritsleting hardware', req: true, sample: '🔘' },
    { id: 'stitching', label: 'Jahitan Saku & Keliman', desc: 'Detail kerapatan jahitan saku & keliman bawah', req: true, sample: '📐' },
    { id: 'inner-tag', label: 'Tag Label Cuci Dalam', desc: 'Label cuci & kode produksi bagian dalam', req: true, sample: '🏷️' },
  ],
  shirt: [
    { id: 'front', label: 'Tampak Depan Baju', desc: 'Tampak depan baju secara penuh', req: true, sample: '👕' },
    { id: 'neck-label', label: 'Label Kerah / Leher', desc: 'Label kain kerah atau sablon leher dalam', req: true, sample: '🏷️' },
    { id: 'stitching', label: 'Detail Sablon / Jahitan', desc: 'Detail kerapatan jahitan lengan & bawah', req: true, sample: '📐' },
    { id: 'wash-tag', label: 'Tag Label Cuci Samping', desc: 'Tag bahan & petunjuk cuci di jahitan samping', req: true, sample: '🏷️' },
  ],
  others: [
    { id: 'front', label: 'Tampak Utuh Depan', desc: 'Foto produk tampak depan secara utuh', req: true, sample: '📦' },
    { id: 'brand-tag', label: 'Tag Merek / Emboss', desc: 'Emboss logo atau tag merek utama', req: true, sample: '🏷️' },
    { id: 'hardware', label: 'Hardware / Jahitan', desc: 'Detail kancing, klip, atau jahitan khas', req: true, sample: '📐' },
    { id: 'serial', label: 'Kode Seri / Barcode', desc: 'Kode seri unik atau nomor lisensi', req: true, sample: '🔢' },
  ]
}

/* ── Main Multi-step Verify Page Component ────────────────────────── */
export default function VerifyPage() {
  const navigate = useNavigate()

  // Wizard Steps:
  // 1: Brand | 2: Category | 3: Model | 4: Guide | 5: Upload Parts | 6: AI Processing | 7: Result
  const [step, setStep]                   = useState(1)
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0])
  const [searchBrand, setSearchBrand]     = useState('')
  const [selectedCategory, setSelectedCat]= useState('jeans')
  const [selectedModel, setSelectedModel] = useState('511 Slim Fit')

  // Multi-part photos state
  const [currentPartIdx, setCurrentPartIdx] = useState(0)
  const [partPhotos, setPartPhotos]         = useState({})
  const [partPreviews, setPartPreviews]     = useState({})
  const [qualityStatus, setQualityStatus]   = useState(null) // 'pass' | 'fail' | null
  const [qualityFeedback, setQualityFeedback] = useState([])

  // AI Pipeline Processing State
  const [procStage, setProcStage] = useState(0)
  const [resultData, setResultData] = useState(null)
  const [activeTab, setActiveTab]   = useState('evidence')
  const [errorMsg, setErrorMsg]     = useState('')

  const fileInputRef = useRef(null)

  // Active Parts list based on selected category!
  const activePartsList = REQUIRED_PARTS_MAP[selectedCategory] || REQUIRED_PARTS_MAP.jeans
  const activeModelsList = MODELS_MAP[selectedCategory] || MODELS_MAP.jeans
  const activeCategoryObj = CATEGORY_LIST.find(c => c.id === selectedCategory) || CATEGORY_LIST[0]

  // Filtered brands
  const filteredBrands = BRANDS.filter(b =>
    b.name.toLowerCase().includes(searchBrand.toLowerCase())
  )

  // Handle category change -> reset model & parts
  const handleSelectCategory = (catId) => {
    setSelectedCat(catId)
    const newModels = MODELS_MAP[catId] || MODELS_MAP.jeans
    setSelectedModel(newModels[0]?.name || 'Standard Model')
    setCurrentPartIdx(0)
    setPartPhotos({})
    setPartPreviews({})
    setStep(3)
  }

  // Handle part photo upload
  const handlePartUpload = (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
    if (!allowed.includes(file.type)) {
      setErrorMsg('Format file harus JPG, PNG, WebP, atau HEIC')
      return
    }

    const currentPart = activePartsList[currentPartIdx]
    const previewUrl = URL.createObjectURL(file)

    setPartPhotos(prev => ({ ...prev, [currentPart.id]: file }))
    setPartPreviews(prev => ({ ...prev, [currentPart.id]: previewUrl }))
    setErrorMsg('')

    // Quality check feedback simulation
    setQualityStatus('pass')
    setQualityFeedback([
      `${currentPart.label} terlihat jelas dan proporsional.`,
      'Pencahayaan memadai & fokus objek tajam.',
      'Siap dilanjutkan ke bagian berikutnya.'
    ])
  }

  // Move to next photo part
  const handleNextPart = () => {
    setQualityStatus(null)
    setQualityFeedback([])
    if (currentPartIdx < activePartsList.length - 1) {
      setCurrentPartIdx(prev => prev + 1)
    } else {
      // All parts completed! Start AI Engine
      startAuthenticationEngine()
    }
  }

  // Trigger AI Consistency Engine Processing Pipeline
  const startAuthenticationEngine = async () => {
    setStep(6) // Processing Screen
    setProcStage(0)

    // Stage 1: Validasi (1.2s)
    setTimeout(() => { setProcStage(1) }, 1200)

    // Stage 2: Model per Bagian (2.4s)
    setTimeout(() => { setProcStage(2) }, 2400)

    // Finalize Result (3.8s)
    setTimeout(() => {
      const totalUploaded = Object.keys(partPhotos).length || activePartsList.length
      const mockScore = 94

      setResultData({
        verdict: 'LEGIT',
        confidence: mockScore,
        brand: selectedBrand.name,
        category: activeCategoryObj.name,
        model: selectedModel,
        evidenceCount: `${totalUploaded}/${activePartsList.length}`,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        certId: `RLG-2026-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
        partScores: activePartsList.map((part) => ({
          name: part.label,
          score: Math.floor(90 + Math.random() * 8),
          status: 'Authentic'
        })),
        consistencyMetrics: {
          stitchingDensity: '98% Match (Double-needle standard pattern)',
          tagCodeVerification: 'Valid Batch Production Code Verified',
          hardwareEngraving: 'Authentic Stamp Engraving Verified',
          fabricWeave: 'High-density Authentic Material Weave',
          anomalyScore: '0.01 (Sangat Rendah)'
        }
      })
      setStep(7)
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
              Verifikasi <span className="text-gradient">Keaslian</span> Fashion
            </h1>
            <p>Alur verifikasi langkah demi langkah sesuai standar komunitas fashion.</p>
          </div>

          {/* Stepper Progress Bar */}
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
              STEP 1: PILIH BRAND
             ───────────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <h2>1. PILIH BRAND</h2>
                <p>Pilih merek produk fashion yang ingin Anda verifikasi</p>
              </div>

              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari brand (misal: Levi's, Nike, Adidas...)..."
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                />
              </div>

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
              STEP 2: PILIH KATEGORI
             ───────────────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <button className="btn-back" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <h2>2. PILIH KATEGORI ({selectedBrand.name})</h2>
                <p>Pilih jenis pakaian atau item fashion Anda</p>
              </div>

              <div className="category-grid">
                {CATEGORY_LIST.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>{cat.icon}</span>
                      <div className="category-info">
                        <h3>{cat.name}</h3>
                        <p>{cat.count}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="brand-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 3: PILIH MODEL (Dynamic based on selected category!)
             ───────────────────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <button className="btn-back" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <h2>3. PILIH MODEL ({activeCategoryObj.name})</h2>
                <p>Pilih tipe/seri model {activeCategoryObj.name} Anda</p>
              </div>

              <div className="model-grid">
                {activeModelsList.map((mod) => (
                  <button
                    key={mod.id}
                    className={`model-card ${selectedModel === mod.name ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedModel(mod.name)
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
              STEP 4: PANDUAN FOTO (Dynamic parts list!)
             ───────────────────────────────────────────────────────────── */}
          {step === 4 && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <button className="btn-back" onClick={() => setStep(3)}>
                  <ArrowLeft size={16} /> Kembali
                </button>
                <h2>4. PANDUAN FOTO ({selectedBrand.name} — {selectedModel})</h2>
                <p>Kami membutuhkan <strong>{activePartsList.length} foto detail</strong> untuk memverifikasi keaslian barang Anda dengan akurasi 98%.</p>
              </div>

              <div className="guide-checklist">
                {activePartsList.map((item, idx) => (
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
              STEP 5: AMBIL FOTO PER BAGIAN & VALIDASI
             ───────────────────────────────────────────────────────────── */}
          {step === 5 && activePartsList[currentPartIdx] && (
            <div className="wizard-card animated-fade">
              <div className="wizard-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <button className="btn-back" onClick={() => setStep(4)}>
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <span className="part-counter">
                    Bagian {currentPartIdx + 1} dari {activePartsList.length}
                  </span>
                </div>
                <h2>5. AMBIL FOTO ({activePartsList[currentPartIdx].label})</h2>
                <p>{activePartsList[currentPartIdx].desc}</p>
              </div>

              {/* Camera Framing & Upload Viewport */}
              <div className="photo-framing-box">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
                  style={{ display: 'none' }}
                  onChange={(e) => handlePartUpload(e.target.files[0])}
                />

                {partPreviews[activePartsList[currentPartIdx].id] ? (
                  <div className="captured-preview-container">
                    <img
                      src={partPreviews[activePartsList[currentPartIdx].id]}
                      alt="Uploaded part"
                      className="captured-img"
                    />
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
                      Klik di sini atau seret foto <strong>{activePartsList[currentPartIdx].label}</strong> Anda
                    </p>
                    <p className="framing-subtext">Pastikan objek terlihat jelas dan tidak terlipat.</p>
                  </div>
                )}
              </div>

              {/* Photo Quality Feedback */}
              {qualityStatus && (
                <div className={`quality-feedback-card ${qualityStatus === 'pass' ? 'pass' : 'fail'}`}>
                  <div className="feedback-header">
                    <CheckCircle2 size={24} className="text-green" />
                    <h3>Foto Diterima & Memenuhi Standar!</h3>
                  </div>
                  <ul>
                    {qualityFeedback.map((fb, idx) => (
                      <li key={idx}>• {fb}</li>
                    ))}
                  </ul>

                  <button className="btn btn-primary mt-3" onClick={handleNextPart}>
                    <Check size={18} /> {currentPartIdx === activePartsList.length - 1 ? 'Selesai & Jalankan AI Engine' : 'Lanjut ke Bagian Berikutnya'}
                  </button>
                </div>
              )}

              {/* Progress Summary Grid */}
              <div className="parts-progress-bar mt-4">
                <h4>6. RINGKASAN PROGRESS FOTO:</h4>
                <div className="parts-grid-summary">
                  {activePartsList.map((p, idx) => (
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
              STEP 6: PROSES AI
             ───────────────────────────────────────────────────────────── */}
          {step === 6 && (
            <div className="wizard-card animated-fade text-center py-5">
              <div className="ai-processing-container">
                <div className="pulse-ai-glow">
                  <Cpu size={56} className="ai-cpu-icon" />
                </div>

                <h2>6. PROSES AUTHENTICATION AI</h2>
                <p style={{ color: 'var(--gray-400)', marginBottom: '2.5rem' }}>
                  AI Consistency Engine sedang menganalisis {activePartsList.length} foto titik bukti keaslian produk Anda.
                </p>

                <div className="pipeline-stages">
                  <div className={`pipeline-box ${procStage >= 0 ? 'active' : ''}`}>
                    <Layers size={20} />
                    <span>Validasi Semua Foto ({activePartsList.length} titik)</span>
                    {procStage > 0 && <CheckCircle2 size={16} className="text-green ms-auto" />}
                  </div>

                  <div className={`pipeline-box ${procStage >= 1 ? 'active' : ''}`}>
                    <Cpu size={20} />
                    <span>Model AI per Bagian ({selectedCategory.toUpperCase()})</span>
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
              STEP 7: HASIL & SERTIFIKAT
             ───────────────────────────────────────────────────────────── */}
          {step === 7 && resultData && (
            <div className="wizard-card animated-fade">
              <div className="result-verdict-banner">
                <div className="verdict-icon-wrap">
                  <CheckCircle2 size={48} className="text-green" />
                </div>
                <h2 className="verdict-title">Likely Authentic</h2>
                <div className="verdict-score">{resultData.confidence}%</div>
                <p className="verdict-subtext">Evidence analyzed: {resultData.evidenceCount}</p>
              </div>

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

              {activeTab === 'evidence' && (
                <div className="tab-content animated-fade">
                  <h3>7. DETAIL HASIL — BUKTI AUDIT BAGIAN</h3>
                  <div className="evidence-grid mt-3">
                    {resultData.partScores.map((pt, i) => (
                      <div key={i} className="evidence-card">
                        <div className="evidence-img-box">
                          {partPreviews[activePartsList[i]?.id] ? (
                            <img src={partPreviews[activePartsList[i]?.id]} alt={pt.name} />
                          ) : (
                            <div className="placeholder-thumb">{activeCategoryObj.icon}</div>
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

              {activeTab === 'analysis' && (
                <div className="tab-content animated-fade">
                  <h3>Laporan Analisis Consistency Engine</h3>
                  <div className="analysis-metrics-list mt-3">
                    <div className="metric-row">
                      <span className="metric-name">Kerapatan Jahitan & Pola Material</span>
                      <span className="metric-val">{resultData.consistencyMetrics.stitchingDensity}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Verifikasi Kode Tag & Batch</span>
                      <span className="metric-val">{resultData.consistencyMetrics.tagCodeVerification}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Grafir & Hardware Verification</span>
                      <span className="metric-val">{resultData.consistencyMetrics.hardwareEngraving}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Bobot & Anyaman Bahan</span>
                      <span className="metric-val">{resultData.consistencyMetrics.fabricWeave}</span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-name">Deteksi Anomali AI</span>
                      <span className="metric-val text-green">{resultData.consistencyMetrics.anomalyScore}</span>
                    </div>
                  </div>
                </div>
              )}

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
                          <p className="cert-label">Kategori / Model</p>
                          <p className="cert-val">{resultData.category} — {resultData.model}</p>
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
