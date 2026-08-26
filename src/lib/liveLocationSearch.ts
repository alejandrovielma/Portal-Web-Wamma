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

export interface LiveLocationResult {
  query: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string | null;
  osmUrl: string;
}

export class NetworkUnreachableError extends Error {}

export async function searchLocationLive(query: string): Promise<LiveLocationResult> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error("Escribe el nombre de un lugar");

  let response: Response;
  try {
    response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed
      )}&format=json&countrycodes=ve&limit=1&addressdetails=1`
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

  const result: LiveLocationResult = {
    query: trimmed,
    name: place.name || place.display_name.split(",")[0],
    displayName: place.display_name,
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
    type: place.type ?? null,
    osmUrl: `https://www.openstreetmap.org/${place.osm_type}/${place.osm_id}`,
  };

  cacheLastResult(result);
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
