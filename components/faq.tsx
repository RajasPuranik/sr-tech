"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HelpCircle, Plus } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { TextReveal } from "@/components/text-reveal"

const faqs = [
  {
    q: "How does SR Technology unify my existing tools?",
    a: "Our connectors sync with the apps you already use—email, calendars, databases, and chat—then route everything through a single intelligent core so context never gets lost.",
  },
  {
    q: "Do I need to write code to build automations?",
    a: "No. The visual canvas lets you compose multi-step workflows by connecting glowing nodes. Power users can still drop into code when they want fine-grained control.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We're SOC 2 Type II compliant with end-to-end encryption, granular access controls, and regional data residency options for enterprise teams.",
  },
  {
    q: "Can I try it before committing?",
    a: "Absolutely. Start free with full access to core features—no credit card required. Upgrade only when your team is ready to scale.",
  },
  {
    q: "Does it work across devices?",
    a: "SR Technology is fully responsive and optimized for desktop, tablet, and mobile, so your workflows stay in sync wherever you focus.",
  },
]

function InteractiveAudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ 
    x: -1000, 
    y: -1000, 
    active: false, 
    hoverStr: 0,
    smoothX: 0,
    smoothY: -100
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf: number
    let t = 0
    
    // Increased Canvas size for much bigger visualizer and perfect square
    const size = 600 // logical resolution
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    // Remove the 100% width/height so it's controlled exactly by Tailwind
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2

    const rings = 7
    const segments = 120 // Smoother circle

    const draw = () => {
      t += 0.015
      ctx.clearRect(0, 0, size, size)

      const { x: mx, y: my, active } = mouseRef.current
      
      // Smoother tracking
      const targetHover = active ? 1 : 0
      mouseRef.current.hoverStr += (targetHover - mouseRef.current.hoverStr) * 0.08
      const hoverFactor = mouseRef.current.hoverStr

      if (active) {
        mouseRef.current.smoothX += ((mx - cx) - mouseRef.current.smoothX) * 0.08
        mouseRef.current.smoothY += ((my - cy) - mouseRef.current.smoothY) * 0.08
      }

      let mAngle = Math.atan2(mouseRef.current.smoothY, mouseRef.current.smoothX)
      if (mAngle < 0) mAngle += Math.PI * 2
      
      const mDist = Math.hypot(mouseRef.current.smoothX, mouseRef.current.smoothY)

      // Precompute points for the mesh
      const P: {x: number, y: number, interact: number}[][] = []
      
      for (let r = 0; r < rings; r++) {
        P[r] = []
        // Much larger radii
        const baseR = 100 + r * 12
        
        for (let a = 0; a <= segments; a++) {
          const angle = (a % segments) * (Math.PI * 2) / segments
          
          let aDiff = Math.abs(angle - mAngle)
          if (aDiff > Math.PI) aDiff = Math.PI * 2 - aDiff
          const interact = Math.max(0, 1 - aDiff / (Math.PI / 2.5)) * hoverFactor

          // 3D wireframe flowing math
          const wave1 = Math.sin(angle * 5 + t * 2.5 + r * 0.5)
          const wave2 = Math.cos(angle * 3 - t * 1.5 + r * 0.2)
          const amplitude = 4 + r * 2
          
          // Magnet logic: stretch the wave exactly out to the mouse distance
          // Clamp targetStretch so the total radius NEVER exceeds the canvas boundary (300) minus glow padding
          const maxAllowedStretch = 275 - baseR - amplitude - (r * 5)
          const targetStretch = Math.min(Math.max(15, mDist - baseR), maxAllowedStretch)
          
          const mouseBump = interact * (targetStretch + r * 5)
          
          const radius = baseR + (wave1 + wave2) * amplitude + mouseBump
          
          P[r].push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
            interact
          })
        }
      }

      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      // Vibrant Green/Cyan gradient matching site theme
      let grad: string | CanvasGradient = "hsl(158, 100%, 65%)"
      if (ctx.createConicGradient) {
        grad = ctx.createConicGradient(t * 0.3, cx, cy)
        grad.addColorStop(0, "hsl(158, 90%, 60%)") // primary green
        grad.addColorStop(0.3, "hsl(180, 90%, 60%)") // cyan
        grad.addColorStop(0.7, "hsl(158, 90%, 65%)") // primary green
        grad.addColorStop(1, "hsl(158, 90%, 60%)")
      }
      ctx.strokeStyle = grad

      ctx.globalCompositeOperation = "source-over"
      ctx.lineWidth = 1
      ctx.shadowBlur = 0
      
      // Draw base concentric rings
      ctx.beginPath()
      for (let r = 0; r < rings; r++) {
        ctx.moveTo(P[r][0].x, P[r][0].y)
        for (let a = 1; a <= segments; a++) {
          ctx.lineTo(P[r][a].x, P[r][a].y)
        }
      }
      ctx.stroke()
      
      // Draw base radial lines
      ctx.beginPath()
      for (let a = 0; a < segments; a++) {
        ctx.moveTo(P[0][a].x, P[0][a].y)
        for (let r = 1; r < rings; r++) {
          ctx.lineTo(P[r][a].x, P[r][a].y)
        }
      }
      ctx.stroke()

      // Overdraw glowing segments near mouse
      ctx.globalCompositeOperation = "lighter"
      for (let a = 0; a < segments; a++) {
        const interact = P[0][a].interact
        if (interact > 0.05) {
          ctx.beginPath()
          
          // Radial segment
          ctx.moveTo(P[0][a].x, P[0][a].y)
          for (let r = 1; r < rings; r++) {
            ctx.lineTo(P[r][a].x, P[r][a].y)
          }
          
          // Ring segments
          for (let r = 0; r < rings; r++) {
             ctx.moveTo(P[r][a].x, P[r][a].y)
             ctx.lineTo(P[r][a+1].x, P[r][a+1].y)
          }

          ctx.lineWidth = 1 + interact * 2
          ctx.shadowBlur = interact * 20
          // Tint glow towards a vibrant green
          ctx.shadowColor = "hsl(158, 100%, 60%)"
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute z-10 size-[450px] shrink-0 pointer-events-auto sm:size-[600px]"
      onMouseMove={(e) => {
        const canvas = canvasRef.current
        const rect = canvas?.getBoundingClientRect()
        if (rect && canvas) {
          // Scale from CSS pixels to Canvas internal pixels (600x600)
          const scaleX = 600 / rect.width
          const scaleY = 600 / rect.height
          mouseRef.current = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            active: true,
            hoverStr: mouseRef.current.hoverStr,
            smoothX: mouseRef.current.smoothX,
            smoothY: mouseRef.current.smoothY
          }
        }
      }}
      onMouseLeave={() => {
        mouseRef.current.active = false
      }}
    />
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative mx-auto max-w-6xl px-4 py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* rotating 3D question mark */}
        <Reveal className="order-2 flex justify-center lg:order-1">
          <div className="relative flex h-[400px] w-full items-center justify-center sm:h-[550px] lg:-translate-x-12">
            {/* Halo Auras */}
            <motion.div
              aria-hidden
              className="absolute size-72 rounded-full bg-primary/20 blur-[60px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="absolute size-56 rounded-full bg-cyan/20 blur-[50px]"
              animate={{ scale: [1.15, 1, 1.15], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Interactive Colorful Audio Visualizer */}
            <InteractiveAudioVisualizer />
            <motion.div
              aria-hidden
              animate={{ rotateY: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative"
            >
              <HelpCircle
                className="size-32 text-primary"
                style={{ filter: "drop-shadow(0 0 24px var(--neon))" }}
                strokeWidth={1.2}
              />
            </motion.div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="neon-border inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              FAQ
            </span>
            <TextReveal
              as="h2"
              text="Questions, answered"
              className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl"
            />
          </Reveal>

          <div className="mt-8 flex flex-col gap-3">
            {faqs.map((item, i) => {
              const isOpen = open === i
              return (
                <Reveal key={item.q} delay={i * 0.06}>
                  <div
                    className={`glass overflow-hidden rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_30px_var(--neon-soft)] ${
                      isOpen ? "border-primary/50" : "border-border"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-medium sm:text-base">
                        {item.q}
                      </span>
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary transition-transform duration-300 ${
                          isOpen ? "rotate-45 bg-primary/15" : ""
                        }`}
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
