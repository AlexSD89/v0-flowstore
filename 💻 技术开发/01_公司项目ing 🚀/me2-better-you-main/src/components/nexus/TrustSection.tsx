"use client";
import React from "react";

export function TrustSection({ logos, testimonials, metrics }: { logos: string[]; testimonials: { name: string; quote: string }[]; metrics: { label: string; value: string }[] }) {
  return (
    <div className="rounded-lg border p-4 bg-card space-y-3">
      <div className="text-sm text-muted-foreground">合作与背书</div>
      <div className="flex flex-wrap gap-2 text-xs">
        {logos.map((l) => (<span key={l} className="px-2 py-1 border rounded">{l}</span>))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {testimonials.map((t) => (
          <blockquote key={t.name} className="text-sm border rounded p-3">“{t.quote}” — {t.name}</blockquote>
        ))}
      </div>
      <div className="flex gap-4 text-sm">
        {metrics.map((m) => (
          <div key={m.label} className="px-3 py-2 border rounded bg-background"><div className="text-xs text-muted-foreground">{m.label}</div><div className="font-semibold">{m.value}</div></div>
        ))}
      </div>
    </div>
  );
}
