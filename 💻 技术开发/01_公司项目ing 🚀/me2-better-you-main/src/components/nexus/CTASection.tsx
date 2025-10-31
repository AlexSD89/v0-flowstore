"use client";
import React from "react";

export function CTASection({ tiers }: { tiers: { label: string; action: string }[] }) {
  return (
    <div className="text-center space-y-3">
      <div className="text-sm text-muted-foreground">下一步</div>
      <div className="flex flex-wrap justify-center gap-3">
        {tiers.map((t) => (
          <button key={t.label} className="px-4 py-2 rounded border bg-primary text-primary-foreground hover:opacity-90">{t.action}</button>
        ))}
      </div>
    </div>
  );
}
