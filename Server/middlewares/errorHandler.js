import env from '../config/env.js'
import ApiError from '../utils/ApiError.js'

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || 500
  let message = err.message || 'Something went wrong'

  if (err.code === 11000) {
    status = 409
    const field = Object.keys(err.keyValue || {})[0]
    message = `${field || 'Value'} already exists`
  }
  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }
  if (err.name === 'CastError') {
    status = 400
    message = 'Invalid id'
  }

  if (status === 500) console.error(err)

  res.status(status).json({
    success: false,
    message: status === 500 && env.isProd ? 'Something went wrong' : message,
    ...(err.details && { details: err.details }),
  })
}