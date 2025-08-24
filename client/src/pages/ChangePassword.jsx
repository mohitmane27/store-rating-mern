import React from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ChangePassword() {
  const [oldPassword, setOld] = React.useState('')
  const [newPassword, setNew] = React.useState('')
  const [msg, setMsg] = React.useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    const r = await fetch(`${API}/auth/change-password`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword })
    })
    const d = await r.json()
    setMsg(r.ok ? 'Password updated' : (d.error || 'Failed'))
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form className="space-y-3" onSubmit={submit}>
        <input className="input" placeholder="Old Password" type="password" value={oldPassword} onChange={e=>setOld(e.target.value)} />
        <input className="input" placeholder="New Password" type="password" value={newPassword} onChange={e=>setNew(e.target.value)} />
        <button className="btn w-full">Update</button>
      </form>
      {msg && <p className="text-sm mt-3">{msg}</p>}
    </div>
  )
}
