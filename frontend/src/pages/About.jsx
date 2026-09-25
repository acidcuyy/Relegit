import { Link } from 'react-router-dom'
import {
  Shield, Brain, Database, Layers, Zap,
  CheckCircle2, ArrowRight, Code2, Server
} from 'lucide-react'
import { Navbar, Footer } from '../components/Layout'

const ARCHS = [
  { name: 'MobileNetV2',    params: '3.4M',  size: '14MB',  acc: '72%', speed: '⚡⚡⚡', mobile: '✅', pick: false },
  { name: 'EfficientNet-B0',params: '5.3M',  size: '20MB',  acc: '77%', speed: '⚡⚡',  mobile: '✅', pick: true  },
  { name: 'ResNet-50',      params: '25M',   size: '98MB',  acc: '76%', speed: '⚡',   mobile: '⚠️', pick: false },
  { name: 'DINOv2 (ViT-S)', params: '21M',   size: '84MB',  acc: '81%', speed: '⚡',   mobile: '⚠️', pick: false },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG Orbs */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', filter:'blur(100px)', opacity:0.25, background:'radial-gradient(circle, #7c3aed, transparent)', top:-100, right:-100, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', filter:'blur(80px)', opacity:0.2, background:'radial-gradient(circle, #4c1d95, transparent)', bottom:0, left:-100, pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          {/* Page Header */}
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <div className="badge badge-purple" style={{ margin:'0 auto 1rem', display:'inline-flex' }}>
              <Brain size={11} /> Teknologi di Balik Relegit
            </div>
            <h1 style={{ fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:900, marginBottom:'1rem' }}>
              Tentang <span style={{ background:'linear-gradient(135deg, #c4b5fd, #8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Relegit</span>
            </h1>
            <p style={{ color:'var(--gray-400)', fontSize:'1.05rem', maxWidth:560, margin:'0 auto', lineHeight:1.75 }}>
              Platform autentikasi fashion berbasis AI yang lahir dari kebutuhan nyata komunitas fashion Indonesia di Facebook.
            </p>
          </div>

          {/* Mission */}
          <div className="glass-card" style={{ padding:'2.5rem', marginBottom:'2.5rem' }}>
            <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-start', flexWrap:'wrap' }}>
              <div style={{ width:56, height:56, background:'rgba(139,92,246,0.2)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--purple-400)', flexShrink:0 }}>
                <Shield size={26} />
              </div>
              <div style={{ flex:1, minWidth:220 }}>
                <h2 style={{ fontSize:'1.35rem', fontWeight:800, marginBottom:'0.75rem' }}>Latar Belakang</h2>
                <p style={{ color:'var(--gray-300)', lineHeight:1.8, marginBottom:'1rem' }}>
                  Di grup komunitas fashion Facebook, pertanyaan <em>"Original atau KW?"</em> selalu muncul — namun sering tidak terjawab dengan cepat dan akurat karena proses autentikasi dilakukan secara manual oleh manusia.
                </p>
                <p style={{ color:'var(--gray-300)', lineHeight:1.8 }}>
                  <strong style={{ color:'var(--white)' }}>Relegit</strong> hadir sebagai solusi: sistem AI yang mampu menganalisis detail visual fashion dan memberikan <strong style={{ color:'var(--purple-300)' }}>verdict instan</strong> dengan confidence score yang transparan.
                </p>
              </div>
            </div>
          </div>

          {/* Architecture Comparison Table */}
          <div style={{ marginBottom:'2.5rem' }}>
            <h2 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.625rem' }}>
              <Layers size={22} style={{ color:'var(--purple-400)' }} /> Perbandingan Arsitektur AI
            </h2>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, fontSize:'0.9rem' }}>
                <thead>
                  <tr>
                    {['Arsitektur','Parameter','Size','Akurasi','Kecepatan','Mobile',''].map(h => (
                      <th key={h} style={{
                        padding:'0.875rem 1rem',
                        textAlign:'left',
                        background:'rgba(255,255,255,0.04)',
                        borderBottom:'1px solid var(--glass-border)',
                        color:'var(--gray-400)',
                        fontSize:'0.75rem',
                        textTransform:'uppercase',
                        letterSpacing:'0.06em',
                        fontWeight:600,
                        whiteSpace:'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ARCHS.map((a, i) => (
                    <tr key={a.name} style={{
                      background: a.pick ? 'rgba(139,92,246,0.08)' : i%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderLeft: a.pick ? '3px solid var(--purple-500)' : '3px solid transparent',
                    }}>
                      <td style={{ padding:'1rem', fontWeight:700, color: a.pick ? 'var(--purple-300)' : 'var(--white)' }}>
                        {a.name}
                      </td>
                      <td style={{ padding:'1rem', color:'var(--gray-300)' }}>{a.params}</td>
                      <td style={{ padding:'1rem', color:'var(--gray-300)' }}>{a.size}</td>
                      <td style={{ padding:'1rem', color:'var(--gray-300)' }}>{a.acc}</td>
                      <td style={{ padding:'1rem' }}>{a.speed}</td>
                      <td style={{ padding:'1rem' }}>{a.mobile}</td>
                      <td style={{ padding:'1rem' }}>
                        {a.pick && <span className="badge badge-purple">⭐ Pilihan Kami</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              background:'rgba(139,92,246,0.08)',
              border:'1px solid rgba(139,92,246,0.3)',
              borderRadius:'var(--radius-md)',
              padding:'1.25rem',
              marginTop:'1.25rem',
              fontSize:'0.9rem',
              color:'var(--gray-300)',
              lineHeight:1.7,
            }}>
              <strong style={{ color:'var(--purple-300)' }}>🏆 Kenapa EfficientNet-B0?</strong> Arsitektur ini menggunakan <em>compound scaling</em> (width + depth + resolution) yang memberikan akurasi terbaik di kelasnya dengan ukuran model yang ringan (~20MB). Cocok untuk deployment di mobile dan laptop tanpa perlu GPU khusus.
            </div>
          </div>



          {/* CTA */}
          <div style={{ textAlign:'center', padding:'3rem', background:'var(--gradient-card)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-xl)' }}>
            <h2 style={{ fontSize:'1.75rem', fontWeight:800, marginBottom:'0.75rem' }}>Siap Mencoba?</h2>
            <p style={{ color:'var(--gray-400)', marginBottom:'1.75rem' }}>Upload foto fashion dan buktikan sendiri kekuatan AI Relegit.</p>
            <Link to="/verify" className="btn btn-primary" id="about-cta">
              <Zap size={16} /> Coba Sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
