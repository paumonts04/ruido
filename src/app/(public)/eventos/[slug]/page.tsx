import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ComprarEntrada from '@/components/eventos/ComprarEntrada'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function EventoPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: evento } = await supabase
    .from('eventos')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  if (!evento) notFound()

  const { data: vendidas } = await supabase
    .from('entradas')
    .select('cantidad')
    .eq('evento_id', evento.id)
    .eq('estado', 'completada')

  const totalVendidas = vendidas?.reduce((acc, e) => acc + e.cantidad, 0) ?? 0
  const aforoDisponible = evento.aforo - totalVendidas
  const agotado = aforoDisponible <= 0

  const infoItems = [
    { label: 'Lugar', value: evento.lugar },
    { label: 'Aforo total', value: `${evento.aforo} personas` },
    { label: 'Disponibles', value: agotado ? 'AGOTADO' : `${aforoDisponible} entradas` },
    { label: 'Precio', value: evento.precio === 0 ? 'Gratuito' : `${evento.precio}€` },
  ]

  return (
    <div className="px-8 py-16 max-w-4xl mx-auto">

      <div className="text-[9px] tracking-[0.15em] text-[#FF5C00] uppercase font-mono mb-4">
        {new Date(evento.fecha).toLocaleDateString('es-ES', {
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        }).toUpperCase()}
        {' · '}
        {new Date(evento.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}H
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-[clamp(64px,12vw,140px)] leading-[0.85] text-[#F0EAD6] tracking-widest mb-8">
        {evento.titulo}
      </h1>

      <div className="h-px bg-[#1a1a1a] mb-8" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {infoItems.map(({ label, value }) => (
          <div key={label}>
            <div className="text-[9px] tracking-[0.12em] text-[#555] uppercase font-mono mb-1">
              {label}
            </div>
            <div className={`font-[family-name:var(--font-display)] text-xl tracking-wide ${label === 'Disponibles' && agotado ? 'text-[#FF5C00]' : 'text-[#F0EAD6]'}`}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {evento.descripcion && (
        <p className="text-sm text-[#888] font-mono leading-relaxed max-w-xl mb-12">
          {evento.descripcion}
        </p>
      )}

      <div className="h-px bg-[#1a1a1a] mb-10" />

      <ComprarEntrada
        eventoId={evento.id}
        eventoTitulo={evento.titulo}
        precio={evento.precio}
        agotado={agotado}
        aforoDisponible={aforoDisponible}
      />
    </div>
  )
}