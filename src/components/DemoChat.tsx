"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";

type Message = { role: "user" | "model"; text: string };
type OrderConfirmation = {
  order_number: number;
  total_formatted: string;
  pickup_date: string;
  pickup_time: string;
  items: { product_name: string; quantity: number }[];
};

/** El asistente devuelve **negritas** en markdown; el chat es texto plano, así que lo parseamos a mano. */
function renderChatText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const GREETING: Message = {
  role: "model",
  text: "¡Hola! Soy el asistente de Panadería Doña Rosa, potenciado por Hornito 🍞 Puedo mostrarte el catálogo y armar tu pedido anticipado. ¿Qué te gustaría pedir?",
};

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderConfirmation | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const nextHistory = [...messages, { role: "user" as const, text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: nextHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error del servidor");
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      if (data.order) setLastOrder(data.order);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Uy, tuve un problema para responder. ¿Podés intentar de nuevo?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4.5rem)] flex-col overflow-hidden rounded-[24px] bg-harina shadow-[0_1px_2px_rgba(46,30,20,.06),0_16px_36px_-16px_rgba(46,30,20,.3)]">
      <div className="flex items-center gap-2.5 border-b border-masa px-5 py-4">
        <div
          className="h-8 w-8 flex-none rounded-[10px]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #E6D6BF 0 6px, #EFE2CD 6px 12px)" }}
        />
        <div className="flex flex-col text-sm leading-tight">
          <span className="font-bold text-cafe">Panadería Doña Rosa</span>
          <span className="text-xs font-semibold text-success">● Tomando pedidos</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-[18px] px-3.5 py-2.5 text-[15px] leading-snug sm:max-w-[70%] ${
                m.role === "user" ? "rounded-br-md bg-terracota text-harina" : "rounded-bl-md bg-hueso text-cafe"
              }`}
            >
              {renderChatText(m.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-[18px] rounded-bl-md bg-hueso px-3.5 py-2.5 text-sm text-canela">
              escribiendo…
            </div>
          </div>
        )}
        {lastOrder && (
          <div className="rounded-[18px] bg-success-bg px-3.5 py-3 text-sm text-success">
            <p className="font-bold">✅ Pedido #{lastOrder.order_number} confirmado</p>
            <ul className="mt-1 list-inside list-disc">
              {lastOrder.items.map((it, i) => (
                <li key={i}>
                  {it.quantity}x {it.product_name}
                </li>
              ))}
            </ul>
            <p className="mt-1">
              Retiro: {lastOrder.pickup_date} · {lastOrder.pickup_time}
            </p>
            <p className="font-bold">Total: {lastOrder.total_formatted}</p>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2 border-t border-masa p-3 sm:p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu pedido..."
          className="flex-1 rounded-[14px] border border-masa bg-crema px-4 py-2.5 text-[15px] text-cafe outline-none focus:border-terracota"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary rounded-[14px] px-5 py-2.5 text-sm disabled:opacity-40"
        >
          Enviar
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 bg-crema px-3 py-2.5 text-[11px] text-canela">
        <LogoMark size={12} />
        <span>Pedidos con Hornito</span>
      </div>
    </div>
  );
}
