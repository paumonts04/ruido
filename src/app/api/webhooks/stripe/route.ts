import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { evento_id, nombre, email, cantidad } = session.metadata!

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    await supabase.from('entradas').insert({
      evento_id,
      nombre,
      email,
      cantidad: parseInt(cantidad),
      stripe_session_id: session.id,
      estado: 'completada',
    })

    const { data: evento } = await supabase
      .from('eventos')
      .select('titulo, fecha, lugar')
      .eq('id', evento_id)
      .single()

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: `Tu entrada para ${evento?.titulo ?? 'el evento'} — Ruido`,
      html: `
        <div style="background:#080808;color:#F0EAD6;font-family:monospace;padding:40px;max-width:600px;">
          <h1 style="font-size:32px;letter-spacing:4px;color:#FF5C00;margin-bottom:8px;">RUIDO</h1>
          <p style="color:#555;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;">Agencia de eventos · Barcelona</p>
          <h2 style="font-size:20px;color:#F0EAD6;margin-bottom:16px;">¡Tu entrada está confirmada!</h2>
          <p style="color:#888;font-size:13px;line-height:1.8;margin-bottom:24px;">
            Hola ${nombre}, tu compra se ha procesado correctamente.
          </p>
          <div style="border:1px solid #1a1a1a;padding:20px;margin-bottom:32px;">
            <p style="color:#555;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">Detalles</p>
            <p style="color:#FF5C00;font-size:24px;font-family:monospace;letter-spacing:2px;margin-bottom:8px;">${evento?.titulo ?? ''}</p>
            <p style="color:#F0EAD6;font-size:13px;margin-bottom:4px;">${evento ? new Date(evento.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : ''}</p>
            <p style="color:#888;font-size:13px;margin-bottom:4px;">${evento?.lugar ?? ''}</p>
            <p style="color:#888;font-size:13px;">Entradas: ${cantidad}</p>
          </div>
          <p style="color:#444;font-size:10px;">Ref: ${session.id}</p>
          <p style="color:#444;font-size:10px;margin-top:8px;">© 2024 Ruido Events · Barcelona</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ received: true })
}