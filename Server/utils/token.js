import jwt from 'jsonwebtoken'
import env from '../config/env.js'

export const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtAccessSecret, {
    expiresIn: env.accessExpires,
  })

export const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, env.jwtRefreshSecret, {
    expiresIn: env.refreshExpires,
  })

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret)
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret)

// Frontend aur backend alag domain pe deploy hon to sameSite 'none' karna padega
export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  // sameSite: 'lax',
  sameSite: env.cookieSameSite,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const setRefreshCookie = (res, token) =>
  res.cookie('refreshToken', token, refreshCookieOptions)