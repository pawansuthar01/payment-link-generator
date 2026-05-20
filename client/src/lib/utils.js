// ─── Shared utilities (DRY: import from here, never redefine) ────────────────

/** Format paise → ₹ currency string */
export function formatAmount(currency, paise) {
  if (!paise && paise !== 0) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(paise / 100)
}

/** Format ISO date string → readable locale date */ 
//  created_at = 1779294753 ye aai gi 
export function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso*1000).toLocaleDateString('en-IN', {
    day: '2-digit', 
    month: 'short',
    year: 'numeric',
    minute:"numeric",
    hour:"numeric",
    second:"numeric",
    hour12:true,
  })
}

/** Format ISO date string → locale date + time */
export function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Map payment status → CSS chip class */
export function statusTone(status = '') {
  const s = String(status).toLowerCase()
  if (s.includes('paid')) return 'chip chip-success'
  if (s.includes('expired')) return 'chip chip-warn'
  if (s.includes('cancel')) return 'chip chip-muted'
  return 'chip chip-info'
}

/** Map payment status → human label */
export function statusLabel(status = '') {
  const s = String(status).toLowerCase()
  if (s.includes('paid')) return 'Paid'
  if (s.includes('expired')) return 'Expired'
  if (s.includes('cancel')) return 'Cancelled'
  if (s.includes('created')) return 'Created'
  return status || 'Unknown'
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────


/** Load all saved payment links from localStorage */
export async function loadLinks() {
  try {
    const raw = await apiFetchLinks()
    console.log(raw)
    return raw || []
  } catch {
    return []
  }
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const AUTH_TOKEN_KEY = 'payment_link_auth_token'

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  } catch {
    // ignore storage failures
  }
}

export function clearAuthToken() {
  setAuthToken('')
}

function authHeaders(extraHeaders = {}) {
  const token = getAuthToken()
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function apiLogin(pin) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || 'Login failed')
  }
  return data
}

/** POST /api/create-link */
export async function apiCreateLink(payload) {
  const res = await fetch('/api/create-link', {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(
      data?.error?.description || data?.error || 'Failed to create payment link'
    )
  }
  return data
}

/** GET /api/link/:id */
export async function apiFetchLink(id) {
  const res = await fetch(`/api/link/${id}`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(
      data?.error?.description || data?.error || 'Failed to fetch payment link'
    )
  }
  return data
}

/** GET /api/links */
export async function apiFetchLinks() {
  try {
    const res = await fetch('/api/links', { headers: authHeaders() })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(
        data?.error?.description || data?.error || 'Failed to fetch payment link'
      )
    }
    return data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error), { cause: error })
  }
  
}

/** Copy text to clipboard, return true on success */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
