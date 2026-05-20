import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function Detail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.resolve().then(() => {
      if (mounted) setLoading(true)
    })
    fetch(`/api/link/${id}`).then((r)=>r.json()).then((json)=>{
      if (!mounted) return
      setData(json)
    }).catch((e)=>{ if (mounted) setError(String(e)) }).finally(()=>mounted && setLoading(false))
    return ()=>{ mounted=false }
  },[id])

  if (loading) return <div style={{maxWidth:640,margin:'36px auto',padding:20}}>Loading…</div>
  if (error) return <div style={{maxWidth:640,margin:'36px auto',padding:20,color:'crimson'}}>{error}</div>
  const link = data.link || data || {}
  return (
    <div style={{maxWidth:640,margin:'36px auto',padding:20}}>
      <h1>Link {id}</h1>
      <p><strong>Status:</strong> {link.status || link.state || 'unknown'}</p>
      <p><strong>Amount:</strong> {link.amount ? `₹${(link.amount/100).toFixed(2)}` : '—'}</p>
      <p><strong>Short URL:</strong> {link.short_url ? <a href={link.short_url} target="_blank">Open</a> : '—'}</p>
      <div style={{marginTop:16}}>
        <Link to="/create">Create another</Link>
      </div>
    </div>
  )
}
