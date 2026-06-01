'use client'

import { useState } from 'react'

type Props = {
  eventoId: string
  eventoTitulo: string
  precio: number
  agotado: boolean
  aforoDisponible: number
}

export default function ComprarEntrada({ eventoId, precio, agotado, aforoDisponible }: Props) {
  const [cantidad, setCantidad] = useState(1)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = precio * cantidad

  const handleCompra = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email) { setError('Rellena todos los campos'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId, nombre, email, cantidad }),
      })

      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Error al procesar'); setLoading(false); return }

      window.location.href = data.url
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  if (agotado) {
    return (
      <div className="inline-block border border-[#FF5C00] px-6 py-5">
        <div className="font-[family-name:var(--font-display)] text-2xl text-[#FF5C00] tracking-widest">
          AGOTADO
        </div>
        <div className="text-[10px] text-[#555] font-mono mt-2 tracking-widest">
          No quedan entradas disponibles
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleCompra} className="max-w-lg">
      <div className="font-[family-name:var(--font-display)] text-3xl text-[#F0EAD6] tracking-widest mb-6">
        COMPRAR ENTRADA
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"
        />

        <div className="flex items-center gap-4 mt-2">
          <span className="text-[10px] tracking-widest text-[#555] font-mono uppercase">Cantidad</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCantidad(c => Math.max(1, c - 1))}
              className="bg-[#1a1a1a] text-[#F0EAD6] w-8 h-8 font-mono text-lg hover:bg-[#FF5C00] hover:text-[#080808] transition-colors"
            >−</button>
            <span className="font-[family-name:var(--font-display)] text-2xl text-[#F0EAD6] min-w-6 text-center">
              {cantidad}
            </span>
            <button
              type="button"
              onClick={() => setCantidad(c => Math.min(aforoDisponible, c + 1))}
              className="bg-[#1a1a1a] text-[#F0EAD6] w-8 h-8 font-mono text-lg hover:bg-[#FF5C00] hover:text-[#080808] transition-colors"
            >+</button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-[11px] text-[#FF5C00] font-mono mb-4 tracking-wide">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">Total</span>
        <span className="font-[family-name:var(--font-display)] text-4xl text-[#FFE500] tracking-widest">
          {precio === 0 ? 'GRATIS' : `${total}€`}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF5C00] disabled:bg-[#333] text-[#080808] font-mono font-bold text-xs tracking-widest uppercase py-4 px-6 hover:bg-[#FFE500] disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Redirigiendo a Stripe...' : `Comprar ${cantidad > 1 ? `${cantidad} entradas` : 'entrada'} →`}
      </button>
    </form>
  )
}