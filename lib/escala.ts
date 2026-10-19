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
    etiqueta: "Desnivel",
    descripcion: "Metros de ascenso acumulado. 900 m o más puntúa 100.",
    peso: 0.3,
  },
  {
    id: "terreno",
    etiqueta: "Terreno",
    descripcion: "Roca suelta, escalonado, trepadas y tramos expuestos.",
    peso: 0.25,
  },
  {
    id: "distancia",
    etiqueta: "Distancia",
    descripcion: "Kilómetros totales del recorrido. 21 km o más puntúa 100.",
    peso: 0.2,
  },
  {
    id: "exposicion",
    etiqueta: "Exposición",
    descripcion: "Sol directo, calor y falta de sombra en el trazo.",
    peso: 0.15,
  },
  {
    id: "servicios",
    etiqueta: "Autonomía",
    descripcion: "Qué tanto depende de ti: agua, señal, señalización y rescate.",
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
    etiqueta: "Fácil",
    desde: 0,
    color: "#5fb98a",
    claseTexto: "text-facil",
    claseFondo: "bg-facil/15",
    claseBorde: "border-facil/40",
  },
  {
    id: "moderado",
    etiqueta: "Moderado",
    desde: 25,
    color: "#e0b23a",
    claseTexto: "text-moderado",
    claseFondo: "bg-moderado/15",
    claseBorde: "border-moderado/40",
  },
  {
    id: "dificil",
    etiqueta: "Difícil",
    desde: 50,
    color: "#e08a3a",
    claseTexto: "text-dificil",
    claseFondo: "bg-dificil/15",
    claseBorde: "border-dificil/40",
  },
  {
    id: "muy-dificil",
    etiqueta: "Muy difícil",
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
  tipo: "Ida y vuelta" | "Circuito" | "Punto a punto"
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
