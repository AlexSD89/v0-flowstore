import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { EvaluationFrameworkSection } from '@/components/sections/EvaluationFrameworkSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { CaseStudiesSection } from '@/components/sections/CaseStudiesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* 6-Dimension Evaluation Framework */}
      <EvaluationFrameworkSection />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Case Studies Section */}
      <CaseStudiesSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Blog Section */}
      <BlogSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}