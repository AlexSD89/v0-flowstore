"use client"

import Image from "next/image"

export function LogoMarquee() {
  const companies = [
    { name: "Notion", logo: "/notion-logo.png" },
    { name: "Linear", logo: "/linear-logo.png" },
    { name: "Figma", logo: "/figma-logo.png" },
    { name: "Vercel", logo: "/vercel-logo.png" },
    { name: "Supabase", logo: "/supabase-logo.png" },
    { name: "Framer", logo: "/framer-logo.png" },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden">
          <div className="flex gap-16 animate-marquee items-center">
            {[...companies, ...companies].map((company, index) => (
              <div key={index} className="flex-shrink-0 opacity-40 hover:opacity-60 transition-opacity">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
