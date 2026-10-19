import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TrailInfo — El Paso trails by difficulty",
  description:
    "Search and interactive map of the trails around El Paso, Texas, each scored 0 to 100 on elevation gain, terrain, distance, exposure and self-reliance.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
