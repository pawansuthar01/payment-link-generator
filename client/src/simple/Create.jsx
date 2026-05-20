import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'razorpay_links'

function saveLocal(record) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const items = raw ? JSON.parse(raw) : []
    localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...items]))
  } catch (err) {
    console.error('LocalStorage write error:', err)
  }
}

export default function Create() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    const paise = Math.round(Number(amount) * 100)
    if (!name || !paise) return setError('Enter name and amount')
    setLoading(true)
    try {
      const res = await fetch('/api/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: paise, currency: 'INR', customer: { name }, description: desc })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || JSON.stringify(data))
      const id = data.id || data.data?.id
      const record = { id, customerName: name, amount: paise, description: desc, createdAt: new Date().toISOString(), status: data.status || 'created', shortUrl: data.short_url || data.data?.short_url }
      saveLocal(record)
      navigate(`/link/${id}`)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth:520,margin:'36px auto',padding:20}}>
      <h1 style={{marginBottom:8}}>Create payment link</h1>
      <form onSubmit={submit} style={{display:'grid',gap:10}}>
        <input placeholder="Customer name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Amount (INR)" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
        <input placeholder="Description (optional)" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <div style={{display:'flex',gap:8}}>
          <button disabled={loading} style={{padding:'10px 14px'}}> {loading ? 'Creating…' : 'Create link'}</button>
        </div>
      </form>
    </div>
  )
}
