"use client"

import { useRef } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { Activity, ArrowUpRight, Cpu, Sparkles, Zap } from "lucide-react"

export function DashboardCard() {
  const ref = useRef<HTMLDivElement>(null)

  // normalized pointer position -0.5..0.5
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const springCfg = { stiffness: 150, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), springCfg)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), springCfg)

  // parallax for inner layers
  const txFar = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), springCfg)
  const tyFar = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), springCfg)
  const txNear = useSpring(useTransform(px, [-0.5, 0.5], [-24, 24]), springCfg)
  const tyNear = useSpring(useTransform(py, [-0.5, 0.5], [-24, 24]), springCfg)

  // glare position
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, color-mix(in oklch, var(--neon) 45%, transparent), transparent 55%)`

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ perspective: 1200 }}
      className="relative w-full max-w-md"
      whileHover={{ scale: 1.03 }}
      transition={springCfg}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass neon-border relative rounded-3xl p-5 shadow-2xl shadow-emerald/20"
      >
        {/* cursor-tracked holographic glare */}
        <motion.div
          aria-hidden
          style={{ background: glare, transform: "translateZ(1px)" }}
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 mix-blend-screen"
        />

        {/* header layer */}
        <motion.div
          style={{ x: txFar, y: tyFar, transform: "translateZ(40px)" }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">Focus Hub</p>
              <p className="text-[11px] text-muted-foreground">Live workspace</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Synced
          </span>
        </motion.div>

        {/* metric layer */}
        <motion.div
          style={{ x: txNear, y: tyNear, transform: "translateZ(70px)" }}
          className="mt-5 rounded-2xl border border-primary/15 bg-background/40 p-4"
        >
          <p className="text-xs text-muted-foreground">Focus throughput</p>
          <div className="mt-1 flex items-end justify-between">
            <p className="text-3xl font-bold text-glow text-foreground">98.4%</p>
            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <ArrowUpRight className="size-3.5" /> +12.6%
            </span>
          </div>
          {/* mini chart */}
          <div className="mt-3 flex h-16 items-end gap-1.5">
            {[42, 60, 38, 72, 55, 84, 66, 92, 78, 96].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary"
              />
            ))}
          </div>
        </motion.div>

        {/* stat tiles layer */}
        <motion.div
          style={{ x: txNear, y: tyNear, transform: "translateZ(55px)" }}
          className="mt-4 grid grid-cols-3 gap-2"
        >
          {[
            { icon: Zap, label: "Tasks", value: "1.2k" },
            { icon: Activity, label: "Flows", value: "37" },
            { icon: Cpu, label: "Agents", value: "08" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-primary/10 bg-background/30 p-2.5"
            >
              <Icon className="size-4 text-primary" />
              <p className="mt-2 text-base font-semibold leading-none">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ambient glow behind card */}
      <div
        aria-hidden
        className="animate-pulse-glow absolute -inset-6 -z-10 rounded-[2rem] bg-primary/25 blur-3xl"
      />
    </motion.div>
  )
}
