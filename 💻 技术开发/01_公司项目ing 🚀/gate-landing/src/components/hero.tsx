"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Workflow, Network } from "lucide-react";
import { personas, type Persona } from "@/data/personas";
import { clsx } from "clsx";

const steps = [
  {
    title: "侦测信号",
    description: "监听邮件、Webhook、数据库变更",
    icon: Sparkles,
  },
  {
    title: "智能编排",
    description: "Gate 选择最优 Agent + n8n 节点",
    icon: Workflow,
  },
  {
    title: "实时回写",
    description: "状态同步到你常用的工具",
    icon: Network,
  },
];

export function HeroSection() {
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);

  const personaDetails = useMemo(() => ({
    key: activePersona.id,
    highlight: activePersona.highlight,
    painPoint: activePersona.painPoint,
    solution: activePersona.solution,
    proof: activePersona.proof,
    gradientStops: activePersona.gradientStops,
  }), [activePersona]);

  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-40 pb-24 md:flex-row md:items-center">
      <div className="relative z-10 flex-1 space-y-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70 backdrop-blur">
          Gate · AI Automation
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            让 Gate 为你的 AI 打开世界
          </h1>
          <p className="max-w-xl text-lg text-white/70">
            连接智能体、n8n 与所有 SaaS，几分钟构建跨团队自动化。Gate 识别业务意图，自动编排触发器、审批与回写，帮助团队在运行中不断学习与迭代。
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {personas.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => setActivePersona(persona)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                persona.id === activePersona.id
                  ? "bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.35)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              )}
              data-analytics-id={`hero-persona-${persona.id}`}
            >
              {persona.label}
            </button>
          ))}
        </div>

        <motion.div
          key={personaDetails.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] backdrop-blur"
        >
          <div
            className="h-[4px] w-full"
            style={{
              backgroundImage: `linear-gradient(90deg, ${personaDetails.gradientStops.join(", ")})`,
            }}
          />
          <div className="space-y-4 px-6 py-6 text-sm leading-relaxed text-white/80 md:px-8 md:py-7">
            <p className="text-lg font-medium text-white">
              {personaDetails.highlight}
            </p>
            <p>{personaDetails.painPoint}</p>
            <p className="text-white/90">{personaDetails.solution}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">
              {personaDetails.proof}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="#cta"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7D6BFF] via-[#557BFF] to-[#4DD8FF] px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_20px_50px_rgba(78,141,255,0.45)] transition hover:shadow-[0_24px_60px_rgba(78,141,255,0.6)]"
            data-analytics-id="hero-primary-cta"
          >
            Start building with Gate
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
          <Link
            href="#usecases"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base text-white/80 transition hover:border-white hover:text-white"
          >
            Explore use cases
          </Link>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute -top-10 right-6 hidden h-40 w-40 rounded-full bg-[#6b5dff]/30 blur-3xl md:block" />
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl shadow-[0_40px_120px_rgba(22,25,40,0.65)]"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            智能体运行轨迹
          </p>
          <div className="mt-6 space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4"
                >
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-5 w-5 text-[#92B4FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{step.title}</p>
                    <p className="text-sm text-white/60">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-8 rounded-2xl border border-[#65D1FF]/40 bg-[#0E1728]/60 px-5 py-4 text-sm text-[#9CDFFF]">
            Gate 根据上下文为你生成工作流，自动调用 n8n 作业并实时反馈状态。
          </div>
        </motion.div>
      </div>
    </section>
  );
}
