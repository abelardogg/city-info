"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Minimize2 } from "lucide-react"
import { niveles, type Ruta } from "@/lib/escala"
import { capas, type CapaId } from "./capas"

const Lienzo = dynamic(() => import("./MapaLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center text-sm text-tenue">
      Loading map…
    </div>
  ),
})

interface Props {
  rutas: Ruta[]
  seleccionada?: string
  onElegir: (ruta: Ruta) => void
  onLimpiarSeleccion: () => void
}

export default function Mapa({ rutas, seleccionada, onElegir, onLimpiarSeleccion }: Props) {
  const [capa, setCapa] = useState<CapaId>("topografico")

  return (
    <div className="panel relative overflow-hidden">
      <div className="h-[58vh] min-h-80 w-full lg:h-[calc(100vh-17rem)]">
        <Lienzo rutas={rutas} seleccionada={seleccionada} capa={capa} onElegir={onElegir} />
      </div>

      <div className="absolute right-3 top-3 z-[800] flex items-center gap-2">
        {seleccionada && (
          <button
            onClick={onLimpiarSeleccion}
            className="flex items-center gap-1.5 rounded-lg border border-borde bg-fondo/90 px-2.5 py-1.5 text-xs text-suave backdrop-blur transition-colors hover:bg-panel-alto hover:text-texto"
          >
            <Minimize2 size={13} aria-hidden />
            Show all trails
          </button>
        )}

        <div className="flex rounded-lg border border-borde bg-fondo/90 p-0.5 backdrop-blur">
          {capas.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => setCapa(opcion.id)}
              aria-pressed={capa === opcion.id}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                capa === opcion.id
                  ? "bg-acento/15 text-acento"
                  : "text-suave hover:bg-panel-alto hover:text-texto"
              }`}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[800] rounded-lg border border-borde bg-fondo/90 px-3 py-2 backdrop-blur">
        <p className="text-[10px] uppercase tracking-[0.16em] text-tenue">Scale</p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {niveles.map((nivel) => (
            <li key={nivel.id} className="flex items-center gap-2 text-[11px] text-suave">
              <span
                className="h-0.5 w-5 rounded-full"
                style={{ backgroundColor: nivel.color }}
                aria-hidden
              />
              {nivel.etiqueta}
              <span className="tabular text-tenue">
                {nivel.desde}
                {nivel.desde === 75 ? "+" : `–${nivel.desde + 24}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
