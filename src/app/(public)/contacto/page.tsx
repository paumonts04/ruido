'use client'

import { useState } from 'react'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.mensaje) { setError('Rellena los campos obligatorios'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) { setError('Error al enviar'); setLoading(false); return }
      setEnviado(true)
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  if (enviado) {
    return (
      <div className="px-4 sm:px-8 py-16 sm:py-24 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 border-2 border-[#FFE500] flex items-center justify-center mx-auto mb-8">
          <span className="font-[family-name:var(--font-display)] text-3xl text-[#FFE500]">✓</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] leading-[0.9] text-[#F0EAD6] tracking-widest mb-4">
          MENSAJE<br /><span className="text-[#FFE500]">ENVIADO</span>
        </h1>
        <p className="text-sm text-[#888] font-mono leading-relaxed">
          Te hemos enviado un email de confirmación.<br />
          Te responderemos lo antes posible.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-8 py-10 md:py-16 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(48px,8vw,96px)] leading-[0.85] text-[#F0EAD6] tracking-widest mb-4">
          HABLEMOS
        </h1>
        <p className="text-xs text-[#555] font-mono tracking-widest uppercase">
          ¿Tienes un proyecto? Cuéntanoslo.
        </p>
      </div>

      <div className="h-px bg-[#1a1a1a] mb-10" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre *"
            value={form.nombre}
            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"
          />
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"
          />
        </div>

        <input
          type="text"
          placeholder="Asunto"
          value={form.asunto}
          onChange={e => setForm(f => ({ ...f, asunto: e.target.value }))}
          className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"
        />

        <textarea
          placeholder="Mensaje *"
          value={form.mensaje}
          onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
          rows={6}
          className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444] resize-none"
        />

        {error && (
          <p className="text-[11px] text-[#FF5C00] font-mono tracking-wide">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF5C00] disabled:bg-[#333] text-[#080808] font-mono font-bold text-xs tracking-widest uppercase py-4 px-6 hover:bg-[#FFE500] disabled:cursor-not-allowed transition-colors mt-2"
        >
          {loading ? 'Enviando...' : 'Enviar mensaje →'}
        </button>
      </form>
    </div>
  )
}