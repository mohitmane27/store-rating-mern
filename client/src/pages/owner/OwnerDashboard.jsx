import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function OwnerDashboard() {
  const [storeId, setStoreId] = React.useState('')
  const [myStores, setMyStores] = React.useState([])
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    // Load all stores where I'm owner
    fetch(`${API}/stores?search=`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        // Filter on client side by owner via /stores aggregation doesn't include owner; do full fetchs or simply filter by hitting /stores and then GET store details to check owner.
        setMyStores(d.stores || [])
      })
  }, [])

  const load = async () => {
    if (!storeId) return
    const r = await fetch(`${API}/ratings/owner/${storeId}`, { credentials: 'include' })
    const d = await r.json()
    setData(d)
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Owner Dashboard</h3>
      <div className="flex gap-2 mb-3">
        <input className="input" placeholder="Enter your Store ID" value={storeId} onChange={e=>setStoreId(e.target.value)} />
        <button className="btn" onClick={load}>Load</button>
      </div>
      {!data ? <p className="text-sm text-gray-600">Enter your store ID to view ratings and average.</p> : (
        <div>
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <div className="card">
              <div className="text-sm text-gray-500">Ratings Count</div>
              <div className="text-2xl font-semibold">{data.ratingCount}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-500">Average Rating</div>
              <div className="text-2xl font-semibold">{data.averageRating ? data.averageRating.toFixed(2) : '-'}</div>
            </div>
          </div>
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="th">User</th>
                <th className="th">Email</th>
                <th className="th">Rating</th>
                <th className="th">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.ratings?.map((r) => (
                <tr key={r._id}>
                  <td className="td">{r.user?.name}</td>
                  <td className="td">{r.user?.email}</td>
                  <td className="td">{r.value}</td>
                  <td className="td">{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
