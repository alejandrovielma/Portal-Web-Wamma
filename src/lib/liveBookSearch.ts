// Busqueda EN VIVO de libros reales sobre cualquier tema, usando la API
// publica y gratuita de Open Library (openlibrary.org), sin key, con
// CORS abierto. Pensado para complementar el catalogo de works.json
// (que esta escrito/curado a mano) con contenido real y verificable.

const CACHE_KEY = "wamma_last_live_book_search";

export interface LiveBookResult {
  key: string;
  title: string;
  authors: string[];
  year: number | null;
  coverUrl: string | null;
  openLibraryUrl: string;
  readUrl: string | null; // solo si hay una copia legible/prestable en Internet Archive
}

export class NetworkUnreachableError extends Error {}

export async function searchBooksLive(query: string): Promise<LiveBookResult[]> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error("Escribe un tema o título");

  let response: Response;
  try {
    response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        trimmed
      )}&limit=6&fields=key,title,author_name,first_publish_year,cover_i,ebook_access,ia`
    );
  } catch {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  if (!response.ok) {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  const data = await response.json();
  const docs: any[] = data?.docs ?? [];

  if (docs.length === 0) {
    throw new Error(`No se encontraron libros para "${trimmed}"`);
  }

  const results: LiveBookResult[] = docs.map((doc) => ({
    key: doc.key,
    title: doc.title,
    authors: doc.author_name ?? [],
    year: doc.first_publish_year ?? null,
    coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
    openLibraryUrl: `https://openlibrary.org${doc.key}`,
    readUrl:
      (doc.ebook_access === "public" || doc.ebook_access === "borrowable") && doc.ia?.[0]
        ? `https://archive.org/details/${doc.ia[0]}`
        : null,
  }));

  cacheLastResults(trimmed, results);
  return results;
}

function cacheLastResults(query: string, results: LiveBookResult[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ query, results, cachedAt: Date.now() }));
  } catch {
    // localStorage puede fallar (modo privado, cuota llena) -- no es critico
  }
}

export function getLastCachedBookSearch(): { query: string; results: LiveBookResult[]; cachedAt: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
