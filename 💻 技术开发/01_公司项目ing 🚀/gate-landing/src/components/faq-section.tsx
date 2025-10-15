"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-white/50">
          FAQ
        </p>
        <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
          常见问题
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/65">
          我们将 AI 与自动化真正融入业务所需的流程、安全、治理体系。以下答案帮助你快速了解上线 Gate 所需的关键点。
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
              >
                <span className="text-base font-medium text-white">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-white/70 transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-t border-white/10 px-6 py-5 text-sm text-white/70">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
