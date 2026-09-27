# Hornito

Hornito es un SaaS de pedidos anticipados con IA para panaderías y pastelerías argentinas. Este repo tiene la landing del producto y una demo funcional del asistente conversacional.

> Proyecto final — Bootcamp IA 2026, [Tekne Data Labs](https://www.teknedatalabs.com).

## Qué incluye

- **`/`** — Landing del SaaS: propuesta de valor, features, planes y testimonios.
- **`/demo`** — Demo funcional del asistente, con el catálogo de un negocio ficticio ("Panadería Doña Rosa"). Los pedidos que se confirman ahí se guardan de verdad en Supabase, no están simulados.
- **`/api/chat`** — Route handler que orquesta la conversación con Gemini (function calling) contra el catálogo y las reglas de negocio (anticipación mínima, horarios de retiro, días cerrados).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router) + Tailwind CSS 4 |
| Base de datos | [Supabase](https://supabase.com) (Postgres + RLS) |
| Asistente | [Gemini API](https://ai.google.dev) (`gemini-flash-lite-latest`, function calling) |

Elegimos Gemini en vez de la API de Claude para esta demo puntual porque su free tier permite probar el chatbot sin consumir créditos.

## Correrlo en local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar el archivo de variables de entorno y completarlo:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | De dónde sale |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Panel de Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Panel de Supabase → Project Settings → API (`anon` / `publishable`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Panel de Supabase → Project Settings → API Keys → **Legacy API Keys** → `service_role` (solo server-side, nunca exponerla al cliente) |
   | `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (gratis) |

3. Crear el schema en un proyecto de Supabase nuevo: correr el contenido de [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor del panel. Esto crea las tablas (`products`, `orders`, `order_items`), la política de RLS que hace público el catálogo, y carga productos de ejemplo.

4. Levantar el servidor:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
├── app/
│   ├── page.tsx           # Landing
│   ├── demo/page.tsx      # Demo del asistente
│   ├── api/chat/route.ts  # Endpoint del chatbot (Gemini + Supabase)
│   ├── icon.svg           # Favicon (isotipo de marca)
│   └── globals.css        # Tokens de diseño (paleta, tipografías)
├── components/
│   ├── DemoChat.tsx        # UI del chat en /demo
│   └── Logo.tsx             # Isotipo + wordmark
└── lib/
    ├── supabase.ts          # Clientes de Supabase (público / admin)
    └── business.ts          # Reglas de negocio: franjas horarias, anticipación mínima
supabase/
└── schema.sql               # Tablas, RLS y datos de ejemplo
```

## Qué está simulado

- El catálogo y los pedidos de la demo (`/demo`) pertenecen a un negocio ficticio, **Panadería Doña Rosa** — es el ejemplo que usamos para mostrar el producto funcionando, no un cliente real.
- Los planes y precios de la landing (Gratis / Pro / Negocios) y los testimonios son contenido ilustrativo del sistema de marca, no clientes ni facturación real.
- No hay signup ni cobro real: todos los CTA de la landing llevan a la demo funcional.

Todo lo demás —el catálogo, la conversación con el asistente y la persistencia de pedidos en la base de datos— es real y queda registrado en Supabase.
