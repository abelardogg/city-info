export type FactorId = "desnivel" | "distancia" | "terreno" | "exposicion" | "servicios"

export interface Factor {
  id: FactorId
  etiqueta: string
  descripcion: string
  peso: number
}

export const factores: Factor[] = [
  {
    id: "desnivel",
    etiqueta: "Elevation gain",
    descripcion: "Total meters climbed. 900 m or more scores 100.",
    peso: 0.3,
  },
  {
    id: "terreno",
    etiqueta: "Terrain",
    descripcion: "Loose rock, steps, scrambling and exposed stretches.",
    peso: 0.25,
  },
  {
    id: "distancia",
    etiqueta: "Distance",
    descripcion: "Total length of the route. 21 km or more scores 100.",
    peso: 0.2,
  },
  {
    id: "exposicion",
    etiqueta: "Exposure",
    descripcion: "Direct sun, heat and lack of shade along the way.",
    peso: 0.15,
  },
  {
    id: "servicios",
    etiqueta: "Self-reliance",
    descripcion: "How much is on you: water, cell signal, waymarking and rescue.",
    peso: 0.1,
  },
]

export interface Nivel {
  id: "facil" | "moderado" | "dificil" | "muy-dificil"
  etiqueta: string
  desde: number
  color: string
  claseTexto: string
  claseFondo: string
  claseBorde: string
}

export const niveles: Nivel[] = [
  {
    id: "facil",
    etiqueta: "Easy",
    desde: 0,
    color: "#5fb98a",
    claseTexto: "text-facil",
    claseFondo: "bg-facil/15",
    claseBorde: "border-facil/40",
  },
  {
    id: "moderado",
    etiqueta: "Moderate",
    desde: 25,
    color: "#e0b23a",
    claseTexto: "text-moderado",
    claseFondo: "bg-moderado/15",
    claseBorde: "border-moderado/40",
  },
  {
    id: "dificil",
    etiqueta: "Hard",
    desde: 50,
    color: "#e08a3a",
    claseTexto: "text-dificil",
    claseFondo: "bg-dificil/15",
    claseBorde: "border-dificil/40",
  },
  {
    id: "muy-dificil",
    etiqueta: "Very hard",
    desde: 75,
    color: "#d9594c",
    claseTexto: "text-muy-dificil",
    claseFondo: "bg-muy-dificil/15",
    claseBorde: "border-muy-dificil/40",
  },
]

export interface Ruta {
  id: string
  nombre: string
  zona: string
  parque: string
  distanciaKm: number
  desnivelM: number
  horas: number
  tipo: "Out and back" | "Loop" | "Point to point"
  acceso: [number, number]
  trazo: [number, number][]
  resumen: string
  notas: string[]
  medido: Record<"terreno" | "exposicion" | "servicios", number>
}

const TECHO_DESNIVEL = 900
const TECHO_DISTANCIA = 21

const acotar = (valor: number) => Math.max(0, Math.min(100, valor))

export function valorFactor(ruta: Ruta, id: FactorId): number {
  if (id === "desnivel") return acotar((ruta.desnivelM / TECHO_DESNIVEL) * 100)
  if (id === "distancia") return acotar((ruta.distanciaKm / TECHO_DISTANCIA) * 100)
  return acotar(ruta.medido[id])
}

export interface Aporte {
  factor: Factor
  valor: number
  aporte: number
}

export function desglose(ruta: Ruta): Aporte[] {
  return factores.map((factor) => {
    const valor = valorFactor(ruta, factor.id)
    return { factor, valor, aporte: valor * factor.peso }
  })
}

export function indice(ruta: Ruta): number {
  return Math.round(desglose(ruta).reduce((suma, { aporte }) => suma + aporte, 0))
}

export function nivelDe(puntaje: number): Nivel {
  return [...niveles].reverse().find((nivel) => puntaje >= nivel.desde) ?? niveles[0]
}

export function colorDe(puntaje: number): string {
  return nivelDe(puntaje).color
}
