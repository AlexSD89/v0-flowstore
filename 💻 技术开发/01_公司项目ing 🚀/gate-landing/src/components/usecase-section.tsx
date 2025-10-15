"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import {
  type Usecase,
  type UsecaseCategory,
  usecaseCategories,
  usecases,
} from "@/data/usecases";

const layoutTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export function UsecaseSection() {
  const [activeCategory, setActiveCategory] = useState<UsecaseCategory>("featured");

  const filtered = useMemo<Usecase[]>(() => {
    if (activeCategory === "featured") {
      return usecases.filter((item) => item.category === "featured");
    }
    return usecases.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="usecases" className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            现在就让 Gate 帮你启动自动化
          </h2>
          <p className="mt-3 max-w-2xl text-base text-white/65">
            从效率、研发到市场，Gate 会为每个场景选择最佳模型与 n8n 工作流；你只需确认目标，就能获得可落地的执行链路。
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
        {usecaseCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={clsx(
              "relative rounded-full px-4 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              category.id === activeCategory
                ? "bg-white text-slate-950"
                : "bg-white/5 hover:bg-white/10"
            )}
            data-analytics-id={`usecase-tab-${category.id}`}
          >
            {category.label}
            {category.id === activeCategory && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full border border-white/80"
                transition={layoutTransition as never}
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {filtered.map((usecase) => (
          <motion.article
            key={usecase.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            <div>
              <div className="flex items-center gap-3">
                {usecase.apps.map((app) => (
                  <div
                    key={app.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8"
                  >
                    <Image
                      src={app.iconUrl}
                      alt={app.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                ))}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">
                {usecase.title}
              </h3>
              <p className="mt-3 text-sm text-white/65">{usecase.description}</p>
            </div>
            <div className="mt-8 flex items-center justify-between text-sm">
              <span className="text-white/60">{usecase.metric}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-white/70 transition group-hover:border-white/30 group-hover:text-white">
                Why Gate recommends this →
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
