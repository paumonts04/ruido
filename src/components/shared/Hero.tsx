'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type StickerDef = {
  id: number
  content: React.ReactNode
  initialX: number
  initialY: number
  rotation: number
  onClick?: () => void
}

type Pos = { x: number; y: number }

type ExtraSticker = {
  id: number
  x: number
  y: number
  rotation: number
  emoji: string
}

export default function Hero() {
  const router = useRouter()
  const [positions, setPositions] = useState<Record<number, Pos>>(
    { 1: { x: 0, y: 0 }, 2: { x: 0, y: 0 }, 3: { x: 0, y: 0 }, 4: { x: 0, y: 0 } }
  )
  const positionsRef = useRef<Record<number, Pos>>(
    { 1: { x: 0, y: 0 }, 2: { x: 0, y: 0 }, 3: { x: 0, y: 0 }, 4: { x: 0, y: 0 } }
  )
  positionsRef.current = positions

  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [extras, setExtras] = useState<ExtraSticker[]>([])
  const dragRef = useRef<{
    id: number
    startMouseX: number
    startMouseY: number
    startPosX: number
    startPosY: number
    moved: boolean
  } | null>(null)
  const stickersRef = useRef<StickerDef[]>([])
  const containerRef = useRef<HTMLElement>(null)
  const stickerEls = useRef<Record<number, HTMLDivElement | null>>({})

  const launchEasterEgg = () => {
    const emojis = ['⚡', '🔥', '✕', '◆', '▲', '●', '★']
    const nuevos: ExtraSticker[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 5,
      y: Math.random() * 60 + 10,
      rotation: Math.random() * 40 - 20,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
    setExtras(prev => [...prev, ...nuevos])
    setTimeout(() => setExtras([]), 3000)
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
      onClick: () => router.push('/eventos'),
    },
    {
      id: 2,
      content: (
        <div style={{ background: '#FF5C00', color: '#F0EAD6', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, padding: '8px 18px', letterSpacing: '0.15em', border: '2px solid #F0EAD6', transform: 'skewX(-4deg)', whiteSpace: 'nowrap' }}>
          PRÓXIMO
        </div>
      ),
      initialX: 70, initialY: 28, rotation: 10,
      onClick: () => router.push('/eventos'),
    },
    {
      id: 3,
      content: (
        <div style={{ background: '#080808', color: '#FFE500', fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '10px 12px', border: '1px solid #FFE500', textTransform: 'uppercase', lineHeight: 1.7, letterSpacing: '0.05em' }}>
          JUN 14<br />SÁBADO<br />23:00H
        </div>
      ),
      initialX: 18, initialY: 16, rotation: 4,
      onClick: () => router.push('/eventos'),
    },
    {
      id: 4,
      content: (
        <div style={{ background: '#F0EAD6', color: '#080808', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #080808', fontSize: 28, fontWeight: 700, boxShadow: '3px 3px 0 #FF5C00' }}>
          ✕
        </div>
      ),
      initialX: 85, initialY: 35, rotation: -5,
      onClick: launchEasterEgg,
    },
  ]

  stickersRef.current = STICKERS

  const getClampedPos = useCallback((id: number, x: number, y: number): Pos => {
    const container = containerRef.current
    const el = stickerEls.current[id]
    if (!container || !el) return { x, y }
    const cr = container.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    const cur = positionsRef.current[id]
    const baseLeft = er.left - cur.x
    const baseTop = er.top - cur.y
    return {
      x: Math.max(cr.left - baseLeft, Math.min(cr.right - baseLeft - er.width, x)),
      y: Math.max(cr.top - baseTop, Math.min(cr.bottom - baseTop - er.height, y)),
    }
  }, [])

  useEffect(() => {
    const clampAll = () => {
      setPositions(prev => {
        const next = { ...prev }
        for (const id of [1, 2, 3, 4]) {
          next[id] = getClampedPos(id, prev[id].x, prev[id].y)
        }
        return next
      })
    }
    const raf = requestAnimationFrame(clampAll)
    window.addEventListener('resize', clampAll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', clampAll)
    }
  }, [getClampedPos])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      const { id, startMouseX, startMouseY, startPosX, startPosY } = dragRef.current
      const dx = e.clientX - startMouseX
      const dy = e.clientY - startMouseY
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
      setPositions(prev => ({ ...prev, [id]: getClampedPos(id, startPosX + dx, startPosY + dy) }))
    }

    const onUp = () => {
      if (dragRef.current) {
        const { id, moved } = dragRef.current
        if (!moved) {
          const sticker = stickersRef.current.find(s => s.id === id)
          if (sticker?.onClick) sticker.onClick()
        }
      }
      dragRef.current = null
      setDraggingId(null)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const { id, startMouseX, startMouseY, startPosX, startPosY } = dragRef.current
      const dx = touch.clientX - startMouseX
      const dy = touch.clientY - startMouseY
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
      setPositions(prev => ({ ...prev, [id]: getClampedPos(id, startPosX + dx, startPosY + dy) }))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseleave', onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseleave', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  const onMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragRef.current) return
    dragRef.current = {
      id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: positionsRef.current[id].x,
      startPosY: positionsRef.current[id].y,
      moved: false,
    }
    setDraggingId(id)
  }

  const onTouchStart = (e: React.TouchEvent, id: number) => {
    e.stopPropagation()
    if (dragRef.current) return
    const touch = e.touches[0]
    dragRef.current = {
      id,
      startMouseX: touch.clientX,
      startMouseY: touch.clientY,
      startPosX: positionsRef.current[id].x,
      startPosY: positionsRef.current[id].y,
      moved: false,
    }
    setDraggingId(id)
  }

  return (
    <section ref={containerRef} style={{ position: 'relative', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', padding: '96px 48px 64px' }}>

      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {extras.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `rotate(${s.rotation}deg)`,
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: ['#FF5C00', '#FFE500', '#F0EAD6'][Math.floor(Math.random() * 3)],
            pointerEvents: 'none',
            animation: 'fadeInOut 3s ease forwards',
            zIndex: 5,
          }}
        >
          {s.emoji}
        </div>
      ))}

      {STICKERS.map(s => {
        const pos = positions[s.id]
        const isDragging = draggingId === s.id
        return (
          <div
            key={s.id}
            ref={el => { stickerEls.current[s.id] = el }}
            draggable={false}
            onMouseDown={e => onMouseDown(e, s.id)}
            onTouchStart={e => onTouchStart(e, s.id)}
            onDragStart={e => e.preventDefault()}
            style={{
              position: 'absolute',
              left: `${s.initialX}%`,
              top: `${s.initialY}%`,
              transform: `translate(${pos.x}px, ${pos.y}px) rotate(${s.rotation}deg) scale(${isDragging ? 1.08 : 1})`,
              transition: isDragging ? 'none' : 'transform 0.2s',
              cursor: isDragging ? 'grabbing' : 'pointer',
              zIndex: isDragging ? 50 : 10,
              userSelect: 'none',
            }}
          >
            {s.content}
          </div>
        )
      })}

      <div style={{ position: 'relative', zIndex: 20, pointerEvents: 'none' }}>
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
          Agencia de eventos · Barcelona · Est. 2026
        </p>

        <div style={{ marginTop: 32, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/eventos" style={{
            background: '#FF5C00', color: '#080808', fontFamily: 'monospace',
            fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '12px 24px', textDecoration: 'none', pointerEvents: 'auto',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FFE500')}
            onMouseLeave={e => (e.currentTarget.style.background = '#FF5C00')}
          >
            Ver eventos →
          </Link>
          <Link href="/galeria" style={{
            border: '1px solid #333', color: '#888', fontFamily: 'monospace',
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '12px 24px', textDecoration: 'none', pointerEvents: 'auto',
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