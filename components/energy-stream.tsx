"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  vy: number
  vx: number
  size: number
  life: number
  maxLife: number
  hue: number
}

export function EnergyStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let centerX = 0
    let raf = 0
    let t = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles: Particle[] = []

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      centerX = width * 0.5
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const spawn = () => {
      const fromTop = Math.random() > 0.5
      particles.push({
        x: centerX + (Math.random() - 0.5) * width * 0.16,
        y: fromTop ? -20 : height + 20,
        vy: (fromTop ? 1 : -1) * (0.6 + Math.random() * 1.6),
        vx: (Math.random() - 0.5) * 0.5,
        size: 0.6 + Math.random() * 2.4,
        life: 0,
        maxLife: 200 + Math.random() * 220,
        hue: 200 + Math.random() * 30,
      })
    }

    const draw = () => {
      t += 0.01
      ctx.clearRect(0, 0, width, height)

      // Aurora ribbon system — several intertwining strands of light that
      // braid around the vertical axis for an elegant, alive look.
      const segments = 90
      ctx.save()
      ctx.globalCompositeOperation = "lighter"

      // shared sway so the whole ribbon body drifts together
      const bodyAt = (p: number) =>
        Math.sin(p * 2.2 + t * 0.9) * width * 0.05 +
        Math.sin(p * 4.6 - t * 0.6) * width * 0.018

      // soft volumetric haze behind the ribbons
      const haze = ctx.createLinearGradient(0, 0, 0, height)
      haze.addColorStop(0, "hsla(200,100%,65%,0)")
      haze.addColorStop(0.5, "hsla(210,100%,60%,0.10)")
      haze.addColorStop(1, "hsla(220,100%,58%,0)")
      ctx.beginPath()
      for (let i = 0; i <= segments; i++) {
        const p = i / segments
        const x = centerX + bodyAt(p)
        if (i === 0) ctx.moveTo(x, p * height)
        else ctx.lineTo(x, p * height)
      }
      ctx.strokeStyle = haze
      ctx.lineWidth = Math.max(120, width * 0.16)
      ctx.lineCap = "round"
      ctx.shadowBlur = 80
      ctx.shadowColor = "hsla(210,100%,55%,0.6)"
      ctx.stroke()

      // individual flowing strands, each phase-shifted to braid the beam
      const strands = [
        { phase: 0, amp: 30, hue: 195, w: 7, a: 0.5 },
        { phase: 1.9, amp: 22, hue: 210, w: 5, a: 0.45 },
        { phase: 3.6, amp: 38, hue: 220, w: 4, a: 0.4 },
        { phase: 5.2, amp: 16, hue: 200, w: 3, a: 0.5 },
      ]
      for (const s of strands) {
        ctx.beginPath()
        for (let i = 0; i <= segments; i++) {
          const p = i / segments
          const braid = Math.sin(p * 7 + t * 1.6 + s.phase) * s.amp
          const x = centerX + bodyAt(p) + braid
          if (i === 0) ctx.moveTo(x, p * height)
          else ctx.lineTo(x, p * height)
        }
        const g = ctx.createLinearGradient(0, 0, 0, height)
        g.addColorStop(0, `hsla(${s.hue},100%,72%,0)`)
        g.addColorStop(0.5, `hsla(${s.hue},100%,70%,${s.a})`)
        g.addColorStop(1, `hsla(${s.hue + 24},100%,64%,0)`)
        ctx.strokeStyle = g
        ctx.lineWidth = s.w
        ctx.lineCap = "round"
        ctx.shadowBlur = 28
        ctx.shadowColor = `hsla(${s.hue},100%,60%,0.9)`
        ctx.stroke()
      }

      // luminous inner core thread
      ctx.beginPath()
      for (let i = 0; i <= segments; i++) {
        const p = i / segments
        const x = centerX + bodyAt(p) + Math.sin(p * 7 + t * 1.6) * 6
        if (i === 0) ctx.moveTo(x, p * height)
        else ctx.lineTo(x, p * height)
      }
      const core = ctx.createLinearGradient(0, 0, 0, height)
      core.addColorStop(0, "hsla(200,100%,92%,0)")
      core.addColorStop(0.5, "hsla(210,100%,95%,0.8)")
      core.addColorStop(1, "hsla(220,100%,88%,0)")
      ctx.strokeStyle = core
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.shadowBlur = 18
      ctx.shadowColor = "hsla(210,100%,85%,1)"
      ctx.stroke()
      ctx.restore()

      // particles
      if (!reduce) {
        if (particles.length < 140 && Math.random() > 0.2) spawn()
        if (particles.length < 140 && Math.random() > 0.2) spawn()
      }

      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i]
        pt.life++
        pt.y += pt.vy
        pt.x += pt.vx + Math.sin((pt.y + t * 60) * 0.01) * 0.4
        const lifeRatio = pt.life / pt.maxLife
        const fade = Math.sin(lifeRatio * Math.PI)
        if (pt.life >= pt.maxLife) {
          particles.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.fillStyle = `hsla(${pt.hue}, 100%, 70%, ${fade * 0.9})`
        ctx.shadowBlur = 12
        ctx.shadowColor = `hsla(${pt.hue}, 100%, 60%, ${fade})`
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
