import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalEventos },
    { count: totalEntradas },
    { count: totalMensajes },
    { data: proximosEventos },
  ] = await Promise.all([
    supabase.from('eventos').select('*', { count: 'exact', head: true }),
    supabase.from('entradas').select('*', { count: 'exact', head: true }).eq('estado', 'completada'),
    supabase.from('mensajes_contacto').select('*', { count: 'exact', head: true }).eq('leido', false),
    supabase.from('eventos').select('titulo, fecha, aforo').eq('publicado', true).order('fecha', { ascending: true }).limit(3),
  ])

  const stats = [
    { label: 'Eventos activos', value: totalEventos ?? 0 },
    { label: 'Entradas vendidas', value: totalEntradas ?? 0 },
    { label: 'Mensajes sin leer', value: totalMensajes ?? 0 },
  ]

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F0EAD6] tracking-widest mb-8">
        DASHBOARD
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-[#0f0f0f] border border-[#1a1a1a] p-6">
            <div className="text-[9px] tracking-widest text-[#555] font-mono uppercase mb-3">
              {label}
            </div>
            <div className="font-[family-name:var(--font-display)] text-5xl text-[#F0EAD6] tracking-widest">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#1a1a1a] mb-8" />

      <h2 className="font-[family-name:var(--font-display)] text-xl text-[#F0EAD6] tracking-widest mb-4">
        PRÓXIMOS EVENTOS
      </h2>

      <div className="flex flex-col gap-2">
        {proximosEventos?.map(evento => (
          <div key={evento.titulo} className="flex items-center justify-between bg-[#0f0f0f] border border-[#1a1a1a] px-4 py-3">
            <span className="font-[family-name:var(--font-display)] text-lg text-[#F0EAD6] tracking-widest">
              {evento.titulo}
            </span>
            <span className="text-[10px] text-[#555] font-mono tracking-widest">
              {new Date(evento.fecha).toLocaleDateString('es-ES')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}