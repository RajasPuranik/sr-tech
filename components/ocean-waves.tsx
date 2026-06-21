"use client"

import { useEffect, useRef } from "react"

export function OceanWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    let t = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Foam particles
    const particles: { x: number; y: number; life: number; speed: number; size: number }[] = []

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      t += 0.015
      ctx.clearRect(0, 0, width, height)

      // Draw Sand Background
      ctx.fillStyle = "#f3e5d8" // Beautiful light sand color
      ctx.fillRect(0, 0, width, height)

      // The water recedes and advances
      const tide = Math.sin(t * 0.5) * height * 0.15
      const baseWaterY = height * 0.4 + tide

      // Draw multiple layers of water waves
      const layers = [
        { color: "rgba(0, 153, 255, 0.2)", speed: 1.2, amp: 20, offset: 0 },
        { color: "rgba(0, 180, 255, 0.3)", speed: 1.5, amp: 15, offset: 50 },
        { color: "rgba(0, 200, 255, 0.4)", speed: 0.8, amp: 30, offset: 100 },
        { color: "rgba(79, 172, 254, 0.6)", speed: 2.0, amp: 10, offset: 150 },
      ]

      let topWaveY: number[] = new Array(Math.ceil(width / 10) + 1).fill(0)

      layers.forEach((layer, layerIndex) => {
        ctx.beginPath()
        ctx.moveTo(0, 0) // Start at top left (water comes from top)
        ctx.lineTo(0, baseWaterY + layer.offset)

        for (let x = 0; x <= width; x += 10) {
          const wave = Math.sin((x * 0.005) + (t * layer.speed)) * layer.amp
          const y = baseWaterY + layer.offset + wave
          ctx.lineTo(x, y)
          
          if (layerIndex === layers.length - 1) {
             topWaveY[x / 10] = y
          }
        }

        ctx.lineTo(width, 0)
        ctx.fillStyle = layer.color
        ctx.fill()
      })

      // Draw Foam (White Edge)
      ctx.beginPath()
      for (let x = 0; x <= width; x += 10) {
        const y = topWaveY[x / 10]
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 4
      ctx.stroke()

      // Spawn and animate foam bubbles
      if (Math.random() > 0.3) {
        const x = Math.random() * width
        const yBase = topWaveY[Math.floor(x / 10)] || baseWaterY
        particles.push({
          x,
          y: yBase + (Math.random() * 20 - 10),
          life: 1,
          speed: Math.random() * 0.5 + 0.2,
          size: Math.random() * 3 + 1
        })
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.y -= p.speed // bubbles drift slightly into the water
        p.life -= 0.01
        
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }

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
