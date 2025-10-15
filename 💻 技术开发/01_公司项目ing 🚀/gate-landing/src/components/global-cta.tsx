import Link from "next/link";

export function GlobalCta() {
  return (
    <section id="cta" className="mx-auto w-full max-w-5xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[40px] border border-white/15 bg-gradient-to-br from-[#6B5BFF] via-[#4B7DFF] to-[#36D7FF] p-[1px]">
        <div className="relative rounded-[40px] bg-[#0C111F] px-8 py-12 md:px-16 md:py-16">
          <div className="absolute -top-16 right-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="relative space-y-6 text-center">
            <h3 className="text-3xl font-semibold text-white md:text-4xl">
              Connect anything, automate everything
            </h3>
            <p className="mx-auto max-w-2xl text-base text-white/70">
              现在行动，48 小时内获得你的专属自动化蓝图。我们会把 Gate 与现有 n8n 工作流整合，并提供度量指标帮助你衡量 ROI。
            </p>
            <div className="flex flex-col items-center justify-center gap-4 text-sm sm:flex-row">
              <Link
                href="https://calendar.launchx.ai"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(255,255,255,0.25)] transition hover:shadow-[0_24px_70px_rgba(255,255,255,0.32)]"
              >
                Book a demo
              </Link>
              <Link
                href="https://docs.launchx.ai/gate"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white hover:text-white"
              >
                Download starter templates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
