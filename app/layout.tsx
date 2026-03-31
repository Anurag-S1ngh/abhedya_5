import type { Metadata } from "next"

import PageTransition from "@/components/ui/page-transition"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://prody.nith.ac.in"),
  title: {
    default: "Abhedya | Prodyogiki",
    template: "%s | Abhedya",
  },
  description:
    "Abhedya is Prodyogiki's immersive puzzle hunt experience with live questions, competitive leaderboard standings, and timed gameplay.",
  keywords: [
    "Abhedya",
    "Prodyogiki",
    "NITH",
    "puzzle hunt",
    "treasure hunt",
    "cryptic hunt",
    "leaderboard",
    "event",
  ],
  alternates: {
    canonical: "/abhedya",
  },
  openGraph: {
    type: "website",
    url: "https://prody.nith.ac.in/abhedya",
    title: "Abhedya | Prodyogiki",
    description:
      "Join Abhedya, Prodyogiki's puzzle-driven hunt with timed gameplay and a live leaderboard.",
    siteName: "Abhedya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhedya | Prodyogiki",
    description:
      "Join Abhedya, Prodyogiki's puzzle-driven hunt with timed gameplay and a live leaderboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans")}
    >
      <body>
        <ThemeProvider>
          <PageTransition>{children}</PageTransition>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
