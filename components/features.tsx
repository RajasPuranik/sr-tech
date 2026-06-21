"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  transform,
  useMotionValueEvent,
} from "framer-motion"
import { Bot, GitBranch, Layers, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "Autonomous Agents",
    desc: "Deploy AI agents that triage, route, and complete repetitive work across every connected tool in your stack.",
  },
  {
    icon: Layers,
    title: "Unified Workspace",
    desc: "Tasks, docs, and data live in one spatial surface—no more tab-switching or fractured context.",
  },
  {
    icon: GitBranch,
    title: "Visual Automations",
    desc: "Compose multi-step workflows on an illuminated canvas and watch energy pulse through every connection.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    desc: "SOC 2 Type II, end-to-end encryption, and granular access controls keep your focus—and data—protected.",
  },
]

const cardTimings = [
  { in: [0.10, 0.16], out: [0.28, 0.35] },
  { in: [0.32, 0.38], out: [0.50, 0.58] },
  { in: [0.54, 0.60], out: [0.72, 0.80] },
  { in: [0.76, 0.82], out: [1, 1] }, // Last card stays
]

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  // Morph Sequence: 0.0 to 0.16 (Finishes exactly as section sticks to top)
  const morphProgress = useTransform(scrollYProgress, [0, 0.16], [0, 1])

  const pillWidth = useMotionTemplate`calc(130px + (min(100vw - 32px, 1024px) - 130px) * ${morphProgress})`
  const pillHeight = useMotionTemplate`calc(32px + (75vh - 32px) * ${morphProgress})`
  const pillRadius = useMotionTemplate`calc(999px + (40px - 999px) * ${morphProgress})`

  const pillTextOpacity = useTransform(scrollYProgress, (v) =>
    transform(v, [0, 0.05], [1, 0])
  )

  // Liquid SVG Distortion Scale
  const distortionAmount = useTransform(scrollYProgress, (v) =>
    transform(
      v,
      [0.25, 0.33, 0.40, 0.48, 0.55, 0.62, 0.70, 0.77, 0.84],
      [0, 50, 0, 0, 50, 0, 0, 50, 0]
    )
  )

  // Manually update SVG attribute to bypass Framer Motion's transform scale interceptor
  useMotionValueEvent(distortionAmount, "change", (latest) => {
    if (displacementRef.current) {
      displacementRef.current.setAttribute("scale", latest.toString())
    }
  })

  // The Sweeping Wave X Position
  const waveX = useTransform(scrollYProgress, (v) =>
    transform(
      v,
      [0.25, 0.40, 0.48, 0.62, 0.70, 0.84],
      ["-150%", "150%", "-150%", "150%", "-150%", "150%"]
    )
  )

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative w-full h-[500vh] bg-background"
    >
      {/* Invisible SVG Filter Definition */}
      <svg className="pointer-events-none absolute h-0 w-0">
        <filter id="liquid-distortion" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.05"
            numOctaves="1"
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-start pt-24 sm:pt-32 overflow-hidden">
        {/* The Morphing Backdrop */}
        <motion.div
          style={{
            width: pillWidth,
            height: pillHeight,
            borderRadius: pillRadius,
          }}
          className="glass neon-border relative flex flex-col items-center justify-center overflow-hidden bg-background/80 shadow-2xl backdrop-blur-xl"
        >
          {/* Inner ambient glow that slowly rotates */}
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/20 blur-[80px]"
          />

          {/* Intro Text (The Pill) */}
          <motion.span
            style={{ opacity: pillTextOpacity }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap text-xs font-medium text-primary"
          >
            Capabilities
          </motion.span>

          {/* Feature Cards overlay */}
          {features.map((f, i) => {
            const timing = cardTimings[i]
            const isFirst = i === 0
            const isLast = i === features.length - 1

            const opacityInput = isLast ? timing.in : [...timing.in, ...timing.out]
            const opacityOutput = isLast ? [0, 1] : [0, 1, 1, 0]

            const blurInput = isLast ? timing.in : [...timing.in, ...timing.out]
            const blurOutput = isFirst
              ? [0, 0, 0, 10]
              : isLast
                ? [10, 0]
                : [10, 0, 0, 10]

            const scaleInput = isLast ? timing.in : [...timing.in, ...timing.out]
            const scaleOutput = isFirst
              ? [1, 1, 1, 1.1]
              : isLast
                ? [0.9, 1]
                : [0.9, 1, 1, 1.1]

            // Bypass WAAPI to guarantee no offset/string parsing crashes
            const opacity = useTransform(scrollYProgress, (v) =>
              transform(v, opacityInput, opacityOutput)
            )
            const blurRaw = useTransform(scrollYProgress, (v) =>
              transform(v, blurInput, blurOutput)
            )
            const scale = useTransform(scrollYProgress, (v) =>
              transform(v, scaleInput, scaleOutput)
            )

            // Force repaint when distortion changes so Safari doesn't cache the SVG
            const rippleForce = useMotionTemplate`${distortionAmount}`
            const filter = useMotionTemplate`blur(${blurRaw}px) url(#liquid-distortion)`

            return (
              <motion.div
                key={f.title}
                style={
                  {
                    opacity,
                    filter,
                    scale,
                    "--ripple": rippleForce,
                  } as any
                }
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center sm:p-16"
              >
                <span className="relative z-10 mb-8 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-emerald text-primary-foreground shadow-[0_0_60px_var(--neon-soft)] sm:mb-10 sm:size-24">
                  <f.icon className="size-10 sm:size-12" />
                </span>
                <h3 className="relative z-10 text-3xl font-bold sm:text-5xl lg:text-6xl">
                  {f.title}
                </h3>
                <p className="relative z-10 mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:mt-8 sm:text-2xl">
                  {f.desc}
                </p>
              </motion.div>
            )
          })}

          {/* The Sweeping Physical Wave */}
          <motion.div
            style={{ x: waveX }}
            className="pointer-events-none absolute inset-y-0 z-20 flex w-full"
          >
            {/* The tail of the wave */}
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent to-primary/40 blur-3xl mix-blend-screen" />
            {/* The sharp crest of the wave */}
            <div className="h-full w-12 skew-x-[20deg] bg-white/40 blur-[4px]" />
            <div className="h-full w-24 skew-x-[20deg] bg-cyan-400/20 blur-xl" />
            {/* The front glow */}
            <div className="h-full w-1/2 bg-gradient-to-l from-transparent to-primary/20 blur-3xl mix-blend-screen" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
