import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Stars = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} className={`btn px-2 ${value>=n ? 'font-bold' : ''}`} onClick={() => onChange(n)} type="button">{n}</button>
      ))}
    </div>
  )
}

export default function UserStores() {
  const [search, setSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState('createdAt')
  const [order, setOrder] = React.useState('desc')
  const [stores, setStores] = React.useState([])
  const [myRatings, setMyRatings] = React.useState({})
  const [msg, setMsg] = React.useState('')

  const load = React.useCallback(() => {
    const qs = new URLSearchParams({ search, sortBy, order })
    fetch(`${API}/stores?${qs}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setStores(d.stores || []))
  }, [search, sortBy, order])

  React.useEffect(() => { load() }, [load])

  const loadMy = async (storeId) => {
    const r = await fetch(`${API}/ratings/mine/${storeId}`, { credentials: 'include' })
    const d = await r.json()
    setMyRatings(m => ({ ...m, [storeId]: d.rating?.value || 0 }))
  }

  React.useEffect(() => {
    stores.forEach(s => loadMy(s._id))
    // eslint-disable-next-line
  }, [stores.length])

  const rate = async (storeId, value) => {
    setMsg('')
    const r = await fetch(`${API}/ratings/upsert`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ storeId, value })
    })
    const d = await r.json()
    if (r.ok) {
      setMyRatings(m => ({ ...m, [storeId]: value }))
      load()
    } else setMsg(d.error || 'Failed')
  }

  return (
    <div className="card">
      <div className="flex flex-wrap gap-2 mb-3">
        <input className="input" placeholder="Search name/email/address" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="input" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="createdAt">Created</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="address">Address</option>
          <option value="rating">Rating</option>
        </select>
        <select className="input" value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button className="btn" onClick={load}>Apply</button>
      </div>

      {msg && <p className="text-sm mb-2">{msg}</p>}

      <table className="table">
        <thead className="bg-gray-50">
          <tr>
            <th className="th">Store</th>
            <th className="th">Email</th>
            <th className="th">Address</th>
            <th className="th">Avg Rating</th>
            <th className="th">My Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {stores.map(s => (
            <tr key={s._id}>
              <td className="td">{s.name}</td>
              <td className="td">{s.email}</td>
              <td className="td">{s.address}</td>
              <td className="td">{s.averageRating ? s.averageRating.toFixed(2) : '-'}</td>
              <td className="td">
                <Stars value={myRatings[s._id] || 0} onChange={(v)=>rate(s._id, v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
