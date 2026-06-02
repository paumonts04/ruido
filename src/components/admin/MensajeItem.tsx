'use client'

import { useState } from 'react'

type Props = {
  mensaje: {
    id: string
    nombre: string
    email: string
    asunto: string | null
    mensaje: string
    leido: boolean
    created_at: string | null
  }
}

export default function MensajeItem({ mensaje }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [leido, setLeido] = useState(mensaje.leido)

  const marcarLeido = async () => {
    await fetch('/api/admin/mensajes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: mensaje.id, leido: true }),
    })
    setLeido(true)
  }

  return (
    <div className={`border transition-colors ${leido ? 'border-[#1a1a1a]' : 'border-[#FF5C00]'} bg-[#0f0f0f]`}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => { setAbierto(a => !a); if (!leido) marcarLeido() }}
      >
        <div className="flex items-center gap-6">
          <div className={`w-2 h-2 rounded-full ${leido ? 'bg-[#333]' : 'bg-[#FF5C00]'}`} />
          <span className="font-[family-name:var(--font-display)] text-lg text-[#F0EAD6] tracking-widest">
            {mensaje.nombre}
          </span>
          <span className="text-[10px] text-[#555] font-mono tracking-widest">
            {mensaje.email}
          </span>
          {mensaje.asunto && (
            <span className="text-[10px] text-[#888] font-mono tracking-widest">
              {mensaje.asunto}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[#555] font-mono tracking-widest">
            {new Date(mensaje.created_at!).toLocaleDateString('es-ES')}
          </span>
          <span className="text-[10px] text-[#555] font-mono tracking-widest">
            {abierto ? '↑' : '↓'}
          </span>
        </div>
      </div>

      {abierto && (
        <div className="px-4 pb-4 border-t border-[#1a1a1a]">
          <p className="text-sm text-[#888] font-mono leading-relaxed mt-4">
            {mensaje.mensaje}
          </p>
        </div>
      )}
    </div>
  )
}