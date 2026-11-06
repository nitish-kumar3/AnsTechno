import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

export default function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}