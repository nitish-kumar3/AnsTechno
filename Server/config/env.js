import 'dotenv/config'

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']
const missing = required.filter((key) => !process.env[key])

if (missing.length) {
  console.error(`Missing .env variables: ${missing.join(', ')}`)
  process.exit(1)
}

const env = {
  port: process.env.PORT || 5000,
  isProd: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpires: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  refreshExpires: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  admin: {
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
    mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.MAIL_TO,
  },
    cloudinary: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
  },
  cookieSameSite: process.env.COOKIE_SAMESITE || 'lax',
    gemini: {
    key: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  },
  chatDailyLimit: Number(process.env.CHAT_DAILY_LIMIT) || 300,
}

export default env