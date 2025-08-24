import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminDashboard() {
  const [data, setData] = React.useState(null)
  React.useEffect(() => {
    fetch(`${API}/admin/dashboard`, { credentials: 'include' })
      .then(r => r.json()).then(setData)
  }, [])
  if (!data) return <div className="card">Loading...</div>
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card">
        <div className="text-sm text-gray-500">Total Users</div>
        <div className="text-3xl font-semibold">{data.totalUsers}</div>
      </div>
      <div className="card">
        <div className="text-sm text-gray-500">Total Stores</div>
        <div className="text-3xl font-semibold">{data.totalStores}</div>
      </div>
      <div className="card">
        <div className="text-sm text-gray-500">Total Ratings</div>
        <div className="text-3xl font-semibold">{data.totalRatings}</div>
      </div>
    </div>
  )
}
