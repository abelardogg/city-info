import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "TrailInfo — Senderos de El Paso por dificultad",
  description:
    "Buscador y mapa interactivo de los senderos de El Paso, Texas, con una escala de dificultad de 0 a 100 calculada a partir de desnivel, terreno, distancia, exposición y autonomía.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
