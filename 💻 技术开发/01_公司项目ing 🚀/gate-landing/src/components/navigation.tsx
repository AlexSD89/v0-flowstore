"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { label: "Marketplace", href: "#usecases" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#cta" },
  { label: "Blog", href: "https://blog.launchx.ai" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setMenuOpen(false);
        }
      };
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }

    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
    >
      <div
        className={clsx(
          "mt-4 flex w-full max-w-6xl items-center justify-between gap-6 rounded-full border border-transparent px-6 py-3 text-sm transition-all duration-300",
          scrolled
            ? "border-[rgba(255,255,255,0.05)] bg-[rgba(12,15,26,0.72)] backdrop-blur-xl shadow-[0_15px_45px_rgba(10,12,22,0.45)]"
            : "bg-transparent"
        )}
      >
        <Link href="#" className="flex items-center gap-2 text-base font-medium">
          <span className="rounded-md bg-gradient-to-r from-[#6E61FF] via-[#7B7BFF] to-[#55E0FF] px-2 py-1 text-xs uppercase tracking-[0.24em] text-slate-50/90">
            Gate
          </span>
          <span className="hidden text-slate-200 sm:inline">智能自动化指挥中心</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-200/90 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-white/100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#login"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white md:inline"
          >
            Sign in
          </Link>
          <Link
            href="#cta"
            data-analytics-id="nav-start"
            className="rounded-full bg-gradient-to-r from-[#7D6BFF] via-[#6A8CFF] to-[#4DD8FF] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(78,141,255,0.45)] transition hover:shadow-[0_14px_40px_rgba(78,141,255,0.55)]"
          >
            Start for free
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          >
            <motion.div
              className="absolute inset-x-4 top-24 space-y-6 rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-8 text-sm text-white shadow-[0_30px_80px_rgba(10,12,24,0.6)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
            >
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-full border border-white/10 px-4 py-3 text-base font-medium text-white/85 transition hover:border-white/30 hover:text-white"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="space-y-3 pt-4">
                <Link
                  href="#login"
                  className="flex w-full justify-center rounded-full border border-white/20 px-4 py-3 text-base font-medium text-white/85 transition hover:border-white hover:text-white"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>
                <Link
                  href="#cta"
                  data-analytics-id="nav-start-mobile"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7D6BFF] via-[#6A8CFF] to-[#4DD8FF] px-4 py-3 text-base font-semibold text-slate-950 shadow-[0_16px_40px_rgba(78,141,255,0.5)] transition hover:shadow-[0_20px_50px_rgba(78,141,255,0.6)]"
                  onClick={closeMenu}
                >
                  Start for free
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
