# RUIDO — Agencia de Eventos

Web ficticia de una agencia de eventos underground con estética street art. Proyecto de portfolio construido de principio a fin con un stack moderno.

🌐 **[ruido-farra.vercel.app](https://ruido-farra.vercel.app)**

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS 4 |
| Base de datos | Supabase (PostgreSQL + RLS) |
| Autenticación | Supabase Auth |
| Pagos | Stripe Checkout + Webhooks |
| Email | Resend |
| Rate limiting | Upstash Redis |
| Deploy | Vercel + Analytics |

---

## Funcionalidades

### Público
- **Landing** con hero interactivo — stickers arrastrables con soporte táctil, easter egg al hacer clic en ✕, ticker animado infinito
- **`/eventos`** — listado de próximos eventos con datos en tiempo real desde Supabase
- **`/eventos/[slug]`** — detalle del evento con aforo disponible actualizado y compra de entradas via Stripe Checkout
- **`/eventos/[slug]/confirmacion`** — página de confirmación post-pago con referencia de sesión
- **`/galeria`** — portfolio masonry con lightbox, navegación por teclado y swipe táctil, efecto grayscale → color
- **`/contacto`** — formulario con email de confirmación automático via Resend

### Admin (`/admin`)
- Protegido por autenticación Supabase
- **Dashboard** con métricas en tiempo real (eventos, entradas vendidas, mensajes sin leer)
- **Gestión de eventos** — crear, editar con slug autogenerado, publicar/despublicar
- **Entradas** — listado de compras con estado
- **Mensajes** — bandeja con filtros por leído/no leído, marcar como leído al abrir
- **Galería** — subida de imágenes a Supabase Storage, asociar a evento, eliminar

---

## Seguridad

- **Autenticación** en todas las rutas `/api/admin/*` → 401 sin sesión
- **Validación con Zod** en API routes → 422 con datos inválidos o campos no permitidos
- **Validación de archivos** en upload → tipo (solo imágenes) y tamaño (máx. 5MB)
- **Rate limiting** con Upstash → 5 req/hora en contacto, 10 req/hora en checkout
- **Headers de seguridad** → X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **RLS activo** en todas las tablas de Supabase con políticas por rol

---

## Base de datos

```sql
eventos           -- título, slug, fecha, lugar, aforo, precio, publicado
entradas          -- evento_id, nombre, email, cantidad, stripe_session_id, estado
mensajes_contacto -- nombre, email, asunto, mensaje, leido
galeria           -- url, descripcion, evento_id, orden
```

---

## Estructura

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── eventos/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── confirmacion/
│   │   │           └── page.tsx
│   │   ├── galeria/page.tsx
│   │   └── contacto/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── eventos/
│   │   │   ├── page.tsx
│   │   │   ├── nuevo/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── entradas/page.tsx
│   │   ├── mensajes/page.tsx
│   │   └── galeria/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts
│   │   ├── contacto/route.ts
│   │   ├── webhooks/stripe/route.ts
│   │   └── admin/
│   │       ├── eventos/route.ts
│   │       ├── mensajes/route.ts
│   │       └── galeria/
│   │           ├── route.ts
│   │           └── upload/route.ts
│   └── login/page.tsx
├── components/
│   ├── admin/
│   │   ├── AdminNav.tsx
│   │   ├── EventoForm.tsx
│   │   ├── FiltroMensajes.tsx
│   │   ├── GaleriaAdmin.tsx
│   │   └── MensajeItem.tsx
│   ├── eventos/
│   │   ├── ComprarEntrada.tsx
│   │   └── EventoCard.tsx
│   └── shared/
│       ├── GaleriaGrid.tsx
│       ├── Hero.tsx
│       ├── Navbar.tsx
│       └── Ticker.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── auth.ts
│   ├── ratelimit.ts
│   ├── schemas.ts
│   └── stripe.ts
└── types/
    └── database.types.ts
```

---

## Variables de entorno

Crea un `.env.local` en la raíz del proyecto. Necesitarás cuentas en Supabase, Stripe, Resend y Upstash para obtener las keys necesarias.

---

## Instalación local

```bash
git clone https://github.com/paumonts04/ruido.git
cd ruido
npm install
npm run dev
```

Para recibir webhooks de Stripe en local:

```bash
.\stripe.exe listen --events checkout.session.completed --forward-to localhost:3000/api/webhooks/stripe
```

---

Construido por [@paumonts04](https://github.com/paumonts04)