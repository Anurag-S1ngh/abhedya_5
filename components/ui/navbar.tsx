"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Link004 } from "./cssLinkButton"
import { InteractiveHoverButton } from "./interactive-hover-button"
import { Separator } from "./separator"

const navLinks = [
  { label: "Game Page", href: "/game" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Events", href: "https://prody.nith.ac.in/events" },
]

interface NavbarProps {
  dark?: boolean // true = dark text (for light bg pages)
}

export default function Navbar({ dark = false }: NavbarProps) {
  const [open, setOpen] = useState(false)

  const color = dark ? "#1A1A1A" : "#FDECC8"
  const borderColor = dark ? "rgba(26,26,26,0.15)" : "rgba(255,255,255,0.2)"

  return (
    <nav className="w-full bg-transparent px-6 py-4" style={{ color }}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="px-1 text-lg font-bold tracking-tight uppercase"
        >
          Abhedya
        </Link>

        {/* Center nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link004
                href={link.href}
                className="font-medium opacity-90 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link004>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="hidden items-center gap-6 md:flex">
          <Link004
            href="/signup"
            className="font-medium opacity-90 transition-opacity hover:opacity-100"
          >
            Sign Up
          </Link004>
          <Link004
            href="/signin"
            className="font-medium opacity-90 transition-opacity hover:opacity-100"
          >
            Log in
          </Link004>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mt-3 flex flex-col gap-4 rounded-xl border-2 border-[#FF7500]/40 bg-[#FDECC8] px-4 py-4 text-[#1A1A1A] md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium opacity-90"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2">
            <Link href="/signup" className="text-sm font-medium opacity-90">
              Sign Up
            </Link>
            <Separator
              className="border-1 border-orange-400/30"
              orientation="vertical"
            />
            <Link href="/signin" className="text-sm font-medium opacity-90">
              Log in
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
