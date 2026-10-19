import { nivelDe } from "@/lib/escala"

interface Props {
  puntaje: number
  tamano?: number
}

export default function Medidor({ puntaje, tamano = 116 }: Props) {
  const nivel = nivelDe(puntaje)
  const radio = tamano / 2 - 9
  const vuelta = 2 * Math.PI * radio
  const arco = 0.78
  const avance = (puntaje / 100) * vuelta * arco

  return (
    <div
      className="relative shrink-0"
      style={{ width: tamano, height: tamano }}
      role="img"
      aria-label={`Difficulty score ${puntaje} out of 100, ${nivel.etiqueta} level`}
    >
      <svg
        width={tamano}
        height={tamano}
        viewBox={`0 0 ${tamano} ${tamano}`}
        className="-rotate-[142deg]"
      >
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="rgba(22,33,27,0.1)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${vuelta * arco} ${vuelta}`}
        />
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke={nivel.color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${avance} ${vuelta}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-3xl font-semibold leading-none">{puntaje}</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-tenue">
          out of 100
        </span>
      </div>
    </div>
  )
}
