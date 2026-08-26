// Busqueda EN VIVO de articulos de noticias reales sobre cualquier tema,
// via Currents API. A diferencia de las demas busquedas en vivo del sitio
// (GBIF, Wikipedia, Nominatim, Open Library), esta si necesita una key,
// asi que no se llama directo desde el navegador -- se pasa por el
// endpoint propio /api/articles, que es el unico que conoce la key
// (guardada como variable de entorno en Vercel, nunca en el bundle).

const CACHE_KEY = "wamma_last_live_article_search";

export interface LiveArticleResult {
  id: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  source: string | null;
  publishedAt: string | null;
}

export class NetworkUnreachableError extends Error {}

export async function searchArticlesLive(query: string): Promise<LiveArticleResult[]> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error("Escribe un tema para buscar");

  let response: Response;
  try {
    response = await fetch(`/api/articles?q=${encodeURIComponent(trimmed)}`);
  } catch {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  if (!response.ok) {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  const data = await response.json();
  if (data?.status !== "ok") {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  const news: any[] = data?.news ?? [];
  if (news.length === 0) {
    throw new Error(`No se encontraron artículos para "${trimmed}"`);
  }

  // Currents devuelve el texto literal "None" (en vez de omitir el campo
  // o mandar null) cuando no tiene descripcion, imagen o autor.
  const orNull = (value: unknown) =>
    typeof value === "string" && value.trim() && value !== "None" ? value : null;

  const results: LiveArticleResult[] = news.map((item) => ({
    id: item.id,
    title: item.title,
    description: orNull(item.description),
    url: item.url,
    imageUrl: orNull(item.image),
    source: orNull(item.author),
    publishedAt: orNull(item.published),
  }));

  cacheLastResults(trimmed, results);
  return results;
}

function cacheLastResults(query: string, results: LiveArticleResult[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ query, results, cachedAt: Date.now() }));
  } catch {
    // localStorage puede fallar (modo privado, cuota llena) -- no es critico
  }
}

export function getLastCachedArticleSearch(): { query: string; results: LiveArticleResult[]; cachedAt: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
