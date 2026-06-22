"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnergyStream } from "@/components/energy-stream"
import { DashboardCard } from "@/components/dashboard-card"
import { TextReveal } from "@/components/text-reveal"

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const streamY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const streamScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-28 pb-16"
    >
      {/* layered background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklch,var(--emerald)_22%,transparent),transparent_60%)]" />
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-[0.07] [background-image:linear-gradient(to_right,var(--neon)_1px,transparent_1px),linear-gradient(to_bottom,var(--neon)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <motion.div
        style={{ y: streamY, scale: streamScale }}
        className="absolute inset-0 z-[1]"
      >
        <EnergyStream />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
        <motion.div style={{ y: contentY, opacity: contentOpacity }}>
          <motion.a
            href="#features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--emerald)_50%,transparent_100%)] opacity-80" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-background px-4 py-1.5 backdrop-blur-3xl transition-all group-hover:bg-background/80">
              <Sparkles className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400/90">AI-native workflow automation</span>
              <ArrowRight className="size-3.5 text-emerald-400/80 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.a>

          <TextReveal
            as="h1"
            text="Workflows Unified. Infinite Focus with SR Technology."
            highlights={["Infinite", "Focus"]}
            delay={0.08}
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.18 }}
            className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            SR Technology fuses your tools, tasks, and AI agents into one
            spatial workspace—so deep focus and real progress happen
            automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.28 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" className="h-14 rounded-full px-8 text-base shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.7)]" asChild>
              <a href="/sign-up">
                Get Started <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 rounded-full border-white/10 bg-white/5 px-8 text-base backdrop-blur-xl hover:bg-white/10" asChild>
              <a href="#features">
                Explore Features
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
          >
            <span>
              <span className="text-glow font-semibold text-foreground">
                12,000+
              </span>{" "}
              teams
            </span>
            <span className="h-4 w-px bg-border" />
            <span>
              <span className="text-glow font-semibold text-foreground">
                99.99%
              </span>{" "}
              uptime
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <DashboardCard />
        </motion.div>
      </div>
    </section>
  )
}
