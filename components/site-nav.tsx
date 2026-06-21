"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Hexagon, Menu, X, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const links = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
]

export function SiteNav() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
          scrolled ? "glass neon-border shadow-lg shadow-primary/10" : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Hexagon className="size-5" fill="currentColor" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            SR Technology
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-white/5 pl-2 pr-4 py-1.5 transition-all hover:bg-white/10"
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <User className="size-4" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {session.user?.email?.split('@')[0] || "User"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background p-2 shadow-xl glass neon-border">
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                  <div className="h-px w-full bg-border mb-1" />
                  <button 
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link 
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 font-medium text-primary-foreground transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_20px_var(--neon)] hover:bg-primary/90"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-xl border border-border text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass neon-border absolute inset-x-4 top-20 rounded-2xl p-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <Link 
              href="/sign-up"
              className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-xl bg-primary px-4 font-medium text-primary-foreground transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_20px_var(--neon)]"
            >
              Get started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
