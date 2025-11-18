"use client"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { GateWorkflow } from "@/components/gate-workflow"
import { UsecaseTabs } from "@/components/usecase-tabs"
import { LogoMarquee } from "@/components/logo-marquee"
import { GateArchitectureTree } from "@/components/gate-architecture-tree"
import { InstallOptions } from "@/components/install-options"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { StatsShowcase } from "@/components/stats-showcase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("gate_onboarding_completed")
    if (!hasCompletedOnboarding) {
      router.push("/start")
    }
  }, [router])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <StatsShowcase />
      <GateWorkflow />
      <UsecaseTabs />
      <GateArchitectureTree />
      <LogoMarquee />
      <InstallOptions />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
