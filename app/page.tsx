import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Workflow } from "@/components/workflow"
import { Testimonials } from "@/components/testimonials"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"
import { LogoMarquee } from "@/components/marquee"

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-clip bg-background text-foreground">
      <SiteNav />
      <Hero />
      <LogoMarquee />
      <Features />
      <Workflow />
      <Testimonials />
      <Faq />
      <SiteFooter />
    </main>
  )
}
