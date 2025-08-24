import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminStores() {
  const [search, setSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState('createdAt')
  const [order, setOrder] = React.useState('desc')
  const [stores, setStores] = React.useState([])

  const [form, setForm] = React.useState({ name: '', email: '', address: '', ownerId: '' })
  const [msg, setMsg] = React.useState('')

  const load = React.useCallback(() => {
    const qs = new URLSearchParams({ search, sortBy, order })
    fetch(`${API}/stores?${qs}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setStores(d.stores || []))
  }, [search, sortBy, order])

  React.useEffect(() => { load() }, [load])

  const create = async (e) => {
    e.preventDefault()
    setMsg('')
    const r = await fetch(`${API}/stores`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    })
    const d = await r.json()
    if (r.ok) { setMsg('Store created'); setForm({ name:'',email:'',address:'',ownerId:''}); load() }
    else setMsg(d.error || 'Failed')
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
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
        <table className="table">
          <thead className="bg-gray-50">
            <tr>
              <th className="th">Store</th>
              <th className="th">Email</th>
              <th className="th">Address</th>
              <th className="th">Avg Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {stores.map(s => (
              <tr key={s._id}>
                <td className="td">{s.name}</td>
                <td className="td">{s.email}</td>
                <td className="td">{s.address}</td>
                <td className="td">{s.averageRating ? s.averageRating.toFixed(2) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Add Store</h3>
        <form className="grid gap-3" onSubmit={create}>
          <input className="input" placeholder="Store Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <input className="input" placeholder="Store Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          <input className="input" placeholder="Address" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} />
          <input className="input" placeholder="Owner User ID (optional)" value={form.ownerId} onChange={e=>setForm(f=>({...f,ownerId:e.target.value}))} />
          <button className="btn">Create</button>
        </form>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>
    </div>
  )
}
