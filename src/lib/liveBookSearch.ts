// Busqueda EN VIVO de libros reales sobre cualquier tema, usando la API
// publica y gratuita de Open Library (openlibrary.org), sin key, con
// CORS abierto.

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

const FIELDS = "key,title,author_name,first_publish_year,cover_i,ebook_access,ia,subject";

// Open Library busca en todo su catalogo global, asi que un termino
// suelto como "agua" trae de todo (novelas brasileñas, cuentos
// infantiles, lo que sea) sin nada que ver con Venezuela. La misma
// estrategia que se uso para el buscador de articulos: primero se busca
// el termino + "Venezuela" (mejor relacion relevancia/cantidad), y si no
// alcanza se reintenta mas amplio -- pero en ambos casos se filtran los
// resultados para quedarse solo con los que de verdad mencionan
// Venezuela y algo relacionado al agua (en el titulo o en los temas que
// trae el propio libro).
const WATER_TERMS = [
  "agua", "aguas", "acuatic", "hidric", "hidrologia", "rio", "rios",
  "sequia", "inundacion", "lluvia", "cuenca", "manglar", "delta",
  "oceano", "lago", "laguna", "humedal", "caudal", "represa", "embalse",
  "potable",
  "water", "hydrology", "river", "flood", "drought", "watershed",
  "wetland", "dam", "reservoir", "rainfall", "estuary", "ocean", "lake",
  "irrigation", "hydraulic", "aquatic", "freshwater",
];

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase();
}

function isRelevant(doc: any): boolean {
  const text = normalize(`${doc.title ?? ""} ${(doc.subject ?? []).join(" ")}`);
  const mentionsVenezuela = text.includes("venezuela");
  const mentionsWater = WATER_TERMS.some((term) => text.includes(term));
  return mentionsVenezuela && mentionsWater;
}

async function fetchDocs(query: string, limit: number): Promise<any[]> {
  let response: Response;
  try {
    response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=${FIELDS}`
    );
  } catch {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  if (!response.ok) {
    throw new NetworkUnreachableError("No se pudo conectar a internet");
  }

  const data = await response.json();
  return data?.docs ?? [];
}

export async function searchBooksLive(query: string): Promise<LiveBookResult[]> {
  const trimmed = query.trim();
  if (!trimmed) throw new Error("Escribe un tema o título");

  const primary = (await fetchDocs(`${trimmed} Venezuela`, 20)).filter(isRelevant);
  let relevant = primary;

  if (relevant.length < 3) {
    const seen = new Set(primary.map((doc) => doc.key));
    const broader = (await fetchDocs(trimmed, 30)).filter(isRelevant);
    relevant = [...primary];
    for (const doc of broader) {
      if (!seen.has(doc.key)) {
        relevant.push(doc);
        seen.add(doc.key);
      }
    }
  }

  if (relevant.length === 0) {
    throw new Error(`No se encontraron libros para "${trimmed}"`);
  }

  const results: LiveBookResult[] = relevant.slice(0, 6).map((doc) => ({
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
