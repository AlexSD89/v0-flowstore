import Image from "next/image";
import { testimonials } from "@/data/testimonials";

export function TestimonialSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur md:grid-cols-[1fr_1.2fr] md:p-12">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-white/50">
              Trusted by operators
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              从 0 到 大规模，Gate 伴你完成智能自动化建设
            </h3>
          </div>
          <p className="text-sm text-white/65">
            Gate 将 AI 决策、自动化执行与指标回传串成闭环，帮助企业在 45 天内看到真实产出。以下是我们客户的真实声音。
          </p>
        </div>

        <div className="space-y-8">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white/90"
            >
              <blockquote className="text-lg leading-relaxed text-white">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between text-sm text-white/70">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p>{item.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.26em] text-[#7AD7FF]">
                    {item.metric}
                  </p>
                </div>
                <Image
                  src={item.companyLogo}
                  alt={`${item.name} logo`}
                  width={140}
                  height={50}
                  className="h-10 w-auto"
                />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
