"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { Reveal, RevealStagger, staggerItem } from "@/components/reveal"

const testimonials = [
  {
    quote:
      "Sam's Technology collapsed five tools into one. Our team ships twice as fast and finally protects deep work.",
    name: "Elena Vasquez",
    role: "VP Engineering, Northwind",
    avatar: "/avatars/avatar-1.png",
  },
  {
    quote:
      "The automation canvas is unreal. I watch tasks flow between systems without lifting a finger.",
    name: "Marcus Lee",
    role: "Staff Engineer, Volt",
    avatar: "/avatars/avatar-2.png",
  },
  {
    quote:
      "It feels like the interface anticipates what I need next. Genuinely the most focused I've ever been.",
    name: "Priya Nair",
    role: "Head of Design, Lumen",
    avatar: "/avatars/avatar-3.png",
  },
  {
    quote:
      "We replaced a fragile stack of scripts with reliable agents. Uptime and morale both went up.",
    name: "David Okafor",
    role: "Founder, Reactor Labs",
    avatar: "/avatars/avatar-4.png",
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24"
    >
      <div
        aria-hidden
        className="animate-pulse-glow absolute left-1/2 top-10 -z-10 size-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="neon-border inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Loved by builders
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Teams in deep focus, shipping real progress
          </h2>
        </Reveal>

        <RevealStagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <motion.figure
              key={t.name}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="glass neon-border relative rounded-2xl p-6"
            >
              <Quote className="size-7 text-primary/60" />
              <blockquote className="mt-4 text-pretty text-base leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="relative size-11 overflow-hidden rounded-full ring-2 ring-primary/40">
                  <Image
                    src={t.avatar || "/placeholder.svg"}
                    alt={`Portrait of ${t.name}`}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}
