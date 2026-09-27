import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Cliente público: solo puede leer el catálogo de productos activos (RLS). */
export const supabasePublic = createClient(supabaseUrl, anonKey);

/**
 * Cliente con service role: usar SOLO en el servidor (API routes).
 * Bypassea RLS, es el único que puede crear pedidos.
 */
export function supabaseAdmin() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  active: boolean;
};

export type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  pickup_date: string;
  pickup_time: string;
  status: string;
  notes: string | null;
  total: number;
};
