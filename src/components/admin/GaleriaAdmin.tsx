'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

type Foto = {
  id: string
  url: string
  descripcion: string | null
  orden: number | null
  evento_id: string | null
  eventos?: { titulo: string } | null
}

type Evento = {
  id: string
  titulo: string
}

type Props = {
  fotos: Foto[]
  eventos: Evento[]
}

export default function GaleriaAdmin({ fotos: fotosIniciales, eventos }: Props) {
  const [fotos, setFotos] = useState<Foto[]>(fotosIniciales)
  const [uploading, setUploading] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('nombre', nombre)

      const uploadRes = await fetch('/api/admin/galeria/upload', {
        method: 'POST',
        body: uploadForm,
      })

      if (!uploadRes.ok) { setError('Error al subir imagen'); continue }

      const { url } = await uploadRes.json()

      const insertRes = await fetch('/api/admin/galeria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          descripcion: descripcion || null,
          evento_id: eventoSeleccionado || null,
          orden: fotos.length,
        }),
      })

      if (!insertRes.ok) { setError('Error al guardar en base de datos'); continue }

      const { data: nuevaFoto } = await insertRes.json()
      if (nuevaFoto) setFotos(f => [...f, nuevaFoto as Foto])
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleEliminar = async (id: string, url: string) => {
    const nombre = url.split('/').pop()!

    await fetch('/api/admin/galeria', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nombre }),
    })

    setFotos(f => f.filter(foto => foto.id !== id))
  }

  const inputClass = "bg-[#080808] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"

  return (
    <div>
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-6 mb-8">
        <div className="text-[9px] text-[#555] font-mono tracking-widest uppercase mb-4">
          Subir fotos
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <select
              value={eventoSeleccionado}
              onChange={e => setEventoSeleccionado(e.target.value)}
              className={`${inputClass} w-full`}
            >
              <option value="">Sin evento asociado</option>
              {eventos.map(evento => (
                <option key={evento.id} value={evento.id}>{evento.titulo}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className={`${inputClass} w-full`}
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="foto-upload"
            />
            <label
              htmlFor="foto-upload"
              className={`cursor-pointer font-mono font-bold text-xs tracking-widest uppercase py-3 px-6 transition-colors ${uploading ? 'bg-[#333] text-[#555] cursor-not-allowed' : 'bg-[#FF5C00] text-[#080808] hover:bg-[#FFE500]'}`}
            >
              {uploading ? 'Subiendo...' : 'Seleccionar fotos →'}
            </label>
            <span className="text-[10px] text-[#444] font-mono tracking-widest">
              Puedes seleccionar varias a la vez
            </span>
          </div>
        </div>

        {error && <p className="text-[11px] text-[#FF5C00] font-mono tracking-wide">{error}</p>}
      </div>

      {fotos.length === 0 ? (
        <p className="text-[#444] font-mono text-xs tracking-widest">No hay fotos todavía.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {fotos.map(foto => (
            <div key={foto.id} className="group relative aspect-square overflow-hidden border border-[#1a1a1a]">
              <Image
                src={foto.url}
                alt={foto.descripcion ?? ''}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#080808]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                {foto.eventos && (
                  <span className="text-[9px] text-[#FF5C00] font-mono tracking-widest uppercase">
                    {(foto.eventos as any).titulo}
                  </span>
                )}
                <button
                  onClick={() => handleEliminar(foto.id, foto.url)}
                  className="text-[10px] font-mono tracking-widest uppercase text-[#F0EAD6] border border-[#F0EAD6] px-3 py-1 hover:border-[#FF5C00] hover:text-[#FF5C00] transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}