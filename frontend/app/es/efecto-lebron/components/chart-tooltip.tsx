"use client";

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
      <p className="mb-1 font-medium text-zinc-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="tabular-nums text-zinc-400">
          {entry.name === "conLeBron" ? "Con LeBron" : "Sin LeBron"}:{" "}
          <span className="font-semibold text-white">{entry.value}%</span>
        </p>
      ))}
    </div>
  );
}
