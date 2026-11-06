import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { verifyAccessToken } from '../utils/token.js'

// Login zaroori hai
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Please login to continue')
  }

  let payload
  try {
    payload = verifyAccessToken(header.split(' ')[1])
  } catch {
    throw new ApiError(401, 'Session expired, please login again')
  }

  const user = await User.findById(payload.id)
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Account not found or disabled')
  }

  req.user = user
  next()
})