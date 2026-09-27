import Link from "next/link";
import DemoChat from "@/components/DemoChat";
import { Logo } from "@/components/Logo";
import { supabasePublic, type Product } from "@/lib/supabase";
import { formatARS } from "@/lib/business";

export const revalidate = 0;

export const metadata = {
  title: "Demo · Hornito",
  description: "Probá el asistente de Hornito tal como lo experimentaría un cliente de Panadería Doña Rosa.",
};

export default async function DemoPage() {
  const { data } = await supabasePublic
    .from("products")
    .select("id, name, description, price, image_url, category, active")
    .eq("active", true)
    .order("category");

  const products = (data as Product[]) ?? [];

  return (
    <>
      <header className="border-b border-masa bg-crema/90 px-6 py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold text-canela hover:text-cafe">
            <span aria-hidden="true">‹</span>
            <Logo size={22} />
          </Link>
          <span className="rounded-full bg-terracota-100 px-3 py-1 text-xs font-bold text-terracota-dark">
            Demo · Panadería Doña Rosa
          </span>
        </div>
      </header>

      <main className="flex-1 bg-crema">
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-cafe">
            Así lo vería un cliente tuyo
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-canela">
            Esta es una demo funcional del asistente de Hornito, mostrada con el catálogo de un negocio ficticio,
            Panadería Doña Rosa. Los pedidos que confirmes acá se guardan de verdad en una base de datos.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <DemoChat />

            <aside className="order-first rounded-[24px] border border-masa bg-harina p-5 lg:order-last">
              <h2 className="font-display font-extrabold text-cafe">Catálogo de Panadería Doña Rosa</h2>
              <ul className="mt-3 space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-bold text-cafe">{p.name}</p>
                      {p.description && <p className="text-canela">{p.description}</p>}
                    </div>
                    <span className="whitespace-nowrap font-bold tabular-nums text-terracota">
                      {formatARS(p.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-masa px-6 py-6 text-center text-sm text-canela">
        Hornito · Prototipo demo — Proyecto final Bootcamp IA, Tekne Data Labs
      </footer>
    </>
  );
}
