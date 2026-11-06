import { z } from 'zod'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  refreshCookieOptions,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js'

/* ---------- Validation schemas ---------- */
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long'),
  phone: z.string().trim().max(20).optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

/* ---------- Controllers ---------- */

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  if (await User.findOne({ email })) {
    throw new ApiError(409, 'Email already registered')
  }

  // role body se nahi lete, hamesha 'user'
  const user = await User.create({ name, email, password, phone })

  setRefreshCookie(res, signRefreshToken(user))
  res.status(201).json({
    success: true,
    user,
    accessToken: signAccessToken(user),
  })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  if (!user.isActive) throw new ApiError(403, 'Your account is disabled')

  await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() })

  setRefreshCookie(res, signRefreshToken(user))
  res.json({
    success: true,
    user,
    accessToken: signAccessToken(user),
  })
})

// POST /api/auth/refresh  (cookie se naya access token)
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken
  if (!token) throw new ApiError(401, 'Please login to continue')

  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw new ApiError(401, 'Session expired, please login again')
  }

  const user = await User.findById(payload.id)
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Account not found or disabled')
  }

  setRefreshCookie(res, signRefreshToken(user))
  res.json({
    success: true,
    user,
    accessToken: signAccessToken(user),
  })
})

// POST /api/auth/logout
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('refreshToken', refreshCookieOptions)
  res.json({ success: true, message: 'Logged out' })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user })
})