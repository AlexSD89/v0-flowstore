"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Shield, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";

interface FeatureHighlightsProps {
  className?: string;
}

export function FeatureHighlights({ className }: FeatureHighlightsProps) {
  const features = [
    {
      icon: Brain,
      title: "智能协作分析",
      description: "6位AI专家协同工作，多维度分析您的业务需求，提供精准的解决方案推荐",
    },
    {
      icon: Zap,
      title: "48小时交付",
      description: "高效的分析流程和丰富的解决方案库，确保在2天内为您提供完整的分析报告",
    },
    {
      icon: Shield,
      title: "企业级安全",
      description: "严格的数据保护机制和隐私安全措施，确保您的商业信息绝对安全",
    },
    {
      icon: Rocket,
      title: "持续优化",
      description: "基于实施效果和用户反馈，持续优化推荐算法，提升解决方案的匹配度",
    },
  ];

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
            核心优势
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-text-secondary lg:text-xl"
          >
            为什么选择LaunchX智链平台作为您的AI转型伙伴
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cloudsway-primary-500 to-cloudsway-accent-500 text-white shadow-lg transition-transform group-hover:scale-110">
                  <Icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-bold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}