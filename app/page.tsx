import { SiteNav } from '@/components/site-nav'
import { HeroSection } from '@/components/hero-section'
import { ProblemSection } from '@/components/problem-section'
import { JourneySection } from '@/components/journey-section'
import { ToolsSection } from '@/components/tools-section'
import { TreatmentsSection } from '@/components/treatments-section'
import { ProofSection } from '@/components/proof-section'
import { BookSection } from '@/components/book-section'
import { WhatsappFloat } from '@/components/whatsapp-float'

export default function Page() {
  return <><SiteNav /><main><HeroSection /><ProblemSection /><JourneySection /><ToolsSection /><TreatmentsSection /><ProofSection /><BookSection /></main><WhatsappFloat /></>
}
