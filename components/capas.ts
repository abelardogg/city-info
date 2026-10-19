const esri = "https://server.arcgisonline.com/ArcGIS/rest/services"

export type CapaId = "relieve" | "satelite"

export interface Capa {
  id: CapaId
  etiqueta: string
  url: string
  etiquetas?: string
  credito: string
}

export const capas: Capa[] = [
  {
    id: "relieve",
    etiqueta: "Mapa",
    url: `${esri}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    etiquetas: `${esri}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    credito: "Teselas &copy; Esri &mdash; HERE, Garmin, OpenStreetMap y colaboradores",
  },
  {
    id: "satelite",
    etiqueta: "Satélite",
    url: `${esri}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    etiquetas: `${esri}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`,
    credito:
      "Teselas &copy; Esri &mdash; Maxar, Earthstar Geographics y la comunidad de usuarios SIG",
  },
]
