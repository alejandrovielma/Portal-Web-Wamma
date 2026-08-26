// Busqueda EN VIVO de cualquier lugar de Venezuela que no este en los 6
// destinos curados de destinations.json, usando Nominatim (OpenStreetMap).
// API publica, gratuita, sin key, con CORS abierto.
//
// Politica de uso de Nominatim: max 1 peticion/segundo (no es problema
// aca, cada busqueda la dispara una persona a mano) y hay que mostrar
// la atribucion "(c) OpenStreetMap contributors" junto al resultado.
//
// Mismo patron de cache que liveSpeciesSearch.ts: si la ultima busqueda
// tuvo exito se guarda, y si una busqueda nueva falla por problemas de
// red se puede mostrar ese ultimo resultado en vez de una pantalla vacia.

const CACHE_KEY = "wamma_last_live_location_search";
const RECENT_SEARCHES_KEY = "wamma_recent_location_searches";
const MAX_RECENT_SEARCHES = 5;

export interface LocationFact {
  label: string;
  value: string;
}

export interface LiveLocationResult {
  query: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string | null;
  osmUrl: string;
  description: string | null;
  images: string[];
  city: string | null;
  facts: LocationFact[];
}

export class NetworkUnreachableError extends Error {}

async function fetchWikipediaSummary(
  lang: string,
  title: string
): Promise<{ description: string | null; image: string | null } | null> {
  try {
    const res = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === "disambiguation") return null;
    return {
      description: data.extract ?? null,
      image: data.thumbnail?.source ?? data.originalimage?.source ?? null,
    };
  } catch {
    return null;
  }
}

async function getWikipediaSummary(
  name: string,
  wikipediaTag?: string // formato "es:Titulo del articulo", viene de extratags de OSM
): Promise<{ description: string | null; image: string | null }> {
  // Preferimos el tag "wikipedia" de OSM (el mismo mapeador del lugar ya
  // lo vinculo al articulo correcto) porque el "name" que devuelve
  // Nominatim a veces esta en otro idioma y no matchea el titulo real
  // del articulo en español.
  if (wikipediaTag?.includes(":")) {
    const [lang, ...rest] = wikipediaTag.split(":");
    const found = await fetchWikipediaSummary(lang, rest.join(":"));
    if (found) return found;
  }

  for (const lang of ["es", "en"]) {
    const found = await fetchWikipediaSummary(lang, name);
    if (found) return found;
  }
  return { description: null, image: null };
}

const FACT_LABELS: Record<string, string> = {
  operator: "Administrado por",
  start_date: "Establecido en",
  height: "Altura",
  elevation: "Elevación",
  population: "Población",
  protection_title: "Categoría de protección",
  website: "Sitio web",
};

function extractFacts(extratags: Record<string, string> | undefined): LocationFact[] {
  if (!extratags) return [];
  const facts: LocationFact[] = [];
  for (const [key, label] of Object.entries(FACT_LABELS)) {
    const value = extratags[key];
    if (!value) continue;
    facts.push({
      label,
      value: key === "height" || key === "elevation" ? `${value} m` : value,
    });
  }
  return facts;
}

export async function searchLocationLive(query: string): Promise<LiveLocationResult> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error("Escribe el nombre de un lugar");

  let response: Response;
  try {
    response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&countrycodes=ve&limit=1&addressdetails=1&extratags=1`
    );
  } catch {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  if (!response.ok) {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  const results = await response.json();
  const place = results?.[0];
  if (!place) {
    throw new Error(`No se encontró "${trimmed}" en Venezuela`);
  }

  const name: string = place.name || place.display_name.split(",")[0];
  const wiki = await getWikipediaSummary(name, place.extratags?.wikipedia);

  const result: LiveLocationResult = {
    query: trimmed,
    name,
    displayName: place.display_name,
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
    type: place.type ?? null,
    osmUrl: `https://www.openstreetmap.org/${place.osm_type}/${place.osm_id}`,
    description: wiki.description ?? place.extratags?.["description:es"] ?? place.extratags?.["description:en"] ?? null,
    images: wiki.image ? [wiki.image] : [],
    city:
      place.address?.city ??
      place.address?.town ??
      place.address?.municipality ??
      place.address?.state ??
      null,
    facts: extractFacts(place.extratags),
  };

  cacheLastResult(result);
  addToRecentSearches(result);
  return result;
}

function cacheLastResult(result: LiveLocationResult) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ result, cachedAt: Date.now() }));
  } catch {
    // localStorage puede fallar (modo privado, cuota llena) -- no es critico
  }
}

export function getLastCachedLocationSearch(): { result: LiveLocationResult; cachedAt: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function addToRecentSearches(result: LiveLocationResult) {
  try {
    const existing = getRecentSearches().filter((r) => r.name !== result.name);
    const updated = [result, ...existing].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // localStorage puede fallar (modo privado, cuota llena) -- no es critico
  }
}

export function getRecentSearches(): LiveLocationResult[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
