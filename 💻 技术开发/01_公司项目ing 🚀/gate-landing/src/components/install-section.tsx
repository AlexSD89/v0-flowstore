import Link from "next/link";
import { installOptions } from "@/data/install-options";
import {
  Globe,
  SquareCode,
  Terminal,
  type Icon as LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  globe: Globe,
  "square-code": SquareCode,
  terminal: Terminal,
};

export function InstallSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-white/50">
            Install Gate anywhere
          </p>
          <h3 className="text-3xl font-semibold text-white md:text-[2.5rem] md:leading-[1.15]">
            在用户工作的任何地方唤起 Gate
          </h3>
          <p className="text-base text-white/65">
            通过插件、VSCode 或 CLI，Gate 会贴近现场。在任何终端创建、查看与回滚自动化，确保 AI 的输出真正进入业务运行系统。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {installOptions.map((option) => {
            const Icon = iconMap[option.icon] ?? Globe;
            return (
              <div
                key={option.id}
                className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.05] p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-6 w-6 text-[#8CA7FF]" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="text-lg font-semibold text-white">{option.title}</h4>
                  <p className="text-sm text-white/60">{option.description}</p>
                </div>
                <Link
                  href={option.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#89D4FF] transition hover:text-[#a4e0ff]"
                >
                  {option.action}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
