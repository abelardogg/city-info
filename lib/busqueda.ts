import type { Ruta } from "./escala"

export const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['`’]/g, "")
    .trim()

const campos = (ruta: Ruta) => [ruta.nombre, ruta.zona, ruta.parque]

export function coincide(ruta: Ruta, consulta: string): boolean {
  const termino = normalizar(consulta)
  if (!termino) return true
  return campos(ruta).some((campo) => normalizar(campo).includes(termino))
}

export function buscar(rutas: Ruta[], consulta: string): Ruta[] {
  const termino = normalizar(consulta)
  if (!termino) return rutas
  return rutas
    .filter((ruta) => coincide(ruta, termino))
    .sort((a, b) => relevancia(b, termino) - relevancia(a, termino))
}

function relevancia(ruta: Ruta, termino: string): number {
  const nombre = normalizar(ruta.nombre)
  if (nombre === termino) return 4
  if (nombre.startsWith(termino)) return 3
  if (nombre.includes(termino)) return 2
  return 1
}

export function resaltar(texto: string, consulta: string): [string, string, string] {
  const termino = normalizar(consulta)
  if (!termino) return [texto, "", ""]
  const desde = normalizar(texto).indexOf(termino)
  if (desde < 0) return [texto, "", ""]
  return [
    texto.slice(0, desde),
    texto.slice(desde, desde + termino.length),
    texto.slice(desde + termino.length),
  ]
}
