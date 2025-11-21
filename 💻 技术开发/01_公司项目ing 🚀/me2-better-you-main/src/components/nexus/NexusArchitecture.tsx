"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function NexusArchitecture({ levels }: { levels: { title: string; items: string[] }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {levels.map((lv, idx) => (
        <div key={lv.title} className="border rounded-lg overflow-hidden">
          <button className="w-full text-left p-3 font-medium flex justify-between items-center" onClick={() => setOpen(open === idx ? null : idx)}>
            <span>{lv.title}</span>
            <motion.div animate={{ rotate: open === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {open === idx && (
              <motion.ul 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: "auto", opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }} 
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-4 pb-3 text-sm text-muted-foreground space-y-1"
              >
                {lv.items.map((it) => (<li key={it}>• {it}</li>))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
