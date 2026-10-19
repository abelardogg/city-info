"use client"

import { useMemo, useRef, useState } from "react"
import { List, Map as MapaIcono, Mountain } from "lucide-react"
import Buscador from "@/components/Buscador"
import Ficha from "@/components/Ficha"
import Filtros, { type Orden } from "@/components/Filtros"
import ListaRutas from "@/components/ListaRutas"
import Mapa from "@/components/Mapa"
import { buscar } from "@/lib/busqueda"
import { ciudad, rutas } from "@/lib/datos"
import { indice, nivelDe, niveles, type Ruta } from "@/lib/escala"

type Vista = "lista" | "mapa"

export default function Pagina() {
  const [consulta, setConsulta] = useState("")
  const [activos, setActivos] = useState<string[]>(niveles.map((nivel) => nivel.id))
  const [zona, setZona] = useState("")
  const [orden, setOrden] = useState<Orden>("indice-desc")
  const [seleccionada, setSeleccionada] = useState<string>()
  const [vista, setVista] = useState<Vista>("lista")
  const ficha = useRef<HTMLDivElement>(null)

  const resultados = useMemo(() => {
    const encontradas = buscar(rutas, consulta)
      .filter((ruta) => activos.includes(nivelDe(indice(ruta)).id))
      .filter((ruta) => !zona || ruta.zona === zona)

    const ordenar: Record<Orden, (a: Ruta, b: Ruta) => number> = {
      "indice-desc": (a, b) => indice(b) - indice(a),
      "indice-asc": (a, b) => indice(a) - indice(b),
      distancia: (a, b) => b.distanciaKm - a.distanciaKm,
      desnivel: (a, b) => b.desnivelM - a.desnivelM,
    }

    return [...encontradas].sort(ordenar[orden])
  }, [consulta, activos, zona, orden])

  const elegida = rutas.find((ruta) => ruta.id === seleccionada)

  const elegir = (ruta: Ruta) => {
    setSeleccionada(ruta.id)
    if (window.innerWidth < 1024) {
      requestAnimationFrame(() => ficha.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
    }
  }

  const alternarNivel = (id: string) =>
    setActivos((previos) =>
      previos.includes(id) ? previos.filter((nivel) => nivel !== id) : [...previos, id],
    )

  const limpiarTodo = () => {
    setConsulta("")
    setSeleccionada(undefined)
  }

  const vistas: { id: Vista; etiqueta: string; icono: typeof List }[] = [
    { id: "lista", etiqueta: "Search", icono: List },
    { id: "mapa", etiqueta: "Map", icono: MapaIcono },
  ]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-acento">
            <Mountain size={17} strokeWidth={2.2} aria-hidden />
            <span className="text-base font-semibold tracking-tight">TrailInfo</span>
            <span className="text-xs uppercase tracking-[0.16em] text-tenue">
              {ciudad.nombre}
            </span>
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            Trails by difficulty scale
          </h1>
          <p className="mt-1 max-w-xl text-sm text-suave">
            {rutas.length} routes scored 0 to 100 on elevation gain, terrain, distance,
            exposure and self-reliance.
          </p>
        </div>

        <div className="flex rounded-xl border border-borde bg-panel p-1">
          {vistas.map(({ id, etiqueta, icono: Icono }) => (
            <button
              key={id}
              onClick={() => setVista(id)}
              aria-pressed={vista === id}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                vista === id
                  ? "bg-acento/15 text-acento"
                  : "text-suave hover:bg-panel-alto hover:text-texto"
              }`}
            >
              <Icono size={15} aria-hidden />
              {etiqueta}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <Buscador
          rutas={rutas}
          consulta={consulta}
          onConsulta={setConsulta}
          onElegir={elegir}
          onLimpiar={limpiarTodo}
        />
        <Filtros
          activos={activos}
          onNivel={alternarNivel}
          zona={zona}
          onZona={setZona}
          orden={orden}
          onOrden={setOrden}
          mostrados={resultados.length}
          total={rutas.length}
        />
      </div>

      <main className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        {vista === "lista" ? (
          <ListaRutas
            rutas={resultados}
            seleccionada={seleccionada}
            consulta={consulta}
            onElegir={elegir}
          />
        ) : (
          <Mapa
            rutas={resultados}
            seleccionada={seleccionada}
            onElegir={elegir}
            onLimpiarSeleccion={() => setSeleccionada(undefined)}
          />
        )}

        <div ref={ficha} className="lg:sticky lg:top-6">
          <Ficha
            ruta={elegida}
            onVerMapa={vista === "lista" ? () => setVista("mapa") : undefined}
            onCerrar={() => setSeleccionada(undefined)}
          />
        </div>
      </main>

      <footer className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-borde pt-4 text-xs leading-relaxed text-tenue">
        <p>
          TrailInfo · Distances and elevation gain from public trail sources and park
          data. Map lines are indicative.
        </p>
        <p>Check trail conditions and the forecast before you head out.</p>
      </footer>
    </div>
  )
}
