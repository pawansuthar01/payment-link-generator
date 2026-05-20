import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()

const corsOptions = {
  origin: [
    'https://paytx.vercel.app',
    'http://localhost:5173', // local dev
    'http://localhost:3000', // local dev alt
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())

const RAZOR_KEY_ID = process.env.RAZORPAY_KEY_ID || ''
const RAZOR_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''
const APP_PIN = process.env.APP_PIN || process.env.APP_PASSWORD || ''
const JWT_SECRET = process.env.JWT_SECRET || ''
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is required`)
  }
}

function issueToken() {
  requireEnv('JWT_SECRET', JWT_SECRET)
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' })
    }

    requireEnv('JWT_SECRET', JWT_SECRET)
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function razorpayAuthHeader() {
  requireEnv('RAZORPAY_KEY_ID', RAZOR_KEY_ID)
  requireEnv('RAZORPAY_KEY_SECRET', RAZOR_KEY_SECRET)
  const token = Buffer.from(`${RAZOR_KEY_ID}:${RAZOR_KEY_SECRET}`).toString('base64')
  return `Basic ${token}`
}

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.post('/api/auth/login', (req, res) => {
  try {
    requireEnv('APP_PIN', APP_PIN)
    if (!/^\d{4}$/.test(APP_PIN)) {
      return res.status(500).json({ error: 'APP_PIN must be exactly 4 digits' })
    }

    const pin = String(req.body?.pin || req.body?.password || '')
    if (!/^\d{4}$/.test(pin) || pin !== APP_PIN) {
      return res.status(401).json({ error: 'Invalid PIN' })
    }

    const token = issueToken()
    return res.json({ token, expiresIn: JWT_EXPIRES_IN })
  } catch (error) {
    return res.status(500).json({ error: String(error.message || error) })
  }
})

// Create a payment link
app.post('/api/create-link', verifyToken, async (req, res) => {
  try {
    const body = req.body
    // forward request to Razorpay Payment Links API
    const response = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    console.log(data)
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// Get payment link by id
app.get('/api/link/:id', verifyToken, async (req, res) => {
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payment_links/${req.params.id}`, {
      headers: { Authorization: razorpayAuthHeader() }
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.get('/api/links', verifyToken, async (req, res) => {
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payment_links`, {
      headers: { Authorization: razorpayAuthHeader() }
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
