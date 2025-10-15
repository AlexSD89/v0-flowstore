import Image from "next/image";
import { ecosystemLogos } from "@/data/partners";

const duplicated = [...ecosystemLogos, ...ecosystemLogos];

export function LogoMarquee() {
  return (
    <section id="solutions" className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-10 backdrop-blur">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-white/50">
            Works with anything you already use
          </p>
          <h3 className="text-2xl font-semibold text-white md:text-3xl">
            Gate 原生整合 200+ SaaS、Agent 与内部系统
          </h3>
          <p className="mx-auto max-w-3xl text-sm text-white/60">
            再复杂的流程也能与现有系统连接。Gate 通过安全代理对接 API、Webhook、数据库与机器人，把自动化真正带入生产环境。
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {[0, 1].map((row) => (
            <div
              key={row}
              className="pause-marquee group relative overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              tabIndex={0}
              aria-label={row === 0 ? "合作伙伴标识滚动列表" : "合作伙伴标识滚动列表第二行"}
            >
              <div
                className={`marquee flex items-center gap-10 ${
                  row === 1 ? "marquee-reverse" : ""
                }`}
              >
                {duplicated.map((item, index) => (
                  <div
                    key={`${item.name}-${row}-${index}`}
                    className="flex h-12 w-36 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2"
                  >
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={96}
                      height={32}
                      className="max-h-6 w-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
