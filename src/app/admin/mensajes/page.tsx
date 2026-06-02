import { createClient } from '@/lib/supabase/server'
import MensajeItem from '@/components/admin/MensajeItem'
import FiltroMensajes from '@/components/admin/FiltroMensajes'

type Props = {
  searchParams: Promise<{ filtro?: string }>
}

export default async function AdminMensajesPage({ searchParams }: Props) {
  const { filtro } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('mensajes_contacto')
    .select('*')
    .order('created_at', { ascending: false })

  if (filtro === 'leidos') query = query.eq('leido', true)
  if (filtro === 'no-leidos') query = query.eq('leido', false)

  const { data: mensajes } = await query

  const { count: noLeidos } = await supabase
    .from('mensajes_contacto')
    .select('*', { count: 'exact', head: true })
    .eq('leido', false)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F0EAD6] tracking-widest">
          MENSAJES
        </h1>
        {(noLeidos ?? 0) > 0 && (
          <span className="text-[10px] font-mono tracking-widest text-[#080808] bg-[#FF5C00] px-3 py-1">
            {noLeidos} sin leer
          </span>
        )}
      </div>

      <FiltroMensajes filtroActual={filtro ?? 'todos'} />

      <div className="flex flex-col gap-2 mt-6">
        {!mensajes || mensajes.length === 0 ? (
          <p className="text-[#444] font-mono text-xs tracking-widest">No hay mensajes.</p>
        ) : (
          mensajes.map(mensaje => (
            <MensajeItem key={mensaje.id} mensaje={mensaje} />
          ))
        )}
      </div>
    </div>
  )
}