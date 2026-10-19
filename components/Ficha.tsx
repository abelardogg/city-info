"use client"

import { Clock, Map, MapPin, Mountain, Route, Compass } from "lucide-react"
import { desglose, indice, nivelDe, type Ruta } from "@/lib/escala"
import Medidor from "./Medidor"

interface Props {
  ruta?: Ruta
  onVerMapa?: () => void
}

export default function Ficha({ ruta, onVerMapa }: Props) {
  if (!ruta) {
    return (
      <div className="panel flex h-full min-h-56 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
        <Compass size={22} className="text-tenue" aria-hidden />
        <p className="text-sm text-suave">Elige un sendero para ver su ficha.</p>
        <p className="max-w-xs text-xs text-tenue">
          Cada ficha desglosa de dónde sale el índice: cuánto aporta el desnivel, el terreno,
          la distancia, la exposición y la autonomía.
        </p>
      </div>
    )
  }

  const puntaje = indice(ruta)
  const nivel = nivelDe(puntaje)
  const partes = desglose(ruta)

  const datos = [
    { icono: Route, etiqueta: "Distancia", valor: `${ruta.distanciaKm} km` },
    { icono: Mountain, etiqueta: "Desnivel", valor: `${ruta.desnivelM} m` },
    { icono: Clock, etiqueta: "Duración", valor: `${ruta.horas} h` },
    { icono: MapPin, etiqueta: "Recorrido", valor: ruta.tipo },
  ]

  return (
    <article className="panel relieve flex flex-col overflow-hidden">
      <header
        className="border-b border-borde px-5 py-4"
        style={{ backgroundColor: `${nivel.color}0f` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-tight">{ruta.nombre}</h2>
            <p className="mt-1 text-xs text-tenue">
              {ruta.zona} · {ruta.parque}
            </p>
          </div>
          <span
            className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium"
            style={{
              color: nivel.color,
              borderColor: `${nivel.color}55`,
              backgroundColor: `${nivel.color}1f`,
            }}
          >
            {nivel.etiqueta}
          </span>
        </div>
      </header>

      <div className="flex items-center gap-5 px-5 py-5">
        <Medidor puntaje={puntaje} />
        <div className="min-w-0">
          <p className="text-sm leading-relaxed text-suave">{ruta.resumen}</p>
          {onVerMapa && (
            <button
              onClick={onVerMapa}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-borde px-3 py-1.5 text-xs text-suave transition-colors hover:border-acento/50 hover:text-texto"
            >
              <Map size={13} aria-hidden />
              Ver en el mapa
            </button>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px border-y border-borde bg-borde sm:grid-cols-4">
        {datos.map(({ icono: Icono, etiqueta, valor }) => (
          <div key={etiqueta} className="bg-panel px-4 py-3">
            <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-tenue">
              <Icono size={12} aria-hidden />
              {etiqueta}
            </dt>
            <dd className="tabular mt-1 text-sm font-medium">{valor}</dd>
          </div>
        ))}
      </dl>

      <section className="px-5 py-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xs uppercase tracking-[0.16em] text-tenue">
            Cómo se forma el índice
          </h3>
          <span className="tabular text-xs text-tenue">factor × peso</span>
        </div>

        <ul className="mt-3 flex flex-col gap-3">
          {partes.map(({ factor, valor, aporte }) => (
            <li key={factor.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-baseline gap-2">
                  {factor.etiqueta}
                  <span className="tabular text-[10px] text-tenue">
                    {Math.round(factor.peso * 100)}%
                  </span>
                </span>
                <span className="tabular text-xs text-suave">
                  {Math.round(valor)} <span className="text-tenue">→ +{aporte.toFixed(1)}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-texto/8">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${valor}%`, backgroundColor: nivel.color, opacity: 0.55 }}
                />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-tenue">{factor.descripcion}</p>
            </li>
          ))}
        </ul>

        <p className="tabular mt-4 border-t border-borde pt-3 text-xs text-suave">
          Índice ={" "}
          {partes.map(({ aporte }, posicion) => (
            <span key={posicion}>
              {posicion > 0 && " + "}
              {aporte.toFixed(1)}
            </span>
          ))}{" "}
          = <span className="font-semibold text-texto">{puntaje}</span>
        </p>
      </section>

      <section className="border-t border-borde px-5 py-4">
        <h3 className="text-xs uppercase tracking-[0.16em] text-tenue">A tomar en cuenta</h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {ruta.notas.map((nota) => (
            <li key={nota} className="flex gap-2 text-sm text-suave">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-tenue" aria-hidden />
              {nota}
            </li>
          ))}
        </ul>
        <p className="tabular mt-3 text-[11px] text-tenue">
          Acceso aproximado: {ruta.acceso[0].toFixed(4)}, {ruta.acceso[1].toFixed(4)}
        </p>
      </section>
    </article>
  )
}
