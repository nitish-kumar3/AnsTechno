// async controller me error aaye to apne aap errorHandler tak pahunch jaye
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)