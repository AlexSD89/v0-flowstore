"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";

const demoScripts = [
  {
    id: "trigger",
    header: "Trigger · 新增高优机会",
    body: [
      "Gmail: 收到 enterprise@nova.com 主题为 'Enterprise Plan inquiry' 的邮件",
      "HubSpot: 自动创建 Deal 并触发 Gate Workflow #deal-sync",
    ],
    status: "processing" as const,
  },
  {
    id: "orchestrate",
    header: "Gate Orchestrator",
    body: [
      "选择 Claude Sonnet 分析客户诉求",
      "生成会议纪要，并在 Slack #sales 创建行动任务",
      "通过 n8n 调用 Notion CRM 模板",
    ],
    status: "processing" as const,
  },
  {
    id: "result",
    header: "Result · 回写完成",
    body: [
      "Slack: @sales-team 新机会，时间线已同步",
      "Notion: 触发自动化 Pipeline，负责人 Lily",
      "数据面板已记录 ROI 指标",
    ],
    status: "done" as const,
  },
];

export function LiveDemoPanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % demoScripts.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const active = demoScripts[index];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.32em] text-white/50">
            Real-time demo
          </p>
          <h3 className="text-3xl font-semibold text-white md:text-[2.5rem] md:leading-[1.15]">
            Gate 让智能体与 n8n 无缝协同
          </h3>
          <p className="text-base text-white/65">
            只需给出目标，Gate 会识别上下文、匹配模型与自动化节点。所有执行步骤可回放、可审计，并自动回写到你的系统里。
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Clock className="h-4 w-4" /> 平均上线时间 &lt; 7 天
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <CheckCircle2 className="h-4 w-4" /> 成功率 99.3%
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#0E1628]/80 p-6 text-sm backdrop-blur-xl shadow-[0_30px_80px_rgba(13,18,30,0.6)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6E61FF]/30 via-transparent to-[#4DD8FF]/20" />
          <div className="relative flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/50">
            Gate Terminal
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px]">
              Agent Runtime
            </span>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4 px-6 py-6"
              >
                <div className="flex items-center justify-between text-white">
                  <p className="text-base font-semibold">{active.header}</p>
                  {active.status === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-[#5BE4AC]" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-[#6E8CFF]" />
                  )}
                </div>
                <div className="space-y-2 text-sm text-white/70">
                  {active.body.map((line) => (
                    <div key={line} className="rounded-lg bg-white/[0.04] px-4 py-3">
                      {line}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
