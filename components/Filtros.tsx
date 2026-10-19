"use client"

import { SlidersHorizontal } from "lucide-react"
import { niveles } from "@/lib/escala"
import { zonas } from "@/lib/datos"

export type Orden = "indice-desc" | "indice-asc" | "distancia" | "desnivel"

interface Props {
  activos: string[]
  onNivel: (id: string) => void
  zona: string
  onZona: (zona: string) => void
  orden: Orden
  onOrden: (orden: Orden) => void
  mostrados: number
  total: number
}

const ordenes: { id: Orden; etiqueta: string }[] = [
  { id: "indice-desc", etiqueta: "Hardest first" },
  { id: "indice-asc", etiqueta: "Easiest first" },
  { id: "distancia", etiqueta: "Longest" },
  { id: "desnivel", etiqueta: "Most elevation gain" },
]

export default function Filtros({
  activos,
  onNivel,
  zona,
  onZona,
  orden,
  onOrden,
  mostrados,
  total,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex flex-wrap gap-1.5">
        {niveles.map((nivel) => {
          const encendido = activos.includes(nivel.id)
          return (
            <button
              key={nivel.id}
              onClick={() => onNivel(nivel.id)}
              aria-pressed={encendido}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={{
                color: encendido ? nivel.color : "var(--color-suave)",
                borderColor: encendido ? `${nivel.color}66` : "var(--color-borde)",
                backgroundColor: encendido ? `${nivel.color}1f` : "transparent",
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: encendido ? nivel.color : "var(--color-tenue)" }}
                aria-hidden
              />
              {nivel.etiqueta}
            </button>
          )
        })}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <SlidersHorizontal size={14} className="text-tenue" aria-hidden />
        <select
          value={zona}
          onChange={(evento) => onZona(evento.target.value)}
          aria-label="Filter by area"
          className="rounded-lg border border-borde bg-panel px-2.5 py-1.5 text-xs text-suave outline-none transition-colors hover:text-texto focus:border-acento/60"
        >
          <option value="">All areas</option>
          {zonas.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>

        <select
          value={orden}
          onChange={(evento) => onOrden(evento.target.value as Orden)}
          aria-label="Sort results"
          className="rounded-lg border border-borde bg-panel px-2.5 py-1.5 text-xs text-suave outline-none transition-colors hover:text-texto focus:border-acento/60"
        >
          {ordenes.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>

        <span className="tabular text-xs text-tenue">
          {mostrados} of {total}
        </span>
      </div>
    </div>
  )
}
