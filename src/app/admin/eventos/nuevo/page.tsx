import EventoForm from '@/components/admin/EventoForm'

export default function NuevoEventoPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F0EAD6] tracking-widest mb-8">
        NUEVO EVENTO
      </h1>
      <EventoForm modo="crear" />
    </div>
  )
}