"use client";
import React from "react";

export function CustomerScenario({ persona, before, after, isActive }: { persona: string; before: string; after: string; isActive?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 bg-card transition-all ${isActive ? "border-[var(--nexus-primary)] shadow-lg" : ""}`}>
      <div className="font-semibold">{persona}</div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">Before</div>
          <div className="mt-1">{before}</div>
        </div>
        <div>
          <div className="text-muted-foreground">After</div>
          <div className="mt-1">{after}</div>
        </div>
      </div>
    </div>
  );
}
