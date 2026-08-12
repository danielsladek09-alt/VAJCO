const STATUS_MAP: Record<string, { label: string; className: string }> = {
  NEW: { label: "Nová", className: "bg-blue-50 text-blue-700" },
  CONFIRMED: { label: "Potvrzená", className: "bg-amber-50 text-amber-700" },
  PREPARED: { label: "Připravená", className: "bg-purple-50 text-purple-700" },
  PICKED_UP: { label: "Vyzvednutá", className: "bg-green-50 text-green-700" },
  CANCELLED: { label: "Zrušená", className: "bg-red-50 text-red-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.NEW;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

export const ORDER_STATUSES = [
  { value: "NEW", label: "Nová" },
  { value: "CONFIRMED", label: "Potvrzená" },
  { value: "PREPARED", label: "Připravená" },
  { value: "PICKED_UP", label: "Vyzvednutá" },
  { value: "CANCELLED", label: "Zrušená" },
];
