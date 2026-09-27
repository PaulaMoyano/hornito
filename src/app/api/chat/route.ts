import { GoogleGenAI, Type, type Content, type FunctionDeclaration, type Tool } from "@google/genai";
import { NextResponse } from "next/server";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase";
import { PICKUP_SLOTS, validatePickup, todayISO, formatARS } from "@/lib/business";

export const runtime = "nodejs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

/** Gemini devuelve 503 "high demand" con frecuencia en el free tier; reintenta con backoff. */
async function generateContentWithRetry(
  params: Parameters<typeof ai.models.generateContent>[0],
  maxRetries = 3
) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status !== 503 || attempt >= maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
}

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "get_catalog",
    description:
      "Devuelve el catálogo completo de productos disponibles del negocio, con nombre, descripción, precio y categoría. Usar SIEMPRE antes de mencionar precios o disponibilidad, nunca inventar productos o precios.",
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
        name: "create_order",
        description:
          "Crea un pedido anticipado real en la base de datos del negocio. Usar solo después de que el cliente confirmó explícitamente todos los datos: productos, cantidades, nombre, teléfono, día y franja horaria de retiro.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            customer_name: { type: Type.STRING, description: "Nombre del cliente" },
            customer_phone: { type: Type.STRING, description: "Teléfono de contacto del cliente" },
            pickup_date: { type: Type.STRING, description: "Fecha de retiro en formato YYYY-MM-DD" },
            pickup_time: {
              type: Type.STRING,
              description: `Franja horaria de retiro, una de: ${PICKUP_SLOTS.join(", ")}`,
            },
            items: {
              type: Type.ARRAY,
              description: "Productos pedidos",
              items: {
                type: Type.OBJECT,
                properties: {
                  product_name: { type: Type.STRING, description: "Nombre exacto del producto según el catálogo" },
                  quantity: { type: Type.INTEGER, description: "Cantidad pedida" },
                },
                required: ["product_name", "quantity"],
              },
            },
            notes: { type: Type.STRING, description: "Aclaraciones opcionales del pedido" },
          },
          required: ["customer_name", "customer_phone", "pickup_date", "pickup_time", "items"],
        },
      },
];

const tools: Tool[] = [{ functionDeclarations }];

async function getCatalog() {
  const { data, error } = await supabasePublic
    .from("products")
    .select("name, description, price, category")
    .eq("active", true)
    .order("category");
  if (error) return { error: error.message };
  return {
    products: (data ?? []).map((p) => ({ ...p, price_formatted: formatARS(p.price) })),
  };
}

async function createOrder(args: {
  customer_name: string;
  customer_phone: string;
  pickup_date: string;
  pickup_time: string;
  items: { product_name: string; quantity: number }[];
  notes?: string;
}) {
  const pickupCheck = validatePickup(args.pickup_date, args.pickup_time);
  if (!pickupCheck.ok) return { error: pickupCheck.reason };

  if (!args.items?.length) return { error: "El pedido no tiene productos." };

  const admin = supabaseAdmin();

  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, name, price")
    .eq("active", true);
  if (productsError) return { error: productsError.message };

  const lineItems: { product_id: string; product_name: string; quantity: number; unit_price: number; subtotal: number }[] = [];
  for (const item of args.items) {
    const match = products?.find((p) => p.name.toLowerCase() === item.product_name.toLowerCase());
    if (!match) return { error: `No encontramos "${item.product_name}" en el catálogo. Usá get_catalog para ver los nombres exactos.` };
    if (!item.quantity || item.quantity <= 0) return { error: `Cantidad inválida para "${item.product_name}".` };
    lineItems.push({
      product_id: match.id,
      product_name: match.name,
      quantity: item.quantity,
      unit_price: match.price,
      subtotal: match.price * item.quantity,
    });
  }

  const total = lineItems.reduce((sum, li) => sum + li.subtotal, 0);

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      customer_name: args.customer_name,
      customer_phone: args.customer_phone,
      pickup_date: args.pickup_date,
      pickup_time: args.pickup_time,
      notes: args.notes ?? null,
      total,
    })
    .select("id, order_number")
    .single();
  if (orderError) return { error: orderError.message };

  const { error: itemsError } = await admin.from("order_items").insert(
    lineItems.map((li) => ({
      order_id: order.id,
      product_id: li.product_id,
      product_name: li.product_name,
      quantity: li.quantity,
      unit_price: li.unit_price,
      subtotal: li.subtotal,
    }))
  );
  if (itemsError) return { error: itemsError.message };

  return {
    order_number: order.order_number,
    total_formatted: formatARS(total),
    pickup_date: args.pickup_date,
    pickup_time: args.pickup_time,
    items: lineItems.map((li) => ({ product_name: li.product_name, quantity: li.quantity })),
  };
}

async function runTool(name: string, args: Record<string, unknown>) {
  if (name === "get_catalog") return getCatalog();
  if (name === "create_order") return createOrder(args as Parameters<typeof createOrder>[0]);
  return { error: `Herramienta desconocida: ${name}` };
}

const SYSTEM_INSTRUCTION = `Sos el asistente virtual de Panadería Doña Rosa, una panadería y cafetería de barrio en Buenos Aires,
potenciado por Hornito. Ayudás a los clientes a armar un pedido anticipado para retirar en el local, en un tono
cálido y cercano (usá "vos", español rioplatense).

Reglas:
- Hoy es ${todayISO()}.
- Los pedidos requieren al menos 24hs de anticipación.
- El local está cerrado los lunes.
- Las franjas de retiro disponibles son: ${PICKUP_SLOTS.join(", ")}.
- Nunca inventes productos, precios ni disponibilidad: usá siempre la herramienta get_catalog antes de responder sobre el catálogo.
- Antes de llamar a create_order, repetí el resumen del pedido (productos, cantidades, total aproximado, nombre, teléfono, día y franja) y esperá confirmación explícita del cliente.
- Llamá a create_order solo una vez confirmado. Si la herramienta devuelve un error, explicáselo al cliente de forma clara y ayudalo a corregirlo.
- Al confirmar un pedido exitoso, mencioná el número de pedido, el total y cuándo retirarlo.
- Sé breve y conversacional, no uses listas largas salvo para mostrar el catálogo.

Tono de marca:
- Frases cortas, una idea por frase. Si se puede decir en seis palabras, no uses doce.
- Usá vocabulario del mostrador: "pedido", "retiro", "franja". Nunca digas "orden", "flujo" ni "procesar".
- Ante cualquier "no se puede" (fecha inválida, producto agotado, franja ocupada), ofrecé siempre una alternativa concreta en la misma respuesta — nunca dejes un rechazo sin salida.`;

type ChatMessage = { role: "user" | "model"; text: string };

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Falta configurar GEMINI_API_KEY en el servidor." }, { status: 500 });
  }

  const { history } = (await req.json()) as { history: ChatMessage[] };
  if (!Array.isArray(history) || history.length === 0) {
    return NextResponse.json({ error: "history es requerido" }, { status: 400 });
  }

  const contents: Content[] = history.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

  let lastOrder: Awaited<ReturnType<typeof createOrder>> | null = null;

  for (let iteration = 0; iteration < 5; iteration++) {
    const response = await generateContentWithRetry({
      model: MODEL,
      contents,
      config: { systemInstruction: SYSTEM_INSTRUCTION, tools },
    });

    const calls = response.functionCalls;
    if (!calls || calls.length === 0) {
      return NextResponse.json({ reply: response.text ?? "", order: lastOrder && !("error" in lastOrder) ? lastOrder : null });
    }

    // Reenviamos el content crudo del modelo (no uno reconstruido a mano): Gemini 3.x
    // adjunta un thought_signature a cada parte de function call que hay que preservar
    // tal cual para que las siguientes vueltas de la conversación sean válidas.
    const modelContent = response.candidates?.[0]?.content ?? { role: "model", parts: calls.map((c) => ({ functionCall: c })) };
    contents.push(modelContent);

    const functionResponses = [];
    for (const call of calls) {
      const result = await runTool(call.name!, (call.args ?? {}) as Record<string, unknown>);
      if (call.name === "create_order") lastOrder = result as Awaited<ReturnType<typeof createOrder>>;
      functionResponses.push({ functionResponse: { name: call.name, response: { result } } });
    }
    contents.push({ role: "user", parts: functionResponses });
  }

  return NextResponse.json({ reply: "Perdón, tuve un problema procesando tu pedido. ¿Podés reformularlo?", order: null });
}
