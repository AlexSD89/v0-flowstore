"use client";
import React from "react";

export function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <details key={it.q} className="rounded border p-3 bg-card">
          <summary className="cursor-pointer font-medium">{it.q}</summary>
          <div className="mt-2 text-sm text-muted-foreground">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
