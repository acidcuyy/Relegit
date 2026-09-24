import { useState } from 'react'
import {
  Users, MessageSquare, ThumbsUp, ShieldAlert,
  Search, Plus, CheckCircle2, MessageCircle, Share2
} from 'lucide-react'
import { Navbar, Footer } from '../components/Layout'

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Rian Pratama',
    avatar: '👨‍💼',
    time: '15 menit yang lalu',
    brand: "Levi's 511 Slim Fit",
    title: 'Mohon bantu cek tag patch dan red tab Levi\'s 511 ini (Beli di thrift shop)',
    content: 'Permisi suhu-suhu komunitas fashion Relegit & FB Group. Saya baru angkat Levi\'s 511 ini tapi ragu di bagian jahitan arcuate saku belakang dan font Red Tab-nya. Apakah ini legit?',
    images: ['👖', '🏷️'],
    status: 'POLL_ACTIVE',
    aiScore: '92% Authentic (Verified by Relegit AI)',
    upvotes: 24,
    comments: 12,
  },
  {
    id: 2,
    author: 'Dimas Anggara',
    avatar: '🧢',
    time: '2 jam yang lalu',
    brand: 'Air Jordan 1 High OG',
    title: 'Spotted Fake Air Jordan 1 Lost & Found di Seller Marketplace',
    content: 'Hati-hati kawan-kawan, seller ini klaim BNIB tapi hasil scan Relegit AI menunjukkan bentuk Hourglass belakang dan font Size Tag suspicious (18% Fake probability). Stay vigilant!',
    images: ['👟'],
    status: 'VERIFIED_FAKE',
    aiScore: '18% Fake Detected',
    upvotes: 56,
    comments: 29,
  }
]

export default function CommunityPage() {
  const [posts, setPosts]       = useState(INITIAL_POSTS)
  const [searchTerm, setSearch] = useState('')

  return (
    <>
      <Navbar />

      <div className="verify-page" style={{ paddingTop: '6rem' }}>
        <div className="verify-page-bg-orb verify-page-bg-orb-1" />
        <div className="verify-page-bg-orb verify-page-bg-orb-2" />

        <div className="container">
          <div className="verify-header">
            <div className="badge badge-purple" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>
              <Users size={12} /> Komunitas Legit Check Indonesia (V2)
            </div>
            <h1>
              Komunitas <span className="text-gradient">Fashion Authentication</span>
            </h1>
            <p>
              Wadah diskusi & bantuan autentikasi keaslian barang dari grup komunitas Facebook & pecinta fashion Indonesia.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Search & New Post Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div className="search-box" style={{ flex: 1, margin: 0 }}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari postingan komunitas atau brand..."
                  value={searchTerm}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} /> Buat Postingan
              </button>
            </div>

            {/* Posts Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem',
                  }}
                >
                  {/* Post Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{post.avatar}</span>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{post.author}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{post.time}</span>
                      </div>
                    </div>
                    <span className="badge badge-purple">{post.brand}</span>
                  </div>

                  {/* Post Body */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>
                    {post.title}
                  </h3>
                  <p style={{ color: 'var(--gray-300)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {post.content}
                  </p>

                  {/* AI Badge Overlay */}
                  <div style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    color: 'var(--purple-300)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <CheckCircle2 size={16} /> 🤖 AI Verdict: <strong>{post.aiScore}</strong>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                    <button style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <ThumbsUp size={16} /> {post.upvotes} Terbantu
                    </button>
                    <button style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <MessageCircle size={16} /> {post.comments} Komentar
                    </button>
                    <button style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', marginLeft: 'auto' }}>
                      <Share2 size={16} /> Bagikan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
