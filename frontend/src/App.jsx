import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import { LoginPage, RegisterPage } from './pages/Auth'
import VerifyPage from './pages/Verify'
import HistoryPage from './pages/History'
import AboutPage from './pages/About'
import CommunityPage from './pages/Community'
import ProfilePage from './pages/Profile'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('relegit_token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/about"     element={<AboutPage />} />

        {/* Protected Routes — Requires Login */}
        <Route path="/verify"    element={<PrivateRoute><VerifyPage /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/history"   element={<PrivateRoute><HistoryPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
