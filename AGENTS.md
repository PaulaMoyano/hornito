<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Sobre este proyecto

Hornito: SaaS de pedidos anticipados con IA para locales gastronómicos (panaderías, cafeterías). Ver [README.md](README.md) para stack, setup y estructura.

- El chatbot (`src/app/api/chat/route.ts`) usa Gemini con function calling (`get_catalog`, `create_order`) contra Supabase. Los tool calls de Gemini 3.x llevan `thought_signature`: siempre reenviar el `content` crudo de `response.candidates[0].content` en el siguiente turno, nunca reconstruir las partes a mano — si no, la API rechaza la request con 400.
- Reglas de negocio (franjas horarias, anticipación mínima, días cerrados) centralizadas en `src/lib/business.ts`, no hardcodeadas en el prompt.
- La landing (`/`) y la demo (`/api/chat`, `/demo`) son conceptualmente distintas: la landing vende el SaaS a dueños de locales, la demo simula la experiencia de un cliente final pidiendo en un negocio ficticio ("Panadería Doña Rosa"). No mezclar el copy de una con la otra.
- Paleta, tipografías y tono de voz salen del sistema de marca de Hornito (tokens en `src/app/globals.css`, componente `src/components/Logo.tsx`). Mantener consistencia: terracota/café/crema, Nunito para títulos, Nunito Sans para texto/UI, voseo rioplatense, frases cortas.
