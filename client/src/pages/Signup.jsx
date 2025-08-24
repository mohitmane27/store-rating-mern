import React from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = React.useState({ name: '', email: '', address: '', password: '' })
  const [error, setError] = React.useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signup(form)
      nav('/stores')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Signup</h2>
      <p className="text-sm text-gray-600 mb-2">Name must be 20–60 characters. Password 8–16 with at least one uppercase and one special character.</p>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="input" name="name" placeholder="Full Name" value={form.name} onChange={onChange} />
        <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input className="input" name="address" placeholder="Address" value={form.address} onChange={onChange} />
        <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="btn w-full" type="submit">Create account</button>
      </form>
    </div>
  )
}
