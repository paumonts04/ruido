'use client'

import Link from 'next/link'

type Props = {
  evento: {
    id: string
    slug: string
    titulo: string
    fecha: string
    lugar: string
    aforo: number
    precio: number
  }
}

export default function EventoCard({ evento }: Props) {
  return (
    <Link href={`/eventos/${evento.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#0f0f0f',
          border: '1px solid #1a1a1a',
          padding: 24,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF5C00')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
      >
        <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#FF5C00', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>
          {new Date(evento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '1px', color: '#F0EAD6', lineHeight: 1, marginBottom: 12 }}>
          {evento.titulo}
        </div>
        <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace', lineHeight: 1.8 }}>
          {evento.lugar}<br />
          Aforo: {evento.aforo}
        </div>
        <div style={{ position: 'absolute', bottom: 20, right: 20, fontFamily: 'var(--font-display)', fontSize: 22, color: '#FFE500' }}>
          {evento.precio === 0 ? 'FREE' : `${evento.precio}€`}
        </div>
      </div>
    </Link>
  )
}