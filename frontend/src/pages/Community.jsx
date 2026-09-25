import { useState } from 'react'
import {
  Users, MessageSquare, ThumbsUp, ShieldAlert,
  Search, Plus, CheckCircle2, MessageCircle, Share2, Send, X, Check
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
    status: 'POLL_ACTIVE',
    aiScore: '92% Authentic (Verified by Relegit AI)',
    upvotes: 24,
    commentsList: [
      { id: 101, author: 'Budi Santoso', text: 'Stitching arcuate-nya rapi banget bro, Red Tab r-nya juga proporsional. Fix legit!', time: '10 menit yang lalu' },
      { id: 102, author: 'Andi Wijaya', text: 'Coba liat kancing depannya bang, kalo emboss-nya tajam 100% legit.', time: '5 menit yang lalu' }
    ]
  },
  {
    id: 2,
    author: 'Dimas Anggara',
    avatar: '🧢',
    time: '2 jam yang lalu',
    brand: 'Air Jordan 1 High OG',
    title: 'Spotted Fake Air Jordan 1 Lost & Found di Seller Marketplace',
    content: 'Hati-hati kawan-kawan, seller ini klaim BNIB tapi hasil scan Relegit AI menunjukkan bentuk Hourglass belakang dan font Size Tag suspicious (18% Fake probability). Stay vigilant!',
    status: 'VERIFIED_FAKE',
    aiScore: '18% Fake Detected',
    upvotes: 56,
    commentsList: [
      { id: 201, author: 'Fajar Nugraha', text: 'Mantap bang informasinya, emang seller ginian lagi marak di grup FB.', time: '1 jam yang lalu' }
    ]
  }
]

export default function CommunityPage() {
  const [posts, setPosts]               = useState(INITIAL_POSTS)
  const [searchTerm, setSearch]         = useState('')
  const [likedPosts, setLikedPosts]     = useState({})
  const [openComments, setOpenComments] = useState({}) // { [postId]: boolean }
  const [commentInputs, setCommentInputs] = useState({}) // { [postId]: string }
  const [toastMsg, setToastMsg]         = useState('')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPostForm, setNewPostForm]   = useState({ title: '', brand: '', content: '' })

  const user = JSON.parse(localStorage.getItem('relegit_user') || 'null')

  // Handle Upvote / Like
  const handleLike = (postId) => {
    const isLiked = likedPosts[postId]
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }))
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, upvotes: isLiked ? p.upvotes - 1 : p.upvotes + 1 }
      }
      return p
    }))
  }

  // Handle Comment Toggle
  const toggleComments = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  // Handle Add Comment
  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return

    const newComment = {
      id: Date.now(),
      author: user?.name || 'Pengguna Relegit',
      text,
      time: 'Baru saja'
    }

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, commentsList: [...(p.commentsList || []), newComment] }
      }
      return p
    }))

    setCommentInputs(prev => ({ ...prev, [postId]: '' }))
    showToast('Komentar berhasil ditambahkan!')
  }

  // Handle Share Post
  const handleShare = (post) => {
    navigator.clipboard.writeText(`${window.location.origin}/community#post-${post.id}`)
    showToast('🔗 Link postingan berhasil disalin ke clipboard!')
  }

  // Handle Create New Post
  const handleCreatePost = (e) => {
    e.preventDefault()
    if (!newPostForm.title || !newPostForm.content) return

    const created = {
      id: Date.now(),
      author: user?.name || 'Pengguna Relegit',
      avatar: '👤',
      time: 'Baru saja',
      brand: newPostForm.brand || 'General Fashion',
      title: newPostForm.title,
      content: newPostForm.content,
      status: 'USER_POST',
      aiScore: 'Postingan Komunitas',
      upvotes: 1,
      commentsList: []
    }

    setPosts([created, ...posts])
    setShowNewPostModal(false)
    setNewPostForm({ title: '', brand: '', content: '' })
    showToast('Postingan Anda berhasil dipublikasikan!')
  }

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Filtered posts
  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Navbar />

      <div className="verify-page" style={{ paddingTop: '6rem' }}>
        <div className="verify-page-bg-orb verify-page-bg-orb-1" />
        <div className="verify-page-bg-orb verify-page-bg-orb-2" />

        <div className="container">
          {/* Toast Alert */}
          {toastMsg && (
            <div style={{
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
              background: 'var(--purple-600)', color: 'white', padding: '0.875rem 1.5rem',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-glow)',
              display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeInUp 0.3s ease'
            }}>
              <Check size={18} /> {toastMsg}
            </div>
          )}

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
              <button
                className="btn btn-primary"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => setShowNewPostModal(true)}
              >
                <Plus size={16} /> Buat Postingan
              </button>
            </div>

            {/* Posts Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredPosts.map((post) => {
                const isLiked = likedPosts[post.id]
                const showComments = openComments[post.id]
                const comments = post.commentsList || []

                return (
                  <div
                    key={post.id}
                    id={`post-${post.id}`}
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
                      <CheckCircle2 size={16} /> 🤖 Status Audit: <strong>{post.aiScore}</strong>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                      <button
                        onClick={() => handleLike(post.id)}
                        style={{
                          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
                          color: isLiked ? '#34d399' : 'inherit', fontWeight: isLiked ? 700 : 400
                        }}
                      >
                        <ThumbsUp size={16} /> {post.upvotes} Terbantu
                      </button>

                      <button
                        onClick={() => toggleComments(post.id)}
                        style={{
                          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
                          color: showComments ? 'var(--purple-300)' : 'inherit'
                        }}
                      >
                        <MessageCircle size={16} /> {comments.length} Komentar
                      </button>

                      <button
                        onClick={() => handleShare(post)}
                        style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', marginLeft: 'auto' }}
                      >
                        <Share2 size={16} /> Bagikan
                      </button>
                    </div>

                    {/* Comments Expandable Section */}
                    {showComments && (
                      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                        {/* Comments List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                          {comments.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                          ) : (
                            comments.map(c => (
                              <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                  <strong style={{ color: 'var(--purple-300)' }}>{c.author}</strong>
                                  <span style={{ color: 'var(--gray-500)' }}>{c.time}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-200)', margin: 0 }}>{c.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Input */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="Tulis komentar diskusi..."
                            className="form-input"
                            style={{ flex: 1, padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <button className="btn btn-primary" onClick={() => handleAddComment(post.id)}>
                            <Send size={15} /> Kirim
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)',
            padding: '2rem', maxWidth: '550px', width: '100%', position: 'relative'
          }}>
            <button
              onClick={() => setShowNewPostModal(false)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Buat Postingan Komunitas</h2>

            <form onSubmit={handleCreatePost}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Merek / Item Fashion</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Misal: Levi's 511 / Nike Dunk Low..."
                  value={newPostForm.brand}
                  onChange={(e) => setNewPostForm({ ...newPostForm, brand: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Judul Postingan</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Judul pertanyaan atau wawasan..."
                  required
                  value={newPostForm.title}
                  onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Isi Postingan / Pertanyaan</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Tuliskan detail pertanyaan atau barang yang ingin Anda tanyakan ke komunitas..."
                  required
                  style={{ resize: 'vertical' }}
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                />
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={16} /> Publikasikan Postingan
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
