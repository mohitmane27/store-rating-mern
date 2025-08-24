import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminStores from './pages/admin/AdminStores.jsx'
import UserStores from './pages/user/UserStores.jsx'
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import { useAuth } from './hooks/useAuth.jsx'
import Providers from './providers.jsx'

const Nav = () => {
  const { user, logout } = useAuth()
  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">⭐ Store Ratings</Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="badge border-gray-300">{user.role}</span>
              <Link className="btn" to="/change-password">Change Password</Link>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Login</Link>
              <Link className="btn" to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const Protected = ({ roles, children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="max-w-6xl mx-auto p-6">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Providers>
      <div>
        <Nav />
        <div className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/change-password" element={<Protected><ChangePassword /></Protected>} />

            <Route path="/admin/dashboard" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
            <Route path="/admin/users" element={<Protected roles={['admin']}><AdminUsers /></Protected>} />
            <Route path="/admin/stores" element={<Protected roles={['admin']}><AdminStores /></Protected>} />

            <Route path="/stores" element={<Protected roles={['user','admin','owner']}><UserStores /></Protected>} />
            <Route path="/owner/dashboard" element={<Protected roles={['owner','admin']}><OwnerDashboard /></Protected>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Providers>
  )
}

const Home = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Welcome</h2>
      <p>This app lets users rate stores from 1 to 5. Admins can manage users and stores. Owners can see who rated their store.</p>
      <div className="mt-3 flex gap-3">
        <Link className="btn" to="/stores">Browse Stores</Link>
        <Link className="btn" to="/admin/dashboard">Admin Dashboard</Link>
        <Link className="btn" to="/owner/dashboard">Owner Dashboard</Link>
      </div>
    </div>
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Instructions</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Sign up as a normal user to rate stores.</li>
        <li>Ask admin to create store owner accounts and stores.</li>
        <li>Tables support search & sorting. Ratings are editable.</li>
      </ul>
    </div>
  </div>
)
