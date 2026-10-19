# TrailInfo

Catálogo de senderos de El Paso, Texas, donde cada ruta recibe un **índice de
dificultad de 0 a 100** y se puede encontrar de dos maneras: escribiendo en una
barra de búsqueda o tocándola en un mapa.

El problema que resuelve es el de siempre al elegir ruta: cada guía mide la
dificultad a su manera y ninguna dice por qué. Aquí las métricas de cada sendero
—desnivel, terreno, distancia, exposición y autonomía— se combinan en un solo
número comparable, y la ficha enseña la operación completa, así que el usuario
puede estar en desacuerdo con el resultado sabiendo exactamente de dónde salió.

**Deploy:** Vercel
**Repo:** `city-info`

---

## Stack

- **Framework:** Next.js 15 (App Router), React 19
- **Estilos:** Tailwind CSS v4 con tokens en `@theme`
- **Íconos:** Lucide React
- **Mapa:** Leaflet + react-leaflet, teselas de Esri (gris oscuro y satélite)

Las teselas son de los servicios públicos de ArcGIS Online, que no piden llave ni
registro: la aplicación se abre en cualquier navegador sin configurar nada. CARTO,
que era la opción obvia para un fondo oscuro, ahora devuelve un mosaico de *API
key required* en lugar del mapa.

Leaflet entra por `next/dynamic` con `ssr: false`: toca `window` al construirse y
no sobrevive al render del servidor. El resto de la página sí se prerenderiza, así
que el catálogo completo está en el HTML inicial aunque el mapa llegue después.

---

## Los dos módulos

La aplicación se divide en dos vistas que comparten el mismo estado —consulta,
filtros y ruta seleccionada—, de modo que cada una funciona por separado sin
perder la continuidad al cambiar:

- **Buscador.** Barra con autocompletado, filtros por nivel y zona, orden
  configurable, listado y ficha de detalle.
- **Mapa.** El mismo conjunto filtrado dibujado sobre El Paso: cada ruta como un
  trazo coloreado por su nivel y un punto en el acceso. Al seleccionar, el mapa
  vuela al encuadre de esa ruta y atenúa las demás.

Quitar el mapa no rompe el buscador: `Mapa.tsx` es el único archivo que conoce
Leaflet, y la vista se elige en `app/page.tsx`.

---

## El índice

Cinco factores, cada uno normalizado a 0–100 y multiplicado por su peso:

| Factor | Peso | De dónde sale |
|---|---|---|
| Desnivel | 30% | Calculado: metros de ascenso ÷ 900, acotado a 100 |
| Terreno | 25% | Dato de la ruta: roca suelta, escalones, trepadas, exposición |
| Distancia | 20% | Calculado: kilómetros ÷ 21, acotado a 100 |
| Exposición | 15% | Dato de la ruta: sol directo, calor, falta de sombra |
| Autonomía | 10% | Dato de la ruta: agua, señal, señalización, rescate |

El índice es la suma de los cinco aportes, redondeada. La ficha de cada ruta
muestra la operación completa —valor, peso y aporte de cada factor— porque el
número solo no convence a nadie: lo que convence es ver de dónde sale.

### Por qué esos pesos

El desnivel manda porque es lo que de verdad decide si una ruta se siente dura:
800 m de ascenso en 12 km cansan más que 20 km planos. El terreno va segundo
porque es el factor que convierte una caminata en una trepada —Hueco Tanks Chain
Trail mide 1.1 km y aun así califica por encima de rutas cinco veces más largas,
que es exactamente el comportamiento que se busca. La distancia pesa menos de lo
que la intuición sugiere porque sin pendiente ni técnica es solo tiempo. La
exposición y la autonomía ajustan los extremos: en el desierto chihuahuense, una
ruta sin sombra ni agua a media tarde es otra ruta.

### Umbrales

| Rango | Nivel | Color |
|---|---|---|
| 0–24 | Fácil | verde |
| 25–49 | Moderado | amarillo |
| 50–74 | Difícil | naranja |
| 75–100 | Muy difícil | rojo |

Con las 18 rutas cargadas la distribución va de 14 (Mirador Scenic Drive) a 84
(Trans-Franklin Traverse), con los cuatro niveles representados. Importa que así
sea: una escala donde todo cae en la misma casilla no comunica nada.

---

## Datos

Distancias, desniveles y duraciones vienen de fuentes públicas de senderismo
(AllTrails, Texas Parks & Wildlife, Komoot, guías locales). Los tres factores
cualitativos —terreno, exposición, autonomía— se califican a partir de la
descripción de cada ruta. Los trazos sobre el mapa son orientativos: marcan
dirección y zona, no la huella levantada con GPS. El pie de página lo dice y
recuerda consultar el estado del sendero antes de salir.

---

## Extensibilidad

`lib/escala.ts` no sabe qué es un sendero: recibe entidades con nombre, zona,
coordenadas y un puñado de métricas, y devuelve un índice y un nivel. Sumar
rutas, agregar un factor al modelo o cambiar los pesos no toca la interfaz, y
llevar el mismo catálogo a otra ciudad —u otro conjunto de zonas calificadas con
otros indicadores— es cuestión de `lib/datos.ts` y la tabla `factores`.
