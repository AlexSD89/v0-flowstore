import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Enterprise", href: "#" },
    { label: "Templates", href: "https://docs.launchx.ai/gate" },
    { label: "Security", href: "#" },
  ],
  company: [
    { label: "Blog", href: "https://blog.launchx.ai" },
    { label: "Careers", href: "https://jobs.launchx.ai" },
    { label: "Contact", href: "mailto:hello@gate.run" },
  ],
  legal: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Trust", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-12">
      <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-12 backdrop-blur md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4 text-sm text-white/70">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2 py-1 text-xs uppercase tracking-[0.24em] text-white/70">
            Gate
          </div>
          <p className="max-w-sm text-base text-white">
            Gate 是 LaunchX 的智能自动化平台，把 AI Agent、n8n 与企业现有工具连接在一起，帮助团队达成指标。
          </p>
          <p className="text-xs text-white/50">© 2025 Gate by LaunchX. All rights reserved.</p>
        </div>
        <div className="grid gap-6 text-sm text-white/70 sm:grid-cols-3">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">
                {section === "product"
                  ? "Product"
                  : section === "company"
                    ? "Company"
                    : "Legal"}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
