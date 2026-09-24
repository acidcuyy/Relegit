import { useState, useEffect } from 'react'
import { User, Shield, Award, History, Settings, Mail, Calendar, CheckCircle2, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar, Footer } from '../components/Layout'

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('relegit_user') || 'null') || {
    name: 'Pengguna Relegit',
    email: 'user@relegit.com',
    role: 'Fashion Collector & Authenticator'
  }

  return (
    <>
      <Navbar />

      <div className="verify-page" style={{ paddingTop: '6rem' }}>
        <div className="verify-page-bg-orb verify-page-bg-orb-1" />
        <div className="verify-page-bg-orb verify-page-bg-orb-2" />

        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* User Profile Card Header */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'var(--gradient-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'white',
                boxShadow: 'var(--shadow-glow)'
              }}>
                {(user.name?.[0] || 'U').toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.25rem' }}>{user.name}</h1>
                <p style={{ color: 'var(--purple-300)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <Mail size={14} style={{ verticalAlign: 'middle', marginRight: '0.375rem' }} />
                  {user.email}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-purple">
                    <Shield size={12} /> {user.role || 'Member'}
                  </span>
                  <span className="badge badge-green">
                    <CheckCircle2 size={12} /> Akun Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* User Statistics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--purple-400)' }}>12</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Total Audit Fashion</p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399' }}>10</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Item Authentic (Original)</p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: '#f87171' }}>2</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Terdeteksi Fake</p>
              </div>
            </div>

            {/* User Saved Certificates */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} className="text-purple" /> Sertifikat Digital Tersimpan
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>Levi's 511 Slim Fit Jeans</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>ID: RLG-2026-5110-LEVI • 92% Authentic</p>
                  </div>
                  <Link to="/verify" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                    <Download size={14} /> View Certificate
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
