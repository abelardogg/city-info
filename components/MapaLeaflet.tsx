"use client"

import { Fragment, useEffect, useRef } from "react"
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet"
import { LatLngBounds } from "leaflet"
import "leaflet/dist/leaflet.css"
import { ciudad } from "@/lib/datos"
import { indice, nivelDe, type Ruta } from "@/lib/escala"
import { capas, type CapaId } from "./capas"

interface Props {
  rutas: Ruta[]
  seleccionada?: string
  capa: CapaId
  onElegir: (ruta: Ruta) => void
}

function Encuadre({ rutas, seleccionada }: { rutas: Ruta[]; seleccionada?: string }) {
  const mapa = useMap()
  const vigentes = useRef(rutas)
  vigentes.current = rutas
  const claves = rutas.map((ruta) => ruta.id).join("|")

  useEffect(() => {
    const lista = vigentes.current
    const elegida = lista.find((ruta) => ruta.id === seleccionada)
    const puntos = (elegida ? [elegida] : lista).flatMap((ruta) => ruta.trazo)
    if (!puntos.length) return
    mapa.flyToBounds(new LatLngBounds(puntos), {
      padding: [56, 56],
      maxZoom: elegida ? 15 : 13,
      duration: 0.7,
    })
  }, [mapa, claves, seleccionada])

  return null
}

export default function MapaLeaflet({ rutas, seleccionada, capa, onElegir }: Props) {
  const fondo = capas.find((opcion) => opcion.id === capa) ?? capas[0]

  return (
    <MapContainer
      center={ciudad.centro}
      zoom={ciudad.zoom}
      scrollWheelZoom
      zoomControl
      className="size-full"
    >
      <TileLayer
        key={fondo.id}
        url={fondo.url}
        attribution={fondo.credito}
        maxZoom={18}
      />
      {fondo.etiquetas && (
        <TileLayer key={`${fondo.id}-etiquetas`} url={fondo.etiquetas} maxZoom={18} />
      )}

      {rutas.map((ruta) => {
        const puntaje = indice(ruta)
        const color = nivelDe(puntaje).color
        const elegida = ruta.id === seleccionada
        const atenuada = Boolean(seleccionada) && !elegida

        return (
          <Fragment key={ruta.id}>
            <Polyline
              positions={ruta.trazo}
              interactive={false}
              pathOptions={{
                color: "#ffffff",
                weight: elegida ? 10 : 8,
                opacity: atenuada ? 0.3 : 0.75,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <Polyline
              positions={ruta.trazo}
              pathOptions={{
                color,
                weight: elegida ? 6 : 4,
                opacity: atenuada ? 0.4 : 1,
                lineCap: "round",
                lineJoin: "round",
              }}
              eventHandlers={{ click: () => onElegir(ruta) }}
            >
              <Tooltip sticky>
                <strong>{ruta.nombre}</strong>
                <span style={{ color }}> · {puntaje}</span>
              </Tooltip>
            </Polyline>

            <CircleMarker
              center={ruta.acceso}
              radius={elegida ? 8 : 6}
              pathOptions={{
                color: "#ffffff",
                weight: 2.5,
                opacity: atenuada ? 0.5 : 1,
                fillColor: color,
                fillOpacity: atenuada ? 0.45 : 1,
              }}
              eventHandlers={{ click: () => onElegir(ruta) }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <strong>{ruta.nombre}</strong>
                <br />
                {ruta.distanciaKm} km · {ruta.desnivelM} m ·{" "}
                <span style={{ color }}>{puntaje}</span>
              </Tooltip>
            </CircleMarker>
          </Fragment>
        )
      })}

      <Encuadre rutas={rutas} seleccionada={seleccionada} />
    </MapContainer>
  )
}
