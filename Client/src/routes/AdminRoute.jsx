import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Abhi check ho raha hai
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
      </div>
    )
  }

  // Login nahi hai
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}