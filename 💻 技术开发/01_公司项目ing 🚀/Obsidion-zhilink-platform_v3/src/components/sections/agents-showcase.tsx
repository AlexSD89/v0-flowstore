"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { AGENTS, AGENT_ICONS, type AgentRole } from "@/constants/agents";
import { cn } from "@/lib/utils";

interface AgentsShowcaseProps {
  className?: string;
}

export function AgentsShowcase({ className }: AgentsShowcaseProps) {
  const [activeAgent, setActiveAgent] = React.useState<AgentRole>("alex");

  const agentKeys = Object.keys(AGENTS) as AgentRole[];

  return (
    <section className={cn("py-20 lg:py-32", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl"
          >
            6角色AI专家团队
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-text-secondary lg:text-xl"
          >
            每位AI专家都拥有独特的专业领域和分析视角，
            <br className="hidden sm:block" />
            协作为您提供全面、深入的AI解决方案分析
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Agent Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agentKeys.map((agentKey, index) => {
              const agent = AGENTS[agentKey];
              const Icon = AGENT_ICONS[agentKey];
              const isActive = activeAgent === agentKey;

              return (
                <motion.div
                  key={agentKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group relative cursor-pointer rounded-2xl border p-6 transition-all duration-300",
                    isActive
                      ? "border-border-accent bg-background-glass/80 shadow-lg shadow-black/10"
                      : "border-border-primary bg-background-glass/40 hover:border-border-accent hover:bg-background-glass/60"
                  )}
                  onClick={() => setActiveAgent(agentKey)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Agent Avatar */}
                  <div className="mb-4 flex items-center justify-center">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300",
                        isActive && "shadow-xl"
                      )}
                      style={{
                        background: `linear-gradient(135deg, ${agent.color.primary}, ${agent.color.dark})`,
                        boxShadow: isActive 
                          ? `0 0 30px ${agent.color.primary}30`
                          : `0 8px 25px ${agent.color.primary}20`,
                      }}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="text-center">
                    <h3 className="mb-1 font-semibold text-text-primary">
                      {agent.name}
                    </h3>
                    <p className="mb-2 text-xs text-text-muted">
                      {agent.role}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {agent.speciality}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cloudsway-primary-500/20 to-cloudsway-accent-500/20 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Agent Detail Panel */}
          <motion.div
            key={activeAgent}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border-primary bg-background-glass/60 p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-4">
              {/* Avatar */}
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${AGENTS[activeAgent].color.primary}, ${AGENTS[activeAgent].color.dark})`,
                }}
              >
                {React.createElement(AGENT_ICONS[activeAgent], { className: "h-8 w-8" })}
              </div>

              {/* Basic Info */}
              <div>
                <h3 className="mb-1 text-xl font-bold text-text-primary">
                  {AGENTS[activeAgent].name}
                </h3>
                <p className="text-sm font-medium text-text-secondary">
                  {AGENTS[activeAgent].role}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-semibold text-text-primary">专业描述</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {AGENTS[activeAgent].description}
              </p>
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-text-primary">核心能力</h4>
              <div className="flex flex-wrap gap-2">
                {AGENTS[activeAgent].strengths.map((strength) => (
                  <span
                    key={strength}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={{
                      borderColor: `${AGENTS[activeAgent].color.primary}30`,
                      backgroundColor: `${AGENTS[activeAgent].color.primary}10`,
                      color: AGENTS[activeAgent].color.primary,
                    }}
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-semibold text-text-primary">工作经验</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {AGENTS[activeAgent].experience}
              </p>
            </div>

            {/* Approach */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-text-primary">分析方法</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                {AGENTS[activeAgent].approach}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Collaboration Flow Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="rounded-2xl border border-border-primary bg-background-glass/40 p-8 backdrop-blur-xl">
            <h3 className="mb-4 text-center text-lg font-semibold text-text-primary">
              协作流程
            </h3>
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              {agentKeys.map((agentKey, index) => (
                <React.Fragment key={agentKey}>
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white text-sm font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${AGENTS[agentKey].color.primary}, ${AGENTS[agentKey].color.dark})`,
                    }}
                  >
                    {index + 1}
                  </div>
                  {index < agentKeys.length - 1 && (
                    <div className="h-0.5 w-8 bg-border-primary" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-text-muted">
              6位AI专家按序协作，为您提供全方位的AI解决方案分析
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}