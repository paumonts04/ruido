import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { checkoutLimiter } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await checkoutLimiter.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Demasiadas peticiones, inténtalo más tarde' }, { status: 429 })
  }

  try {
    const { eventoId, nombre, email, cantidad } = await req.json()

    if (!eventoId || !nombre || !email || !cantidad) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: evento } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', eventoId)
      .eq('publicado', true)
      .single()

    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          quantity: cantidad,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(evento.precio * 100),
            product_data: {
              name: `Entrada — ${evento.titulo}`,
              description: `${evento.lugar} · ${new Date(evento.fecha).toLocaleDateString('es-ES')}`,
            },
          },
        },
      ],
      metadata: {
        evento_id: eventoId,
        nombre,
        email,
        cantidad: String(cantidad),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/eventos/${evento.slug}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/eventos/${evento.slug}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Error al crear la sesión' }, { status: 500 })
  }
}