'use client'

import { useRouter } from 'next/navigation'

type Evento = {
  id: string
  titulo: string
}

type Props = {
  eventos: Evento[]
  eventoActual: string
}

export default function FiltroEntradas({ eventos, eventoActual }: Props) {
  const router = useRouter()

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => router.push('/admin/entradas')}
        className={`text-[10px] font-mono tracking-widest uppercase px-4 py-2 border transition-colors ${
          eventoActual === 'todos'
            ? 'border-[#FF5C00] text-[#FF5C00]'
            : 'border-[#1a1a1a] text-[#555] hover:border-[#FF5C00] hover:text-[#F0EAD6]'
        }`}
      >
        Todos
      </button>
      {eventos.map(({ id, titulo }) => (
        <button
          key={id}
          onClick={() => router.push(`/admin/entradas?evento=${id}`)}
          className={`text-[10px] font-mono tracking-widest uppercase px-4 py-2 border transition-colors ${
            eventoActual === id
              ? 'border-[#FF5C00] text-[#FF5C00]'
              : 'border-[#1a1a1a] text-[#555] hover:border-[#FF5C00] hover:text-[#F0EAD6]'
          }`}
        >
          {titulo}
        </button>
      ))}
    </div>
  )
}
