import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Inbox, Layers, Lock, Mail, ShieldCheck, Users } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNoIndex } from '../../hooks/useNoIndex'
import ThemeToggle from '../../components/ui/ThemeToggle'

const features = [
  { icon: Layers, text: 'Manage services, projects and testimonials' },
  { icon: Users, text: 'Review job and internship applications' },
  { icon: Inbox, text: 'Read and reply to client messages' },
]

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/10 sm:text-sm'

export default function AdminLogin() {
  useNoIndex()
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Login ke baad kahan jana hai
  const goTo = location.state?.from?.pathname || '/admin'

  if (loading) return null
  if (user) return <Navigate to={goTo} replace /> // pehle se login hai

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please enter your email and password')
      return
    }

    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate(goTo, { replace: true })
    } catch (err) {
      if (!err.response && !err.message.includes('admin access')) {
        setError('Cannot reach the server. Is the backend running?')
      } else {
        setError(err.response?.data?.message || err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative isolate grid min-h-screen lg:grid-cols-2">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] bg-[radial-gradient(circle_at_center,rgba(25,195,154,0.25),transparent_65%)]" />
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] bg-[radial-gradient(circle_at_center,rgba(15,157,123,0.2),transparent_65%)]" />
      </div>

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left: brand panel (sirf bade screen par) */}
      <div className="hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-brand-300 to-brand-600 text-xl font-bold text-black">
            A
          </span>
          <span className="text-xl font-bold tracking-tight">Anstechno</span>
        </Link>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-5xl font-bold leading-[1.1] tracking-tight"
          >
            Run your whole website from <span className="text-gradient">one place</span>
          </motion.h1>

          <ul className="mt-10 space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={f.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-4 text-white/70"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-400">
                  <f.icon size={20} />
                </span>
                {f.text}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/40">© {new Date().getFullYear()} Anstechno</p>
      </div>

      {/* Right: login form */}
      <div className="flex items-center justify-center p-5 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glow-border w-full max-w-md rounded-[2rem] p-[1.5px]"
        >
          <div className="rounded-[1.9rem] bg-[#07100c] p-7 sm:p-9">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
              <ShieldCheck size={28} />
            </span>
            <h2 className="mt-6 text-3xl font-bold">Admin Login</h2>
            <p className="mt-2 text-sm text-white/55">
              Sign in to manage your website.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Email</span>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    placeholder="admin@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Password</span>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`${inputClass} pr-12`}
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-brand-300"
            >
              <ArrowLeft size={16} /> Back to website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}