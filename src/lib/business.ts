// Reglas de negocio para pedidos anticipados (demo: Panadería Doña Rosa).

export const PICKUP_SLOTS = ["09:00-11:00", "11:00-13:00", "16:00-18:00"] as const;
export type PickupSlot = (typeof PICKUP_SLOTS)[number];

export const MIN_LEAD_HOURS = 24;
export const CLOSED_WEEKDAY = 1; // lunes cerrado (0 = domingo ... 6 = sábado)

/** Fecha/hora actual en la zona horaria de Argentina, como Date. */
export function nowInArgentina(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
}

export function todayISO(): string {
  return nowInArgentina().toISOString().slice(0, 10);
}

export type PickupValidation = { ok: true } | { ok: false; reason: string };

/** Valida que la fecha/franja de retiro cumpla el mínimo de anticipación y que el local esté abierto. */
export function validatePickup(pickupDate: string, pickupTime: string): PickupValidation {
  if (!PICKUP_SLOTS.includes(pickupTime as PickupSlot)) {
    return { ok: false, reason: `Franja horaria inválida. Opciones: ${PICKUP_SLOTS.join(", ")}` };
  }

  const date = new Date(`${pickupDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, reason: "Fecha inválida, usá el formato YYYY-MM-DD." };
  }

  if (date.getDay() === CLOSED_WEEKDAY) {
    return { ok: false, reason: "Los lunes el local está cerrado, elegí otro día." };
  }

  const slotStartHour = Number(pickupTime.split(":")[0]);
  const pickupDateTime = new Date(`${pickupDate}T${String(slotStartHour).padStart(2, "0")}:00:00`);
  const minAllowed = new Date(nowInArgentina().getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000);

  if (pickupDateTime.getTime() < minAllowed.getTime()) {
    return { ok: false, reason: `Los pedidos necesitan al menos ${MIN_LEAD_HOURS}hs de anticipación.` };
  }

  return { ok: true };
}

export function formatARS(amount: number): string {
  return amount.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}
