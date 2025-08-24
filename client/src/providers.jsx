import React from 'react'
import { AuthProvider } from './hooks/useAuth.jsx'

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
