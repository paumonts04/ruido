'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type EventoFormData = {
  titulo: string
  slug: string
  descripcion: string
  fecha: string
  lugar: string
  aforo: string
  precio: string
  publicado: boolean
}

type Props = {
  inicial?: Partial<EventoFormData> & {
    id?: string
    descripcion?: string | null
    imagen_url?: string | null
    stripe_price_id?: string | null
    created_at?: string | null
  }
  modo: 'crear' | 'editar'
}

export default function EventoForm({ inicial, modo }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<EventoFormData>({
    titulo: inicial?.titulo ?? '',
    slug: inicial?.slug ?? '',
    descripcion: inicial?.descripcion ?? '',
    fecha: inicial?.fecha ? new Date(inicial.fecha).toISOString().slice(0, 16) : '',
    lugar: inicial?.lugar ?? '',
    aforo: inicial?.aforo != null ? String(inicial.aforo) : '100',
    precio: inicial?.precio != null ? String(inicial.precio) : '0',
    publicado: inicial?.publicado ?? false,
  })

  const generarSlug = (titulo: string) =>
    titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleTitulo = (v: string) => {
    setForm(f => ({ ...f, titulo: v, slug: generarSlug(v) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo || !form.slug || !form.fecha || !form.lugar) {
      setError('Rellena los campos obligatorios')
      return
    }
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      aforo: Number(form.aforo),
      precio: Number(form.precio),
      ...(modo === 'editar' && { id: inicial!.id }),
    }

    const res = await fetch('/api/admin/eventos', {
      method: modo === 'crear' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Error al guardar')
      setLoading(false)
      return
    }

    router.push('/admin/eventos')
    router.refresh()
  }

  const inputClass = "w-full bg-[#080808] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-[#555] font-mono tracking-widest uppercase">Título *</label>
          <input type="text" value={form.titulo} onChange={e => handleTitulo(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-[#555] font-mono tracking-widest uppercase">Slug *</label>
          <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[9px] text-[#555] font-mono tracking-widest uppercase">Descripción</label>
        <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3} className={`${inputClass} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-[#555] font-mono tracking-widest uppercase">Fecha *</label>
          <input type="datetime-local" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-[#555] font-mono tracking-widest uppercase">Lugar *</label>
          <input type="text" value={form.lugar} onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-[#555] font-mono tracking-widest uppercase">Aforo</label>
          <input type="number" value={form.aforo} onChange={e => setForm(f => ({ ...f, aforo: e.target.value }))} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-[#555] font-mono tracking-widest uppercase">Precio (€)</label>
          <input type="number" step="0.01" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} className={inputClass} />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.publicado}
          onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))}
          className="w-4 h-4 accent-[#FF5C00]"
        />
        <span className="text-[10px] text-[#555] font-mono tracking-widest uppercase">Publicado</span>
      </label>

      {error && <p className="text-[11px] text-[#FF5C00] font-mono tracking-wide">{error}</p>}

      <div className="flex gap-4 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF5C00] disabled:bg-[#333] text-[#080808] font-mono font-bold text-xs tracking-widest uppercase py-3 px-6 hover:bg-[#FFE500] disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Guardando...' : modo === 'crear' ? 'Crear evento →' : 'Guardar cambios →'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/eventos')}
          className="border border-[#1a1a1a] text-[#555] font-mono text-xs tracking-widest uppercase py-3 px-6 hover:border-[#FF5C00] hover:text-[#F0EAD6] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}