"use client"

import { Mountain, Route, Clock } from "lucide-react"
import { indice, nivelDe, type Ruta } from "@/lib/escala"
import { resaltar } from "@/lib/busqueda"

interface Props {
  rutas: Ruta[]
  seleccionada?: string
  consulta: string
  onElegir: (ruta: Ruta) => void
}

export default function ListaRutas({ rutas, seleccionada, consulta, onElegir }: Props) {
  if (!rutas.length) {
    return (
      <div className="panel flex flex-col items-center gap-1 px-6 py-12 text-center">
        <p className="text-sm text-suave">No trail matches your search.</p>
        <p className="text-xs text-tenue">Try another word or drop one of the filters.</p>
      </div>
    )
  }

  return (
    <ul className="panel divide-y divide-borde overflow-hidden">
      {rutas.map((ruta) => {
        const puntaje = indice(ruta)
        const nivel = nivelDe(puntaje)
        const elegida = ruta.id === seleccionada
        const [antes, medio, despues] = resaltar(ruta.nombre, consulta)

        return (
          <li key={ruta.id}>
            <button
              onClick={() => onElegir(ruta)}
              aria-current={elegida}
              className={`flex w-full items-start gap-4 border-l-2 px-4 py-3.5 text-left transition-colors hover:bg-panel-alto ${
                elegida ? "border-l-acento bg-panel-alto" : "border-l-transparent"
              }`}
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">
                  {antes}
                  <mark className="bg-transparent text-acento underline decoration-acento/40 underline-offset-2">
                    {medio}
                  </mark>
                  {despues}
                </h3>
                <p className="mt-0.5 truncate text-xs text-tenue">
                  {ruta.zona} · {ruta.tipo}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-suave">
                  <span className="flex items-center gap-1.5">
                    <Route size={13} className="text-tenue" aria-hidden />
                    <span className="tabular">{ruta.distanciaKm} km</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mountain size={13} className="text-tenue" aria-hidden />
                    <span className="tabular">{ruta.desnivelM} m</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-tenue" aria-hidden />
                    <span className="tabular">{ruta.horas} h</span>
                  </span>
                </div>
              </div>

              <div className="flex w-20 shrink-0 flex-col items-end gap-1.5">
                <span
                  className="tabular text-2xl font-semibold leading-none"
                  style={{ color: nivel.color }}
                >
                  {puntaje}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: nivel.color }}
                >
                  {nivel.etiqueta}
                </span>
                <span className="h-1 w-full overflow-hidden rounded-full bg-texto/10">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${puntaje}%`, backgroundColor: nivel.color }}
                  />
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
