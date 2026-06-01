import { createClient } from '@/lib/supabase/server'
import EventoCard from '@/components/eventos/EventoCard'

export const revalidate = 60

export default async function EventosPage() {
  const supabase = await createClient()

  const { data: eventos } = await supabase
    .from('eventos')
    .select('*')
    .eq('publicado', true)
    .order('fecha', { ascending: true })

  return (
    <div style={{ padding: '64px 48px' }}>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 8vw, 96px)',
          lineHeight: 0.9,
          color: '#F0EAD6',
          letterSpacing: '2px',
        }}>
          PRÓXIMOS<br />
          <span style={{ color: '#FF5C00' }}>EVENTOS</span>
        </h1>
      </div>

      {!eventos || eventos.length === 0 ? (
        <div style={{ color: '#444', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          No hay eventos publicados todavía.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {eventos.map(evento => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}
    </div>
  )
}