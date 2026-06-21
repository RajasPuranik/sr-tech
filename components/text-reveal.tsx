"use client"

import { motion } from "framer-motion"
import type { ElementType } from "react"

export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
  highlights = [],
}: {
  text: string
  className?: string
  delay?: number
  as?: ElementType
  highlights?: string[]
}) {
  const words = text.split(" ")
  
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span 
          key={i} 
          className="inline-block overflow-hidden pb-1 -mb-1" 
          style={{ verticalAlign: 'bottom' }}
        >
          <motion.span
            className={`inline-block ${
              highlights.some((h) => word.includes(h)) 
                ? "text-primary text-glow" 
                : ""
            }`}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ 
              delay: delay + i * 0.03, 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1] 
            }}
          >
            {word}
          </motion.span>
          <span className="inline-block w-[0.25em]" />
        </span>
      ))}
    </Tag>
  )
}
