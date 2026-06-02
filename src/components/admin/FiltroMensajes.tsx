'use client'

import { useRouter } from 'next/navigation'

type Props = {
  filtroActual: string
}

const filtros = [
  { value: 'todos', label: 'Todos' },
  { value: 'no-leidos', label: 'Sin leer' },
  { value: 'leidos', label: 'Leídos' },
]

export default function FiltroMensajes({ filtroActual }: Props) {
  const router = useRouter()

  return (
    <div className="flex gap-2">
      {filtros.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => router.push(`/admin/mensajes${value === 'todos' ? '' : `?filtro=${value}`}`)}
          className={`text-[10px] font-mono tracking-widest uppercase px-4 py-2 border transition-colors ${
            filtroActual === value || (value === 'todos' && filtroActual === 'todos')
              ? 'border-[#FF5C00] text-[#FF5C00]'
              : 'border-[#1a1a1a] text-[#555] hover:border-[#FF5C00] hover:text-[#F0EAD6]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}