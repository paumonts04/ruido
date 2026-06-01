'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type StickerDef = {
  id: number
  content: React.ReactNode
  initialX: number
  initialY: number
  rotation: number
}

const STICKERS: StickerDef[] = [
  {
    id: 1,
    content: (
      <div style={{ background: '#FFE500', color: '#080808', fontFamily: 'monospace', fontSize: 10, fontWeight: 700, padding: '6px 14px', textTransform: 'uppercase', letterSpacing: '0.1em', border: '2px solid #080808', boxShadow: '3px 3px 0 #080808', whiteSpace: 'nowrap' }}>
        ⚡ Sold out · Sala Apolo
      </div>
    ),
    initialX: 62, initialY: 10, rotation: -8,
  },
  {
    id: 2,
    content: (
      <div style={{ background: '#FF5C00', color: '#F0EAD6', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, padding: '8px 18px', letterSpacing: '0.15em', border: '2px solid #F0EAD6', transform: 'skewX(-4deg)', whiteSpace: 'nowrap' }}>
        PRÓXIMO
      </div>
    ),
    initialX: 70, initialY: 28, rotation: 10,
  },
  {
    id: 3,
    content: (
      <div style={{ background: '#080808', color: '#FFE500', fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '10px 12px', border: '1px solid #FFE500', textTransform: 'uppercase', lineHeight: 1.7, letterSpacing: '0.05em' }}>
        JUN 14<br />SÁBADO<br />23:00H
      </div>
    ),
    initialX: 18, initialY: 16, rotation: 4,
  },
  {
    id: 4,
    content: (
      <div style={{ background: '#F0EAD6', color: '#080808', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #080808', fontSize: 28, fontWeight: 700, boxShadow: '3px 3px 0 #FF5C00' }}>
        ✕
      </div>
    ),
    initialX: 76, initialY: 60, rotation: -5,
  },
]

type Pos = { x: number; y: number }

export default function Hero() {
  const [positions, setPositions] = useState<Record<number, Pos>>(
    Object.fromEntries(STICKERS.map(s => [s.id, { x: 0, y: 0 }]))
  )
  const [draggingId, setDraggingId] = useState<number | null>(null)

  const dragRef = useRef<{
    id: number
    startMouseX: number
    startMouseY: number
    startPosX: number
    startPosY: number
  } | null>(null)

    useEffect(() => {
    const onMove = (e: MouseEvent) => {
        if (!dragRef.current) return
        const { id, startMouseX, startMouseY, startPosX, startPosY } = dragRef.current
        setPositions(prev => ({
        ...prev,
        [id]: {
            x: startPosX + e.clientX - startMouseX,
            y: startPosY + e.clientY - startMouseY,
        },
        }))
    }

    const onUp = () => {
        if (!dragRef.current) return
        dragRef.current = null
        setDraggingId(null)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseleave', onUp)  // ← si el ratón sale de la ventana

    return () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
        window.removeEventListener('mouseleave', onUp)
    }
    }, [])

    const onMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()  // ← evita que el evento se propague
    if (dragRef.current) return  // ← si ya hay un drag activo, ignorar
    dragRef.current = {
        id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startPosX: positions[id].x,
        startPosY: positions[id].y,
    }
    setDraggingId(id)
    }

  return (
    <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', padding: '96px 48px 64px' }}>

      {/* Grid fondo */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* Stickers */}
      {STICKERS.map(s => {
        const pos = positions[s.id]
        const isDragging = draggingId === s.id
        return (
          <div
            key={s.id}
            draggable={false}
            onMouseDown={e => onMouseDown(e, s.id)}
            onDragStart={e => e.preventDefault()}
            style={{
              position: 'absolute',
              left: `${s.initialX}%`,
              top: `${s.initialY}%`,
              transform: `translate(${pos.x}px, ${pos.y}px) rotate(${s.rotation}deg) scale(${isDragging ? 1.08 : 1})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: isDragging ? 50 : 25,
              userSelect: 'none',
            }}
          >
            {s.content}
          </div>
        )
      })}

      {/* Título */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(80px, 16vw, 180px)',
          lineHeight: 0.85,
          color: '#F0EAD6',
          letterSpacing: '2px',
          userSelect: 'none',
        }}>
          HAZ<br />
          <span style={{ color: '#FF5C00' }}>RUIDO</span>
        </h1>

        <p style={{ marginTop: 24, fontSize: 11, letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          Agencia de eventos · Barcelona · Est. 2024
        </p>

        <div style={{ marginTop: 32, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/eventos" style={{
            background: '#FF5C00', color: '#080808', fontFamily: 'monospace',
            fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '12px 24px', textDecoration: 'none', transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FFE500')}
            onMouseLeave={e => (e.currentTarget.style.background = '#FF5C00')}
          >
            Ver eventos →
          </Link>
          <Link href="/galeria" style={{
            border: '1px solid #333', color: '#888', fontFamily: 'monospace',
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '12px 24px', textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C00'; e.currentTarget.style.color = '#F0EAD6' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888' }}
          >
            Galería
          </Link>
        </div>
      </div>
    </section>
  )
}