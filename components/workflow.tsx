"use client"

import { motion } from "framer-motion"
import { Boxes, Calendar, Cpu, Database, FileText, Mail, MessageSquare } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { TextReveal } from "@/components/text-reveal"

const VW = 1000
const VH = 520
const CORE = { x: VW / 2, y: VH / 2 }
const CORE_R = 60

const nodes = [
  { icon: Mail, label: "Email", x: 130, y: 90 },
  { icon: MessageSquare, label: "Chat", x: 870, y: 90 },
  { icon: Calendar, label: "Calendar", x: 130, y: 260.01 },
  { icon: Boxes, label: "Apps", x: 870, y: 260.01 },
  { icon: Database, label: "Data", x: 130, y: 430 },
  { icon: FileText, label: "Docs", x: 870, y: 430 },
]

// Build a smooth cubic from the node toward the core, stopping exactly at the
// core's edge so every line visibly plugs into the central hub.
function connection(n: { x: number; y: number }) {
  const dx = CORE.x - n.x
  const dy = CORE.y - n.y
  const dist = Math.hypot(dx, dy)
  // endpoint sits on the core circle edge (slightly inside for overlap)
  const ex = CORE.x - (dx / dist) * (CORE_R - 4)
  const ey = CORE.y - (dy / dist) * (CORE_R - 4)
  // horizontal-leaning control points for an elegant S-curve
  const c1x = n.x + dx * 0.45
  const c1y = n.y
  const c2x = ex - dx * 0.28
  const c2y = ey
  return { path: `M ${n.x} ${n.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`, ex, ey }
}

export function Workflow() {
  return (
    <section id="workflow" className="relative mx-auto max-w-6xl px-4 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="neon-border inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          The ecosystem
        </span>
        <TextReveal
          as="h2"
          text="Built for Deep Focus. Designed for Real Progress."
          className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl"
        />
        <p className="mt-4 text-pretty text-muted-foreground">
          Every tool you use connects through a living core—energy flows where
          the work needs to go.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <div className="glass neon-border relative overflow-hidden rounded-3xl p-4 sm:p-8">
          <div
            aria-hidden
            className="animate-pulse-glow absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
          />

          {/* aspect-locked stage so SVG coords and node overlays align exactly */}
          <div className="relative mx-auto aspect-[1000/520] w-full">
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Diagram showing six integrations connected to a central SR Technology core with energy flowing between them"
            >
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="var(--neon)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.35" />
                </linearGradient>
                <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="var(--card)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--card)" stopOpacity="0.95" />
                </radialGradient>
              </defs>

              {nodes.map((n, i) => {
                const { path, ex, ey } = connection(n)
                return (
                  <g key={`path-${i}`}>
                    {/* faint full track */}
                    <path
                      d={path}
                      fill="none"
                      stroke="url(#line-grad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* traveling energy pulse */}
                    <path
                      d={path}
                      fill="none"
                      stroke="var(--neon)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray="14 260"
                      vectorEffect="non-scaling-stroke"
                      style={{
                        animation: `dash-flow ${3 + (i % 3)}s linear infinite`,
                        animationDelay: `${i * 0.5}s`,
                        filter: "drop-shadow(0 0 6px var(--neon))",
                      }}
                    />
                    {/* endpoint node at core edge */}
                    <circle
                      cx={ex}
                      cy={ey}
                      r="5"
                      fill="var(--neon)"
                      vectorEffect="non-scaling-stroke"
                      style={{ filter: "drop-shadow(0 0 6px var(--neon))" }}
                    />
                  </g>
                )
              })}

              {/* central core */}
              <circle cx={CORE.x} cy={CORE.y} r={CORE_R} fill="url(#core-grad)" />
              <circle
                cx={CORE.x}
                cy={CORE.y}
                r={CORE_R}
                fill="none"
                stroke="var(--neon)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={{ filter: "drop-shadow(0 0 16px var(--neon))" }}
              />
              <circle
                cx={CORE.x}
                cy={CORE.y}
                r={CORE_R + 10}
                fill="none"
                stroke="var(--neon)"
                strokeWidth="1.5"
                strokeDasharray="6 12"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
                style={{
                  transformOrigin: `${CORE.x}px ${CORE.y}px`,
                  animation: "spin-slow 16s linear infinite",
                }}
              />
            </svg>

            {/* central core icon overlay */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald text-primary-foreground shadow-lg shadow-primary/40">
                <Cpu className="size-6" />
              </span>
              <span className="mt-1 text-[11px] font-semibold text-primary">Core</span>
            </div>

            {/* node icons positioned in the SAME coordinate space as the SVG */}
            {nodes.map((n, i) => (
              <motion.div
                key={`node-${i}`}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 200 }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{
                  left: `${(n.x / VW) * 100}%`,
                  top: `${(n.y / VH) * 100}%`,
                }}
              >
                <span className="glass neon-border flex size-11 items-center justify-center rounded-xl text-primary shadow-[0_0_0_transparent] sm:size-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_30px_var(--neon-soft)] cursor-default">
                  <n.icon className="size-5" />
                </span>
                <span className="mt-1 text-[11px] text-muted-foreground">
                  {n.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
