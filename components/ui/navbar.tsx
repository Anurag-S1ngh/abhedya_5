"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Link004 } from "./cssLinkButton"
import { InteractiveHoverButton } from "./interactive-hover-button"

const navLinks = [
  { label: "Profile", href: "/" },
  { label: "Game Page", href: "/" },
  { label: "Events", href: "/" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full bg-transparent px-6 py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="px-1 text-lg font-bold tracking-tight uppercase"
        >
          prodyogiki
        </Link>

        {/* Center nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link004
                href={link.href}
                className="text-sm font-medium opacity-90 transition-opacity hover:opacity-100"
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
            className="text-sm font-medium opacity-90 transition-opacity hover:opacity-100"
          >
            Sign Up
          </Link004>
          <Link004
            href="/login"
            className="text-sm font-medium opacity-90 transition-opacity hover:opacity-100"
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
        <div className="mt-3 flex flex-col gap-4 border-t border-white/20 pt-4 md:hidden">
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
            <Link href="/login" className="text-sm font-medium opacity-90">
              Log in
            </Link>
            <Link
              href="/try"
              className="rounded-full border border-white px-5 py-1.5 text-sm font-medium"
            >
              Try now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
