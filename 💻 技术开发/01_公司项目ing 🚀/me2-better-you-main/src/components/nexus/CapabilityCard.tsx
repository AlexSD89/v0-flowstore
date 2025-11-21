"use client";
import React from "react";
import { TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function CapabilityCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div className="rounded-lg border p-4 bg-card" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <ShieldCheck className="h-5 w-5 text-emerald-600" />
      </div>
      <p className="text-sm mt-2 text-muted-foreground">{desc}</p>
      <div className="mt-3 h-2 w-full bg-muted rounded">
        <motion.div className="h-2 bg-emerald-500 rounded" initial={{ width: 0 }} whileInView={{ width: "80%" }} transition={{ duration: 0.8 }} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />对比与可视化</div>
    </motion.div>
  );
}
