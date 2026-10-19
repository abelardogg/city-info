# TrailInfo

App Next.js 15 con App Router, React 19 y Tailwind CSS 4. Una sola página con dos
vistas —buscador y mapa— sobre el mismo estado.

## Estructura

```
app/
├── layout.tsx        → html, metadata, globals
├── page.tsx          → estado compartido, cabecera, switch de vista
└── globals.css       → tokens de color, utilidades, estilos de Leaflet
components/
├── Buscador.tsx      → input con autocompletado y navegación por teclado
├── Filtros.tsx       → chips de nivel, zona, orden y contador
├── ListaRutas.tsx    → listado con índice y barra por ruta
├── Ficha.tsx         → detalle: medidor, desglose factor por factor, notas
├── Medidor.tsx       → arco SVG del índice
├── Insignia.tsx      → píldora de nivel
├── Mapa.tsx          → carga diferida de Leaflet + leyenda
└── MapaLeaflet.tsx   → trazos, marcadores de acceso y encuadre automático
lib/
├── escala.ts         → tipos, factores, pesos, niveles y cálculo del índice
├── datos.ts          → las 18 rutas
└── busqueda.ts       → normalización, filtrado y resaltado
```

## Estado

Todo vive en `app/page.tsx`: consulta, niveles activos, zona, orden, ruta
seleccionada y vista. Las dos vistas leen el mismo arreglo `resultados`, así que
al cambiar de buscador a mapa se conserva lo que se venía filtrando.

`resultados` se recalcula en un `useMemo` encadenando tres pasos: `buscar` por
texto, filtro por nivel y zona, y orden.

## Cálculo

```ts
indice(ruta) = Σ valorFactor(ruta, f) × peso(f)
```

`valorFactor` deriva `desnivel` y `distancia` de los datos crudos de la ruta
(÷ 900 m y ÷ 21 km, acotados a 100) y toma `terreno`, `exposicion` y `servicios`
de `ruta.medido`. `nivelDe(puntaje)` resuelve el nivel recorriendo los umbrales
de mayor a menor.

Añadir un factor son dos pasos: una entrada en `factores` con su peso y una rama
o un campo en `valorFactor`. La ficha lo dibuja sola.

## Mapa

`Mapa.tsx` importa `MapaLeaflet.tsx` con `next/dynamic` y `ssr: false`, y pone
encima la leyenda y el selector de fondo. Los dos fondos —gris oscuro y
satélite— están en `components/capas.ts`, cada uno con su capa de etiquetas y su
crédito; son servicios públicos de Esri y no requieren llave. Dentro, cada ruta es un `Polyline` coloreado por su nivel más un
`CircleMarker` en el acceso, los dos con tooltip y click que selecciona.

`Encuadre` usa `useMap` para volar al conjunto visible: a la ruta elegida si hay
una, al total filtrado si no. El efecto depende de los ids concatenados, no del
arreglo, porque el arreglo cambia de identidad en cada render.

No se usan los íconos por defecto de Leaflet —esos que requieren corregir las
rutas de las imágenes— sino vectores: nada que cargar y color controlado desde el
mismo lugar que el resto de la escala.

## Datos

`lib/datos.ts` exporta `rutas`, `zonas` (derivado) y `ciudad` (centro y zoom
inicial del mapa). Cada ruta lleva `trazo` (polilínea aproximada) y `acceso`
(punto del marcador).

## Comandos

```
npm run dev     → desarrollo
npm run build   → build de producción
npm start       → servir el build
```
