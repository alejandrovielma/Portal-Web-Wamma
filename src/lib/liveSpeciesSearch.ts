// Busqueda EN VIVO de cualquier animal (no solo el catalogo curado de 40)
// consultando GBIF + iNaturalist + Wikipedia ES directo desde el navegador.
// Estas 3 APIs son publicas, de solo lectura y con CORS abierto -- no
// necesitan key ni proxy.
//
// Incluye cache en localStorage: si la ultima busqueda tuvo exito se
// guarda, y si una busqueda nueva falla por problemas de red se puede
// mostrar ese ultimo resultado en vez de dejar al usuario con una
// pantalla vacia.

const VENEZUELA_PLACE_ID = 1303;
const CACHE_KEY = "wamma_last_live_animal_search";

const CONSERVATION_STATUS_ES: Record<string, string> = {
  lc: "Preocupación Menor",
  nt: "Casi Amenazada",
  vu: "Vulnerable",
  en: "En Peligro",
  cr: "En Peligro Crítico",
  ew: "Extinta en Estado Silvestre",
  ex: "Extinta",
  dd: "Datos Insuficientes",
};

export interface LiveAnimalResult {
  query: string;
  scientificName: string;
  commonName: string | null;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
  genus: string | null;
  globalConservationStatus: string | null;
  description: string | null;
  image: string | null;
  imageAttribution: string | null;
  observationsInVenezuela: number;
  sources: {
    gbif: string | null;
    inaturalist: string | null;
    wikipedia: string | null;
  };
}

/**
 * Como fetchJson, pero nunca lanza: devuelve null en cualquier falla.
 * `reachable` se marca en true apenas UNA respuesta HTTP llega (aunque
 * sea un error de la API), para poder distinguir "la API respondio pero
 * no encontro nada" de "no hubo internet para preguntarle a nadie".
 */
async function tryFetchJson(url: string, reachable: { value: boolean }): Promise<any | null> {
  try {
    const res = await fetch(url);
    reachable.value = true;
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // TypeError de fetch = sin red/CORS/DNS, no marca reachable
    return null;
  }
}

export class NetworkUnreachableError extends Error {}
export class NotAquaticError extends Error {}

// Wamma es un sitio sobre la cultura del AGUA -- la busqueda en vivo debe
// quedarse en fauna asociada al agua (peces, anfibios, moluscos y demas
// invertebrados acuaticos, tortugas/caimanes, mamiferos acuaticos, aves
// acuaticas) y rechazar todo lo demas (ej. un halcon, que es Aves pero
// no tiene nada que ver con el agua).

const AQUATIC_PHYLA = new Set(["Mollusca", "Cnidaria", "Echinodermata"]);

const AQUATIC_CLASSES = new Set([
  // peces
  "Actinopterygii",
  "Chondrichthyes",
  "Elasmobranchii",
  "Sarcopterygii",
  "Cephalaspidomorphi",
  "Myxini",
  // anfibios
  "Amphibia",
  // crustaceos (GBIF los reporta como "clase" dentro de Arthropoda)
  "Malacostraca",
  "Branchiopoda",
  "Maxillopoda",
  "Ostracoda",
]);

// Para estas clases, solo ciertos ordenes/familias son acuaticos o
// semi-acuaticos -- no toda la clase.
const AQUATIC_REPTILE_ORDERS = new Set(["Testudines", "Crocodylia"]);

const AQUATIC_BIRD_ORDERS = new Set([
  "Anseriformes", // patos, gansos
  "Pelecaniformes", // pelicanos, garzas, ibis
  "Suliformes", // cormoranes, piqueros
  "Podicipediformes", // zambullidores
  "Gaviiformes", // colimbos
  "Charadriiformes", // playeros, gaviotas, chorlitos
  "Phoenicopteriformes", // flamencos
  "Ciconiiformes", // cigüeñas
]);

const AQUATIC_MAMMAL_ORDERS = new Set(["Cetacea", "Sirenia"]);
const AQUATIC_MAMMAL_FAMILIES = new Set(["Mustelidae", "Hippopotamidae"]); // nutrias, hipopotamos

function isAquaticTaxon(taxonomy: {
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
}): boolean {
  const { phylum, class: cls, order, family } = taxonomy;

  if (phylum && AQUATIC_PHYLA.has(phylum)) return true;
  if (!cls) return false; // sin clasificacion, no podemos confirmar que sea acuatico

  if (AQUATIC_CLASSES.has(cls)) return true;

  if (cls === "Reptilia") return !!order && AQUATIC_REPTILE_ORDERS.has(order);
  if (cls === "Aves") return !!order && AQUATIC_BIRD_ORDERS.has(order);
  if (cls === "Mammalia") {
    return (
      (!!order && AQUATIC_MAMMAL_ORDERS.has(order)) ||
      (!!family && AQUATIC_MAMMAL_FAMILIES.has(family))
    );
  }

  return false;
}

/**
 * Busca un animal por nombre (cientifico o comun) combinando las 3 fuentes.
 * Lanza NetworkUnreachableError si no se pudo contactar a NINGUNA API
 * (para que la UI pueda mostrar el cache en vez de "no se encontro"),
 * o un Error normal si las APIs respondieron pero ninguna tiene el animal.
 */
export async function searchAnimalLive(query: string): Promise<LiveAnimalResult> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error("Escribe el nombre de un animal");

  const reachable = { value: false };
  const [gbif, inatTaxa] = await Promise.all([
    tryFetchJson(`https://api.gbif.org/v1/species/match?name=${encodeURIComponent(trimmed)}`, reachable),
    tryFetchJson(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(trimmed)}&per_page=1`, reachable),
  ]);

  const taxon = inatTaxa?.results?.[0] ?? null;
  const gbifMatched = gbif && gbif.matchType !== "NONE";

  if (!gbifMatched && !taxon) {
    if (!reachable.value) {
      throw new NetworkUnreachableError("No se pudo conectar a internet");
    }
    throw new Error(`No se encontró "${trimmed}" en ninguna fuente`);
  }

  const scientificName: string =
    taxon?.name ?? gbif?.canonicalName ?? gbif?.scientificName ?? trimmed;

  // Taxonomia: preferimos GBIF (da phylum/class/order/family completos).
  // Si GBIF no matcheo, usamos la clasificacion "iconica" (gruesa) de
  // iNaturalist -- alcanza para las clases siempre-acuaticas, pero no
  // para el filtro fino de aves/reptiles/mamiferos (que se queda
  // conservador y rechaza si no hay order/family para confirmar).
  const taxonomyForFilter = {
    phylum: gbif?.phylum ?? null,
    class: gbif?.class ?? taxon?.iconic_taxon_name ?? null,
    order: gbif?.order ?? null,
    family: gbif?.family ?? null,
  };

  if (!isAquaticTaxon(taxonomyForFilter)) {
    throw new NotAquaticError(
      `"${scientificName}" no es un animal asociado al agua -- Wamma se enfoca en fauna acuática y de humedales.`
    );
  }

  const [wiki, obsData] = await Promise.all([
    tryFetchJson(
      `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        scientificName.replace(/ /g, "_")
      )}`,
      reachable
    ),
    taxon
      ? tryFetchJson(
          `https://api.inaturalist.org/v1/observations?taxon_id=${taxon.id}&place_id=${VENEZUELA_PLACE_ID}&per_page=1`,
          reachable
        )
      : Promise.resolve(null),
  ]);

  const result: LiveAnimalResult = {
    query: trimmed,
    scientificName,
    commonName: taxon?.preferred_common_name ?? null,
    phylum: taxonomyForFilter.phylum,
    class: taxonomyForFilter.class,
    order: taxonomyForFilter.order,
    family: taxonomyForFilter.family,
    genus: gbif?.genus ?? null,
    globalConservationStatus: taxon?.conservation_status
      ? CONSERVATION_STATUS_ES[taxon.conservation_status.status] ??
        taxon.conservation_status.status_name
      : null,
    description:
      (wiki && wiki.type !== "disambiguation" ? wiki.extract : null) ?? null,
    image:
      taxon?.default_photo?.medium_url ??
      (wiki && wiki.type !== "disambiguation" ? wiki.thumbnail?.source : null) ??
      null,
    imageAttribution: taxon?.default_photo?.attribution ?? null,
    observationsInVenezuela: obsData?.total_results ?? 0,
    sources: {
      gbif: gbifMatched ? `https://www.gbif.org/species/${gbif.usageKey}` : null,
      inaturalist: taxon ? `https://www.inaturalist.org/taxa/${taxon.id}` : null,
      wikipedia:
        wiki && wiki.type !== "disambiguation"
          ? wiki.content_urls?.desktop?.page ?? null
          : null,
    },
  };

  cacheLastResult(result);
  return result;
}

function cacheLastResult(result: LiveAnimalResult) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ result, cachedAt: Date.now() })
    );
  } catch {
    // localStorage puede fallar (modo privado, cuota llena) -- no es critico
  }
}

export function getLastCachedSearch(): { result: LiveAnimalResult; cachedAt: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
