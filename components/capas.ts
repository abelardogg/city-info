const esri = "https://server.arcgisonline.com/ArcGIS/rest/services"

export type CapaId = "topografico" | "satelite"

export interface Capa {
  id: CapaId
  etiqueta: string
  url: string
  etiquetas?: string
  credito: string
}

export const capas: Capa[] = [
  {
    id: "topografico",
    etiqueta: "Map",
    url: `${esri}/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`,
    credito:
      "Tiles &copy; Esri &mdash; USGS, NOAA, HERE, Garmin, OpenStreetMap contributors",
  },
  {
    id: "satelite",
    etiqueta: "Satellite",
    url: `${esri}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    etiquetas: `${esri}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`,
    credito:
      "Tiles &copy; Esri &mdash; Maxar, Earthstar Geographics and the GIS user community",
  },
]
