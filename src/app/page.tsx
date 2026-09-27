import Link from "next/link";
import { Logo, LogoMark } from "@/components/Logo";

const FEATURES = [
  {
    title: "Catálogo siempre al día",
    body: "Cargás tus productos, precios y fotos una vez. El asistente nunca inventa algo que no vendés ni cobra de más.",
    icon: "📋",
  },
  {
    title: "Asistente con IA, 24/7",
    body: "Tus clientes hacen el pedido charlando, como con un mensaje de WhatsApp. El asistente arma el pedido y pide los datos que faltan.",
    icon: "🤖",
  },
  {
    title: "Pedidos organizados, no más caos",
    body: "Se acabó el cuaderno y las capturas de pantalla perdidas. Cada pedido queda registrado con fecha, horario y total.",
    icon: "🗂️",
  },
  {
    title: "Tus reglas, respetadas siempre",
    body: "Anticipación mínima, días cerrados, franjas horarias: configurás las reglas de tu local una vez y se cumplen siempre.",
    icon: "⏰",
  },
];

const STEPS = [
  {
    title: "Cargás tu catálogo",
    body: "Productos, precios y las reglas de tu local: horarios de retiro, anticipación mínima, días cerrados.",
  },
  {
    title: "Activás el asistente",
    body: "Lo sumás a tu sitio o página de Instagram/Linktree en minutos, sin instalar nada complejo.",
  },
  {
    title: "Recibís pedidos listos",
    body: "Cada pedido llega confirmado, con los datos del cliente y el horario de retiro, directo a tu panel.",
  },
];

const PLANS = [
  {
    name: "Gratis",
    price: "$ 0",
    period: "/mes",
    description: "Para probar sin compromiso.",
    features: ["Hasta 30 pedidos por mes", "Asistente en tu web", "1 local"],
    cta: "Empezar gratis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$ 19.900",
    period: "/mes",
    description: "Para el local que vende todos los días.",
    features: ["Pedidos ilimitados", "Reglas de retiro y anticipación", "Avisos por WhatsApp"],
    cta: "Pasarme a Pro",
    highlighted: true,
  },
  {
    name: "Negocios",
    price: "$ 39.900",
    period: "/mes",
    description: "Para varias sucursales.",
    features: ["Todo lo de Pro", "Hasta 5 locales", "Ayuda por teléfono"],
    cta: "Hablemos",
    highlighted: false,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Nos ahorra horas de WhatsApp cada semana. Los pedidos llegan organizados y a la mañana ya sabemos cuánto vamos a hornear.",
    author: "María Fernández",
    business: "Panadería La Espiga · Villa Urquiza",
  },
  {
    quote:
      "Antes se nos perdían pedidos en capturas de pantalla. Ahora todo queda registrado y los clientes se manejan solos con el asistente.",
    author: "Diego Suárez",
    business: "Café del Barrio · Rosario",
  },
  {
    quote:
      "Lo configuramos en una tarde. El asistente entiende perfecto cuándo estamos cerrados y no deja agendar cualquier cosa.",
    author: "Vale Quiroga",
    business: "Pastelería Dulce Hogar · Córdoba",
  },
];

const AVATAR_STYLE = {
  backgroundImage: "repeating-linear-gradient(45deg, #E6D6BF 0 6px, #EFE2CD 6px 12px)",
};

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-masa bg-crema/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-bold text-canela sm:flex">
            <a href="#producto" className="hover:text-cafe">
              Producto
            </a>
            <a href="#precios" className="hover:text-cafe">
              Precios
            </a>
            <a href="#testimonios" className="hover:text-cafe">
              Testimonios
            </a>
          </nav>
          <Link href="/demo" className="btn-primary rounded-[14px] px-4 py-2 text-sm">
            Probalo gratis
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-terracota-100 px-3 py-1 text-xs font-bold text-terracota-dark">
              SaaS para panaderías, cafeterías y locales gastronómicos
            </span>
            <h1 className="font-display text-4xl font-black leading-[0.95] tracking-[-0.03em] text-cafe sm:text-6xl text-balance">
              Dejá el cuaderno. Los pedidos te llegan anotados.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-canela">
              Tus clientes piden desde tu web, a cualquier hora. Hornito revisa horarios y anticipación, arma el
              pedido y te lo deja anotado.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/demo" className="btn-primary rounded-[14px] px-6 py-3.5 text-base">
                Probalo gratis en tu local
              </Link>
              <a href="#producto" className="btn-secondary rounded-[14px] px-6 py-3.5 text-base">
                Ver cómo funciona
              </a>
            </div>
            <p className="text-sm font-semibold text-canela">Lo armás en 10 minutos. Sin tarjeta.</p>
          </div>

          {/* Mockup del asistente en el sitio del local */}
          <div className="flex flex-col overflow-hidden rounded-[28px] bg-harina shadow-[0_1px_2px_rgba(46,30,20,.06),0_16px_36px_-16px_rgba(46,30,20,.3)]">
            <div className="flex items-center gap-2.5 border-b border-masa px-5 py-4">
              <div
                className="h-8 w-8 flex-none rounded-[10px]"
                style={AVATAR_STYLE}
              />
              <div className="flex flex-col text-sm leading-tight">
                <span className="font-bold text-cafe">Panadería del local</span>
                <span className="text-xs font-semibold text-success">● Tomando pedidos</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2.5 p-5 text-[15px] leading-snug">
              <div className="max-w-[80%] self-end rounded-[18px] rounded-br-md bg-terracota px-3.5 py-2.5 text-harina">
                Quiero una torta de ricota para mañana a las 8
              </div>
              <div className="max-w-[85%] self-start rounded-[18px] rounded-bl-md bg-hueso px-3.5 py-2.5 text-cafe">
                Uy, para mañana a las 8 ya no llegamos: las tortas se piden con 48 hs de anticipación. ¿Te la dejo
                lista para el jueves a las 10?
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border-[1.5px] border-terracota px-3.5 py-1.5 text-sm font-bold text-terracota">
                  Sí, el jueves
                </span>
                <span className="rounded-full border-[1.5px] border-masa px-3.5 py-1.5 text-sm font-bold text-cafe">
                  Elegir otro día
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-crema px-3 py-2.5 text-[11px] text-canela">
              <LogoMark size={12} />
              <span>Pedidos con Hornito</span>
            </div>
          </div>
        </section>

        {/* Producto / Features */}
        <section id="producto" className="border-y border-masa bg-harina/60 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-cafe">
                Todo lo que necesitás para dejar de anotar pedidos a mano
              </h2>
              <p className="mt-3 text-canela">
                Un asistente conversacional conectado a tu catálogo real y a las reglas de tu negocio.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-[20px] border border-masa bg-harina p-5">
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="mt-3 font-display font-extrabold text-cafe">{f.title}</h3>
                  <p className="mt-2 text-sm text-canela">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center font-display text-3xl font-extrabold tracking-[-0.02em] text-cafe">
              Así de simple es empezar
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title} className="flex flex-col gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracota font-display text-sm font-bold text-harina">
                    {i + 1}
                  </span>
                  <h3 className="font-display font-extrabold text-cafe">{step.title}</h3>
                  <p className="text-sm text-canela">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="border-y border-masa bg-harina/60 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-cafe">
                Precios simples, sin sorpresas
              </h2>
              <p className="mt-3 text-canela">Empezá gratis y escalá cuando tu local lo necesite.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col gap-4.5 rounded-[28px] p-7 ${
                    plan.highlighted
                      ? "bg-cafe text-crema shadow-[0_2px_4px_rgba(46,30,20,.1),0_24px_48px_-20px_rgba(46,30,20,.55)]"
                      : "border-[1.5px] border-masa bg-harina text-cafe"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-7 rounded-full bg-dorado px-3 py-1 text-xs font-bold text-cafe">
                      El que más eligen
                    </span>
                  )}
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-xl font-extrabold">{plan.name}</h3>
                    <p className={`text-sm ${plan.highlighted ? "text-[#D9C7B0]" : "text-canela"}`}>
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-4xl font-black tracking-[-0.02em] tabular-nums">
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlighted ? "text-[#D9C7B0]" : "text-canela"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <ul className="flex flex-1 flex-col gap-2.5 text-[15px]">
                    {plan.features.map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                  <Link
                    href="/demo"
                    className={`rounded-[14px] px-4 py-3 text-center text-sm ${
                      plan.highlighted ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center font-display text-3xl font-extrabold tracking-[-0.02em] text-cafe">
              Locales que ya dejaron el cuaderno de pedidos
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.author} className="flex flex-col gap-5 rounded-[28px] bg-hueso p-7">
                  <span className="font-display text-5xl leading-none text-terracota">&ldquo;</span>
                  <blockquote className="font-display text-lg font-bold leading-snug tracking-[-0.01em] text-cafe text-pretty">
                    {t.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3 text-sm">
                    <div className="h-11 w-11 flex-none rounded-full" style={AVATAR_STYLE} />
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-cafe">{t.author}</span>
                      <span className="text-canela">{t.business}</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="flex flex-col items-center gap-6 rounded-[28px] bg-terracota px-6 py-14 text-center">
            <h2 className="max-w-xl font-display text-3xl font-black tracking-[-0.02em] text-harina">
              ¿Querés ver cómo funciona con tus propios ojos?
            </h2>
            <p className="max-w-lg text-terracota-100">
              Probá el asistente tal como lo probaría un cliente de tu local, con pedidos que se guardan de verdad.
            </p>
            <Link href="/demo" className="rounded-[14px] bg-harina px-6 py-3.5 text-base font-bold text-terracota">
              Ver demo en vivo
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-masa px-6 py-8 text-center text-sm text-canela">
        Hornito · Prototipo demo — Proyecto final Bootcamp IA, Tekne Data Labs
      </footer>
    </>
  );
}
