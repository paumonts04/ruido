import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventoForm from '@/components/admin/EventoForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditarEventoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: evento } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', id)
    .single()

  if (!evento) notFound()

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F0EAD6] tracking-widest mb-8">
        EDITAR EVENTO
      </h1>
      <EventoForm modo="editar" inicial={evento as any} />
    </div>
  )
}