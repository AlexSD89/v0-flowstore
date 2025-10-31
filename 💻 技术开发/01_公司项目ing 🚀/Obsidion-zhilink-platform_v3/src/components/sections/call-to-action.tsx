"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CallToActionProps {
  className?: string;
}

export function CallToAction({ className }: CallToActionProps) {
  const handleStartChat = () => {
    console.log("Start chat");
  };

  const handleContactUs = () => {
    console.log("Contact us");
  };

  return (
    <section className={cn("py-20 lg:py-32", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cloudsway-primary-500 via-cloudsway-accent-500 to-cloudsway-secondary-500 p-1"
        >
          <div className="rounded-3xl bg-background-main p-12 text-center lg:p-16">
            <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
              准备开始AI转型了吗？
            </h2>
            <p className="mb-8 text-lg text-text-secondary lg:text-xl">
              让我们的6角色AI专家团队为您量身定制AI解决方案
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="xl"
                onClick={handleStartChat}
                className="group w-full sm:w-auto"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                开始免费咨询
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                variant="secondary"
                size="xl"
                onClick={handleContactUs}
                className="w-full sm:w-auto"
              >
                <Phone className="mr-2 h-5 w-5" />
                联系我们
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-text-muted">
              免费咨询，无需注册，立即体验6角色AI专家协作分析
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}