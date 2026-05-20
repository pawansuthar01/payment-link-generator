import { useState, useEffect, useMemo, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  formatAmount, formatDate, statusTone, statusLabel,
  loadLinks,
  apiCreateLink, apiFetchLink, copyToClipboard,
  apiFetchLinks, apiLogin, getAuthToken, setAuthToken, clearAuthToken
} from './lib/utils'
import './index.css'

// ── Minimalist SVG Icon Components ───────────────────────────────────────────

function IconHome({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconHistory({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconPlus({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconCopy({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconCheck({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconAlert({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function IconLink({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconEmpty({ size = 48, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <line x1="22" y1="10" x2="2" y2="10" />
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function IconInfo({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function IconLock({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconEmail({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconSms({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconWhatsapp({ size = 16, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}


// ── Topbar / Shell ─────────────────────────────────────────────────────────

function Topbar({ linksCount, authenticated, onLogout }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  function handleLogout() {
    clearAuthToken()
    onLogout()
    navigate('/', { replace: true })
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      if (open) setOpen(false)
    })
  }, [location.pathname, open])

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="brand-wrap">
          <div className="brand-logo">RP</div>
          <div>
            <div className="brand-name">RazorPay Links</div>
            <div className="brand-sub">Payment Dashboard</div>
          </div>
        </Link>

        {/* Desktop nav - Only Home and History */}
        <nav className="nav-links" aria-label="Primary navigation">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            <IconHome size={14} style={{ marginRight: 6 }} /> Home
          </Link>
          {/* <Link to="/links" className={isActive('/links') ? 'active' : ''}>
            <IconHistory size={14} style={{ marginRight: 6 }} /> History
            {linksCount > 0 && <span className="nav-badge">{linksCount}</span>}
          </Link> */}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        {authenticated && (
          <button className="btn btn-ghost btn-sm topbar-logout" type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      <nav className={`nav-drawer${open ? ' open' : ''}`} aria-label="Mobile navigation">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          <IconHome size={16} style={{ marginRight: 8 }} /> Home
        </Link>
        <Link to="/links" className={isActive('/links') ? 'active' : ''}>
          <IconHistory size={16} style={{ marginRight: 8 }} /> History {linksCount > 0 ? `(${linksCount})` : ''}
        </Link>
      </nav>
    </header>
  )
}

function Shell({ children, linksCount, authenticated, onAuthenticated, onLogout }) {
  const location = useLocation()
  const isPublicRoute = location.pathname === '/thank-you'

  return (
    <div className="app-shell">
      <Topbar linksCount={linksCount} authenticated={authenticated} onLogout={onLogout} />
      {authenticated || isPublicRoute ? (
        <main>{children}</main>
      ) : (
        <main className="auth-shell">
          <AuthPinModal onAuthenticated={onAuthenticated} />
        </main>
      )}
    </div>
  )
}

function AuthPinModal({ onAuthenticated }) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const cleanPin = pin.replace(/\D/g, '')
    if (!/^\d{4}$/.test(cleanPin)) {
      setError('PIN must be exactly 4 digits.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await apiLogin(cleanPin)
      setAuthToken(data.token)
      onAuthenticated()
    } catch (err) {
      setError(err.message || 'PIN verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal card">
        <div className="auth-modal-badge">
          <IconLock size={16} />
          Secure PIN Access
        </div>
        <div className="auth-modal-copy">
          <div className="eyebrow">Protected Dashboard</div>
          <h1>Enter 4-digit PIN</h1>
          <p>
            Access is locked with a numeric PIN. The JWT session expires automatically after 24 hours.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              minLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              autoComplete="one-time-code"
              required
            />
            <span className="field-hint">Numbers only, exactly 4 digits.</span>
          </div>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Unlock Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Home Page (Create Form + Recent 5 Links below it) ──────────────────────

const INITIAL_FORM = {
  customerName: '',
  customerEmail: '',
  customerContact: '',
  amount: '',
  description: '',
  note: '',
  currency: 'INR',
  referenceId: '',
  notifyEmail: false,
  notifySms: false,
  notifyWhatsapp: false,
}

function HomePage({  onSave }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [links,setLinks ] = useState([])
  const [loadingLinks,setLoadingLinks]=useState(true)
  const update = useCallback(
    (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
    []
  )
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await apiFetchLinks()
        if (cancelled) return
        setLinks(res.payment_links || res || [])
      } catch {
        if (!cancelled) setLinks([])
      } finally {
        if (!cancelled) setLoadingLinks(false)
      }
    })()
    return () => { cancelled = true }
  }, [])
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const paise = Math.round(Number(form.amount) * 100)
    if (!form.customerName.trim()) return setError('Customer name is required.')
    if (!paise || paise < 100) return setError('Enter a valid amount (minimum ₹1).')

    // Contact number validation if SMS/WhatsApp is enabled or if field has value
    let contactPayload = undefined
    if (form.customerContact.trim() || form.notifySms || form.notifyWhatsapp) {
      const contactClean = form.customerContact.replace(/[\s()-]/g, '')
      if (!contactClean.startsWith('+') || contactClean.length < 8 || !/^\+[0-9]+$/.test(contactClean)) {
        return setError('Please enter a valid phone number in international format starting with country code (e.g., +919876543210).')
      }
      contactPayload = contactClean
    }

    // Email validation if Email notification is enabled or if field has value
    let emailPayload = undefined
    if (form.customerEmail.trim() || form.notifyEmail) {
      const emailClean = form.customerEmail.trim()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
        return setError('Please enter a valid email address.')
      }
      emailPayload = emailClean
    }

    // Toggle requirements checks
    if (form.notifyEmail && !emailPayload) {
      return setError('Customer email is required when Email notification is enabled.')
    }
    if ((form.notifySms || form.notifyWhatsapp) && !contactPayload) {
      return setError('Customer contact number is required when SMS/WhatsApp notification is enabled.')
    }

    setLoading(true)
    try {
      const data = await apiCreateLink({
        amount: paise,
        currency: form.currency||'INR',
        reference_id: form.referenceId || undefined,
        description: form.description || undefined,
        customer: {
          name: form.customerName,
          email: emailPayload || undefined,
          contact: contactPayload || undefined,
        },
        notify: {
          sms: form.notifySms,
          email: form.notifyEmail,
          whatsapp: form.notifyWhatsapp,
        },
        reminder_enable: true,
        callback_url: `${window.location.origin}/thank-you`,
        callback_method: 'get',
      })

      const id = data.id || data?.data?.id
      const record = {
        id,
        shortUrl: data.short_url || data?.data?.short_url || '',
        status: data.status || 'created',
        amount: paise,
        customerName: form.customerName,
        customerEmail: emailPayload || '',
        customerContact: contactPayload || '',
        description: form.description,
        note: form.note,
        referenceId: form.referenceId,
        notifyEmail: form.notifyEmail,
        notifySms: form.notifySms,
        notifyWhatsapp: form.notifyWhatsapp,
        createdAt: new Date().toISOString(),
      }
      onSave(record)
      setForm(INITIAL_FORM) // Reset form on success
      navigate(`/link/${id}`, { state: { link: record, api: data } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container create-layout fade-in">
      <div className="section-head">
        <div>
          <div className="eyebrow">Payment Link Dashboard</div>
          <h1>Create a Payment Link</h1>
          <p className="text-sm text-muted" style={{ marginTop: 6 }}>
            Fill in the details below to generate an instant, shareable Razorpay payment link.
          </p>
        </div>
      </div>

      {/* Main Create Link Card */}
      <div className="card form-card">
        <div className="form-title">
          <h2>Payment Details</h2>
          <p>Please enter the transaction credentials.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="customerName">Customer Name *</label>
              <input
                id="customerName"
                placeholder="e.g. Rahul Sharma"
                value={form.customerName}
                onChange={update('customerName')}
                required
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="amount">Currency </label>
              <div className="input-wrap">
               <select
                  id="currency"
                  value={form.currency}
                  onChange={update('currency')}
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
                
              </div>
            </div>

            <div className="field">
              <label htmlFor="amount">Amount </label>
              <div className="input-wrap">
                <span className="input-prefix">₹</span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="1499"
                  value={form.amount}
                  onChange={update('amount')}
                  required
                />
              </div>
            </div><div className="field">
              <label htmlFor="referenceId">Reference ID</label>
              <input
                id="referenceId"
                placeholder="e.g. INV-102"
                value={form.referenceId}
                onChange={update('referenceId')}
              />
              <span className="field-hint">For your internal tracking records</span>
            </div>

            <div className="field span-2">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="e.g. Payment for invoice #102"
                value={form.description}
                onChange={update('description')}
              />
            </div>

            <div className="field span-2">
              <label htmlFor="note">Note</label>
              <textarea
                id="note"
                placeholder="Optional note for yourself"
                value={form.note}
                onChange={update('note')}
              />
            </div>

            
          </div>

          <hr className="divider" style={{ margin: '24px 0' }} />

          {/* Notification Channels Toggle Group */}
          <div className="notify-section">
            <h3>Notification Channels</h3>
            <div className="notify-grid">
              <div 
                className={`notify-card ${form.notifyEmail ? 'active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, notifyEmail: !f.notifyEmail }))}
              >
                <div className="notify-info">
                  <div className="notify-icon">
                    <IconEmail size={16} />
                  </div>
                  <div className="notify-details">
                    <span className="notify-label">Email Notify</span>
                    <span className="notify-desc">Send receipt to email</span>
                  </div>
                </div>
                <label className="switch" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={form.notifyEmail}
                    onChange={(e) => setForm((f) => ({ ...f, notifyEmail: e.target.checked }))}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div 
                className={`notify-card ${form.notifySms ? 'active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, notifySms: !f.notifySms }))}
              >
                <div className="notify-info">
                  <div className="notify-icon">
                    <IconSms size={16} />
                  </div>
                  <div className="notify-details">
                    <span className="notify-label">SMS Notify</span>
                    <span className="notify-desc">Send SMS payment link</span>
                  </div>
                </div>
                <label className="switch" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={form.notifySms}
                    onChange={(e) => setForm((f) => ({ ...f, notifySms: e.target.checked }))}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div 
                className={`notify-card ${form.notifyWhatsapp ? 'active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, notifyWhatsapp: !f.notifyWhatsapp }))}
              >
                <div className="notify-info">
                  <div className="notify-icon">
                    <IconWhatsapp size={16} />
                  </div>
                  <div className="notify-details">
                    <span className="notify-label">WhatsApp</span>
                    <span className="notify-desc">Send automated text</span>
                  </div>
                </div>
                <label className="switch" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={form.notifyWhatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, notifyWhatsapp: e.target.checked }))}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Conditionally Rendered Customer Details based on Toggles */}
          {(form.notifyEmail || form.notifySms || form.notifyWhatsapp) && (
            <div className="field-grid form-reveal" style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              {form.notifyEmail && (
                <div className="field span-2 form-reveal">
                  <label htmlFor="customerEmail">Customer Email *</label>
                  <input
                    id="customerEmail"
                    type="email"
                    placeholder="e.g. rahul.sharma@example.com"
                    value={form.customerEmail}
                    onChange={update('customerEmail')}
                    required={form.notifyEmail}
                  />
                </div>
              )}

              {(form.notifySms || form.notifyWhatsapp) && (
                <div className="field span-2 form-reveal">
                  <label htmlFor="customerContact">Customer Phone Number *</label>
                  <input
                    id="customerContact"
                    type="tel"
                    placeholder="e.g. +91 98765 43210 (starts with + and country code)"
                    value={form.customerContact}
                    onChange={update('customerContact')}
                    required={form.notifySms || form.notifyWhatsapp}
                  />
                  <span className="field-hint">International format starting with country code is required for automated dispatch. (e.g., +919876543210 or +15550192834)</span>
                </div>
              )}
            </div>
          )}


          {error && (
            <div className="alert alert-error" role="alert" style={{ marginTop: 16 }}>
              <span className="alert-icon"><IconAlert size={16} /></span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Creating…</> : <><IconPlus size={16} style={{ marginRight: 6 }} /> Create Payment Link</>}
            </button>
            <span className="form-note">Processed securely via Razorpay API</span>
          </div>
        </form>
      </div>

      {/* Recent Links Section (Show max 5) */}
      <div className="recent-section" style={{ marginTop: 12 }}>
        <div className="section-head">
          <div>
            <h2>Recent Payment Links</h2>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>Showing your latest 5 created payment links.</p>
          </div>
          {loadingLinks && <div className="loading" />} { !loadingLinks &&  links?.length > 5 && (
            <Link to="/links" className="btn btn-secondary btn-sm">
              <IconHistory size={14} style={{ marginRight: 6 }} /> View All History
            </Link>
          )}
        </div>

        { loadingLinks ? <div  className='loading'> <p>loading...</p> </div>  :   links?.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon text-muted" style={{ marginBottom: 12 }}><IconEmpty size={40} /></div>
            <h3>No links created yet</h3>
            <p>Your recently generated links will show up here.</p>
          </div>
        ) : (
          <div className="history-grid">
            {links?.map((link) => (
              <Link key={link.id} to={`/link/${link.id}`} className="history-card">
                <div className="history-card-top">
                  <div>
                    <div className="history-card-name">{link.customerName || 'Customer'}</div>
                    <div className="history-card-desc">{link.description || 'No description'}</div>
                  </div>
                  <span className={statusTone(link.status)}>{statusLabel(link.status)}</span>
                </div>
                <div className="history-card-bottom">
                  <div className="history-amount">{formatAmount(link.currency, link.amount)}</div>
                  <div className="history-date">Created {formatDate(link.created_at)}</div> 
                  <div className="history-date">Updated {formatDate(link.updated_at)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Link Detail Page ───────────────────────────────────────────────────────

function DetailPage({ links, onUpdate }) {
  const { id } = useParams()
  const location = useLocation()
  const [data, setData] = useState(location.state?.api || null)
  const [loading, setLoading] = useState(!location.state?.link)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const savedLink = useMemo(() => links.find((l) => l.id === id), [links, id])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const json = await apiFetchLink(id)
        if (cancelled) return
        setData(json)
        onUpdate(id, {
          status: json.status || 'created',
          shortUrl: json.short_url || savedLink?.shortUrl || '',
          amount: json.amount || savedLink?.amount || 0,
          description: json.description || savedLink?.description || '',
          customerName: json.customer?.name || savedLink?.customerName || '',
          customerEmail: json.customer?.email || savedLink?.customerEmail || '',
          customerContact: json.customer?.contact || savedLink?.customerContact || '',
          notifyEmail: json.notify?.email || savedLink?.notifyEmail || false,
          notifySms: json.notify?.sms || savedLink?.notifySms || false,
          notifyWhatsapp: json.notify?.whatsapp || savedLink?.notifyWhatsapp || false,
        })
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (!location.state?.link) load()
    return () => { cancelled = true }
  }, [id]) // eslint-disable-line

  const link = data?.link || data?.data || data || savedLink || {}
  const currentStatus = link.status || link.state || savedLink?.status || 'created'
  const shortUrl = link.short_url || savedLink?.shortUrl || ''

  const customerEmailVal = link.customer?.email || savedLink?.customerEmail || ''
  const customerContactVal = link.customer?.contact || savedLink?.customerContact || ''
  
  const notifyObj = link.notify || {
    email: savedLink?.notifyEmail,
    sms: savedLink?.notifySms,
    whatsapp: savedLink?.notifyWhatsapp
  }
  const enabledNotifications = []
  if (notifyObj?.email) enabledNotifications.push('Email')
  if (notifyObj?.sms) enabledNotifications.push('SMS')
  if (notifyObj?.whatsapp) enabledNotifications.push('WhatsApp')
  const notificationsLabel = enabledNotifications.length > 0 ? enabledNotifications.join(', ') : 'None'

  async function handleCopy() {
    if (!shortUrl) return
    const ok = await copyToClipboard(shortUrl)
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <div className="container detail-layout fade-in">
      <div className="detail-header">
        <div>
          <div className="eyebrow">Payment Link</div>
          <h1>Link Details</h1>
          <p style={{ marginTop: 6 }}>Track your payment status and share the link with your customer.</p>
        </div>
        <span className={statusTone(currentStatus)}>{statusLabel(currentStatus)}</span>
      </div>

      {loading && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: '70%' }} />
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: 20 }}>
          <span className="alert-icon"><IconAlert size={16} /></span>
          <span>{error}</span>
        </div>
      )}

      <div className="detail-grid">
        {/* Summary card */}
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>Summary</h2>
          <table className="dl-table">
            <tbody>
              {[
                ['Link ID', link.id || id],
                ['Customer', link.customer?.name || savedLink?.customerName || '—'],
                ['Customer Email', customerEmailVal || '—'],
                ['Customer Phone', customerContactVal || '—'],
                ['Notifications Enabled', notificationsLabel],
                ['Amount', formatAmount(link.amount || savedLink?.amount)],
                ['Reference', link.reference_id || savedLink?.referenceId || '—'],
                ['Description', link.description || savedLink?.description || '—'],
                ['Created', formatDate(savedLink?.createdAt || link.created_at)],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions card */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <h2 style={{ marginBottom: 16 }}>Actions</h2>

            {shortUrl && (
              <div style={{ marginBottom: 16 }}>
                <div className="field-hint" style={{ marginBottom: 8 }}>Payment URL</div>
                <div className="copy-row">
                  <div className="copy-input">{shortUrl}</div>
                  <button className="btn btn-sm btn-secondary btn-icon" onClick={handleCopy} title="Copy URL">
                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                  </button>
                </div>
              </div>
            )}

            <div className="actions-stack">
              {shortUrl && (
                <a className="btn btn-primary" href={shortUrl} target="_blank" rel="noreferrer">
                  <IconLink size={14} style={{ marginRight: 6 }} /> Open Payment Link
                </a>
              )}
              <Link to="/" className="btn btn-secondary">
                <IconPlus size={14} style={{ marginRight: 6 }} /> Create Another
              </Link>
              <Link to="/links" className="btn btn-ghost">← Back to History</Link>
            </div>

            <div className="status-tip">
              <strong><IconInfo size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} /> Status Tip:</strong> Status refreshes from Razorpay each time you visit this page.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Thank You Page ────────────────────────────────────────────────────────

function ThankYouPage() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const paymentId = searchParams.get('razorpay_payment_id') || searchParams.get('payment_id') || ''
  const linkId = searchParams.get('razorpay_payment_link_id') || searchParams.get('payment_link_id') || ''
  const status = searchParams.get('razorpay_payment_link_status') || searchParams.get('status') || 'successful'

  return (
    <div className="container thank-you-layout fade-in">
      <section className="thank-you-hero card">
        <div className="thank-you-badge">
          <IconCheck size={18} />
          Payment Completed
        </div>

        <div className="thank-you-mark">
          <IconCheck size={42} />
        </div>

        <div className="thank-you-copy">
          <div className="eyebrow">Razorpay Payment Link</div>
          <h1>Thank you for your payment</h1>
          <p>
            Your payment has been received successfully. We kept the same dashboard theme so the
            return experience stays consistent with the rest of the app.
          </p>
        </div>

        <div className="thank-you-meta">
          <div className="meta-card">
            <span className="meta-label">Status</span>
            <span className="meta-value">{status}</span>
          </div>
          <div className="meta-card">
            <span className="meta-label">Payment ID</span>
            <span className="meta-value">{paymentId || 'Not provided'}</span>
          </div>
          <div className="meta-card">
            <span className="meta-label">Link ID</span>
            <span className="meta-value">{linkId || 'Not provided'}</span>
          </div>
        </div>

        <div className="thank-you-actions">
          <Link to="/" className="btn btn-primary">
            <IconHome size={14} style={{ marginRight: 6 }} /> Back to Dashboard
          </Link>
          <Link to="/create" className="btn btn-secondary">
            <IconPlus size={14} style={{ marginRight: 6 }} /> Create Another Link
          </Link>
        </div>
      </section>
    </div>
  )
}

// ── History / Links List Page ──────────────────────────────────────────────

// function HistoryPage({ links }) {
//   return (
//     <div className="container history-layout fade-in">
//       <div className="section-head">
//         <div>
//           <div className="eyebrow">All Links</div>
//           <h1>Payment History</h1>
//         </div>
//         <Link to="/" className="btn btn-primary">
//           <IconPlus size={14} style={{ marginRight: 6 }} /> New Link
//         </Link>
//       </div>

//       {links.length === 0 ? (
//         <div className="card empty-state">
//           <div className="empty-icon text-muted" style={{ marginBottom: 12 }}><IconEmpty size={40} /></div>
//           <h3>No links yet</h3>
//           <p>Create your first payment link and it will appear here instantly.</p>
//           <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
//             <IconPlus size={14} style={{ marginRight: 6 }} /> Create your first link
//           </Link>
//         </div>
//       ) : (
//         <div className="history-grid">
//           {links.map((link) => (

//             <Link key={link.id} to={`/link/${link.id}`} className="history-card">
//               <div className="history-card-top">
//                 <div>
                 
//                   <div className="history-card-name">{link.customerName || 'Customer'}</div>
//                   <div className="history-card-desc">{link.description || 'No description'}</div>
//                 </div>
//                 <span className={statusTone(link.status)}>{statusLabel(link.status)}</span>
//               </div>
//               <div className="history-card-bottom">
//                 <div className="history-amount">{formatAmount(link.amount)}</div>
//                 <div className="history-date">{formatDate(link.created_at)}</div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// ── App Root ───────────────────────────────────────────────────────────────

function useLinksState() {
  const [links, setLinks] = useState([])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const raw = await loadLinks()
        if (cancelled) return
        const normalized = Array.isArray(raw)
          ? raw
          : raw?.payment_links || raw?.items || []
        setLinks(normalized)
      } catch {
        if (!cancelled) setLinks([])
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = useCallback((record) => {
    setLinks((prev) => [record, ...prev.filter((link) => link.id !== record.id)])
  }, [])

  const handleUpdate = useCallback((id, patch) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...patch } : link))
    )
  }, [])

  return { links, handleSave, handleUpdate }
}

// make a than you page for callback_url




function AppRoutes() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAuthToken()))
  const { links, handleSave, handleUpdate } = useLinksState()
  return (
    <Shell
      linksCount={links.length}
      authenticated={authenticated}
      onAuthenticated={() => setAuthenticated(true)}
        onLogout={() => setAuthenticated(false)}
    >
      <Routes>
        <Route path="/" element={<HomePage onSave={handleSave} />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/link/:id" element={<DetailPage links={links} onUpdate={handleUpdate} />} />
        {/* <Route path="/links"    element={<HistoryPage />} /> */}
        {/* Redirect /create to home page where form is displayed */}
        <Route path="/create" element={<Navigate to="/" replace />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  )
}


export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
