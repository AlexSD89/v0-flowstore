import { notFound } from 'next/navigation'
import SolutionDetailClient from "./solution-detail-client"

export async function generateStaticParams() {
  return [
    { id: "ai-sdr-outbound" },
    { id: "linkedin-prospecting" },
    { id: "lead-scoring-system" },
    { id: "customer-insights-ai" },
    { id: "sales-email-automation" },
    { id: "contract-automation" },
    { id: "finance-approval" },
    { id: "sales-pipeline-monitor" },
    { id: "compliance-monitoring" },
    { id: "sales-commission" },
  ]
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const validIds = [
    "ai-sdr-outbound",
    "linkedin-prospecting",
    "lead-scoring-system",
    "customer-insights-ai",
    "sales-email-automation",
    "contract-automation",
    "finance-approval",
    "sales-pipeline-monitor",
    "compliance-monitoring",
    "sales-commission",
  ]

  if (!validIds.includes(id)) {
    notFound()
  }

  return <SolutionDetailClient solutionId={id} />
}
