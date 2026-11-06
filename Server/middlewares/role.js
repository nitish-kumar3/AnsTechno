import ApiError from '../utils/ApiError.js'

// Use: authorize('admin')  ya  authorize('admin', 'hr')
export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, 'Please login to continue'))
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do this'))
    }
    next()
  }