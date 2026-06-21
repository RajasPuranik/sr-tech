"use client"

import { AtSign, Globe, Hexagon, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

const columns = [
  {
    title: "Product",
    links: ["Features", "Workflow", "Integrations", "Changelog"],
  },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Resources", links: ["Docs", "Community", "Support", "Status"] },
]

const socials = [
  { icon: Share2, label: "X" },
  { icon: Globe, label: "Website" },
  { icon: AtSign, label: "Email" },
  { icon: MessageCircle, label: "Community" },
]

export function SiteFooter() {
  return (
    <footer className="relative mt-12">
      {/* gradient top light line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* final CTA */}
      <div className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="glass neon-border relative overflow-hidden rounded-3xl px-6 py-14 text-center">
          <div
            aria-hidden
            className="animate-pulse-glow absolute left-1/2 top-0 size-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          />
          <h2 className="relative text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready for infinite focus?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            Join 12,000+ teams unifying their workflows with SR
            Technology.
          </p>
          <Button
            size="lg"
            className="relative mt-7 h-12 rounded-xl bg-gradient-to-r from-primary to-emerald px-8 font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50"
          >
            Get started free
          </Button>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Hexagon className="size-5" fill="currentColor" />
              </span>
              <span className="text-base font-semibold">
                SR Technology
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The spatial workspace that unifies your tools and unleashes deep
              focus.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-[0_0_16px_var(--neon)]"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} SR Technology. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#top" className="hover:text-primary">
              Privacy
            </a>
            <a href="#top" className="hover:text-primary">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
