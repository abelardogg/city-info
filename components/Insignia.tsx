import { nivelDe } from "@/lib/escala"

interface Props {
  puntaje: number
  compacta?: boolean
}

export default function Insignia({ puntaje, compacta = false }: Props) {
  const nivel = nivelDe(puntaje)

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium"
      style={{
        color: nivel.color,
        borderColor: `${nivel.color}55`,
        backgroundColor: `${nivel.color}1f`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: nivel.color }}
        aria-hidden
      />
      {nivel.etiqueta}
      {!compacta && <span className="tabular text-texto/70">{puntaje}</span>}
    </span>
  )
}
