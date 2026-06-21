"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { joinWaitlist } from "@/app/actions/waitlist"
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    
    const formData = new FormData()
    formData.append("email", email)
    
    const result = await joinWaitlist(formData)
    
    if (result.error) {
      setStatus("error")
      setErrorMessage(result.error)
    } else {
      setStatus("success")
      setEmail("")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-12 relative z-20">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
          >
            <div className="p-3 bg-emerald-500/20 rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-emerald-300">You're on the list!</p>
              <p className="text-sm mt-1 opacity-80">Keep an eye on your inbox for early access.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            onSubmit={onSubmit} 
            className="relative flex items-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-emerald-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <input
              suppressHydrationWarning
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              placeholder="Enter your work email"
              required
              className="w-full px-6 py-4 pr-16 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-xl transition-all shadow-2xl"
              disabled={status === "loading"}
            />
            
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="absolute right-2 p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] hover:shadow-[0_0_30px_rgba(var(--primary),0.8)]"
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      
      {status === "error" && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-0 w-full text-sm font-medium text-destructive text-center"
        >
          {errorMessage}
        </motion.p>
      )}
    </div>
  )
}
