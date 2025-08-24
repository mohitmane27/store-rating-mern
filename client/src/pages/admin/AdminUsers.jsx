import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminUsers() {
  const [search, setSearch] = React.useState('')
  const [role, setRole] = React.useState('')
  const [sortBy, setSortBy] = React.useState('createdAt')
  const [order, setOrder] = React.useState('desc')
  const [users, setUsers] = React.useState([])

  const load = React.useCallback(() => {
    const qs = new URLSearchParams({ search, role, sortBy, order })
    fetch(`${API}/users?${qs}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUsers(d.users || []))
  }, [search, role, sortBy, order])

  React.useEffect(() => { load() }, [load])

  return (
    <div className="card">
      <div className="flex flex-wrap gap-2 mb-3">
        <input className="input" placeholder="Search name/email/address" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        <select className="input" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="createdAt">Created</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="address">Address</option>
          <option value="role">Role</option>
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
            <th className="th">Name</th>
            <th className="th">Email</th>
            <th className="th">Address</th>
            <th className="th">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map(u => (
            <tr key={u._id}>
              <td className="td">{u.name}</td>
              <td className="td">{u.email}</td>
              <td className="td">{u.address}</td>
              <td className="td"><span className="badge border-gray-300">{u.role}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
