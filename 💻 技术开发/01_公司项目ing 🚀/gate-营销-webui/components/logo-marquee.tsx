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
    <section className="section-spacing bg-neutral-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-neutral-600 mb-2">
            深度集成企业常用工具
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex gap-16 animate-marquee">
            {companies.concat(companies).map((company, index) => (
              <div 
                key={`${company.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-20"
              >
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  width={160}
                  height={60}
                  className="h-14 w-auto object-contain opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
