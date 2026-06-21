"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OceanWaves } from "@/components/ocean-waves"
import { DashboardCard } from "@/components/dashboard-card"
import { TextReveal } from "@/components/text-reveal"
import { WaitlistForm } from "@/components/waitlist-form"

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
      {/* Ocean Waves Background */}
      <motion.div
        style={{ y: streamY, scale: streamScale }}
        className="absolute inset-0 z-0"
      >
        <OceanWaves />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
        <motion.div style={{ y: contentY, opacity: contentOpacity }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="neon-border inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="size-3.5" />
            AI-native workflow automation
          </motion.span>

          <TextReveal
            as="h1"
            text="Workflows Unified. Infinite Focus with SR Technology."
            highlights={["Infinite", "Focus"]}
            delay={0.08}
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-slate-900 drop-shadow-sm"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.18 }}
            className="mt-6 max-w-md text-pretty text-base leading-relaxed text-slate-700 sm:text-lg drop-shadow-sm"
          >
            SR Technology fuses your tools, tasks, and AI agents into one
            spatial workspace—so deep focus and real progress happen
            automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.28 }}
            className="mt-8"
          >
            <WaitlistForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 flex items-center gap-6 text-sm text-slate-600 drop-shadow-sm"
          >
            <span>
              <span className="text-glow font-semibold text-slate-900">
                12,000+
              </span>{" "}
              teams
            </span>
            <span className="h-4 w-px bg-slate-300" />
            <span>
              <span className="text-glow font-semibold text-slate-900">
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
