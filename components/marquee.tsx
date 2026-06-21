"use client"

import { Cpu, Globe, Database, Shield, Zap, Cloud, Box } from "lucide-react"

export function LogoMarquee() {
  const logos = [
    { icon: Cpu, name: "Processor" },
    { icon: Globe, name: "Global" },
    { icon: Database, name: "Data" },
    { icon: Shield, name: "Security" },
    { icon: Zap, name: "Speed" },
    { icon: Cloud, name: "Cloud" },
    { icon: Box, name: "Package" },
  ]
  
  // Double the array to make the infinite scroll seamless
  const repeatedLogos = [...logos, ...logos, ...logos]

  return (
    <div className="w-full overflow-hidden border-y border-border bg-background/50 backdrop-blur-sm py-8 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 z-10 h-full w-[150px] bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-[150px] bg-gradient-to-l from-background to-transparent pointer-events-none" />
      
      <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] gap-16 pr-16 items-center">
        {repeatedLogos.map((logo, i) => (
          <div 
            key={i} 
            className="flex items-center gap-2 text-muted-foreground transition-all duration-300 hover:text-primary hover:scale-110 shrink-0"
          >
            <logo.icon className="size-6" />
            <span className="font-mono text-sm font-semibold tracking-wider uppercase">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
