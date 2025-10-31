"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TrustedByProps {
  className?: string;
}

export function TrustedBy({ className }: TrustedByProps) {
  // Mock data - replace with real client logos
  const clients = [
    { name: "华为", logo: "/images/clients/huawei.svg" },
    { name: "腾讯", logo: "/images/clients/tencent.svg" },
    { name: "阿里巴巴", logo: "/images/clients/alibaba.svg" },
    { name: "京东", logo: "/images/clients/jd.svg" },
    { name: "字节跳动", logo: "/images/clients/bytedance.svg" },
    { name: "美团", logo: "/images/clients/meituan.svg" },
  ];

  return (
    <section className={cn("py-20", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="mb-8 text-sm font-medium uppercase tracking-wide text-text-muted">
            已服务的知名企业
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex h-16 w-24 items-center justify-center rounded-lg bg-background-glass/30 p-4 backdrop-blur-sm transition-all hover:bg-background-glass/50"
              >
                {/* Placeholder for logo */}
                <div className="text-xs font-medium text-text-secondary">
                  {client.name}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}