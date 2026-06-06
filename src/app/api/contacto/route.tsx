import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { contactoLimiter } from '@/lib/ratelimit'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await contactoLimiter.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Demasiadas peticiones, inténtalo más tarde' }, { status: 429 })
  }

  try {
    const { nombre, email, asunto, mensaje } = await req.json()

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase.from('mensajes_contacto').insert({
      nombre,
      email,
      asunto,
      mensaje,
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: `Hemos recibido tu mensaje — Ruido`,
      html: `
        <div style="background:#080808;color:#F0EAD6;font-family:monospace;padding:40px;max-width:600px;">
          <h1 style="font-size:32px;letter-spacing:4px;color:#FF5C00;margin-bottom:8px;">RUIDO</h1>
          <p style="color:#555;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;">Agencia de eventos · Barcelona</p>
          <h2 style="font-size:20px;color:#F0EAD6;margin-bottom:16px;">Hemos recibido tu mensaje</h2>
          <p style="color:#888;font-size:13px;line-height:1.8;margin-bottom:24px;">
            Hola ${nombre}, gracias por contactar con nosotros. Te responderemos lo antes posible.
          </p>
          <div style="border:1px solid #1a1a1a;padding:20px;margin-bottom:32px;">
            <p style="color:#555;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Tu mensaje</p>
            <p style="color:#F0EAD6;font-size:13px;line-height:1.8;">${mensaje}</p>
          </div>
          <p style="color:#444;font-size:10px;letter-spacing:0.05em;">© 2024 Ruido Events · Barcelona</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}