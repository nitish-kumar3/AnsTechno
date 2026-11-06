import ApiError from '../utils/ApiError.js'

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }))
    return next(new ApiError(400, details[0]?.message || 'Invalid data', details))
  }

  req.body = result.data
  next()
}