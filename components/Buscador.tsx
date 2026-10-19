"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { buscar, resaltar } from "@/lib/busqueda"
import { indice, type Ruta } from "@/lib/escala"
import Insignia from "./Insignia"

interface Props {
  rutas: Ruta[]
  consulta: string
  onConsulta: (valor: string) => void
  onElegir: (ruta: Ruta) => void
  onLimpiar: () => void
}

export default function Buscador({ rutas, consulta, onConsulta, onElegir, onLimpiar }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const contenedor = useRef<HTMLDivElement>(null)

  const sugerencias = consulta.trim() ? buscar(rutas, consulta).slice(0, 6) : []

  useEffect(() => {
    setActivo(0)
  }, [consulta])

  useEffect(() => {
    const fuera = (evento: MouseEvent) => {
      if (!contenedor.current?.contains(evento.target as Node)) setAbierto(false)
    }
    document.addEventListener("mousedown", fuera)
    return () => document.removeEventListener("mousedown", fuera)
  }, [])

  const elegir = (ruta: Ruta) => {
    onElegir(ruta)
    onConsulta(ruta.nombre)
    setAbierto(false)
  }

  const teclado = (evento: React.KeyboardEvent) => {
    if (evento.key === "Escape") {
      setAbierto(false)
      return
    }
    if (!sugerencias.length) return
    if (evento.key === "ArrowDown") {
      evento.preventDefault()
      setAbierto(true)
      setActivo((previo) => (previo + 1) % sugerencias.length)
    }
    if (evento.key === "ArrowUp") {
      evento.preventDefault()
      setActivo((previo) => (previo - 1 + sugerencias.length) % sugerencias.length)
    }
    if (evento.key === "Enter") {
      evento.preventDefault()
      elegir(sugerencias[activo])
    }
  }

  return (
    <div ref={contenedor} className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-borde bg-panel px-4 py-3 transition-colors focus-within:border-acento/60">
        <Search size={18} className="shrink-0 text-tenue" aria-hidden />
        <input
          value={consulta}
          onChange={(evento) => {
            onConsulta(evento.target.value)
            setAbierto(true)
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={teclado}
          placeholder="Search a trail, area or park…"
          aria-label="Search a trail"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-tenue"
        />
        {consulta && (
          <button
            onClick={() => {
              onLimpiar()
              setAbierto(false)
            }}
            aria-label="Clear search"
            className="shrink-0 rounded-md p-1 text-tenue transition-colors hover:bg-panel-alto hover:text-texto"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {abierto && sugerencias.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-[1200] mt-2 overflow-hidden rounded-xl border border-borde bg-panel shadow-xl shadow-texto/10">
          {sugerencias.map((ruta, posicion) => {
            const [antes, medio, despues] = resaltar(ruta.nombre, consulta)
            return (
              <li key={ruta.id}>
                <button
                  onMouseEnter={() => setActivo(posicion)}
                  onClick={() => elegir(ruta)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                    posicion === activo ? "bg-panel-alto" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm">
                      {antes}
                      <mark className="bg-transparent font-semibold text-acento">{medio}</mark>
                      {despues}
                    </span>
                    <span className="block truncate text-xs text-tenue">
                      {ruta.zona} · {ruta.distanciaKm} km
                    </span>
                  </span>
                  <Insignia puntaje={indice(ruta)} compacta />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
