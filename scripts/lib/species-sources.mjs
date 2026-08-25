// Logica compartida para consultar GBIF + iNaturalist + Wikipedia ES
// y armar la ficha de una especie. Usado por fetch-species-data.mjs
// (una especie) y migrate-fauna.mjs (dataset completo).

export const VENEZUELA_PLACE_ID = 1303; // via /v1/places/autocomplete?q=Venezuela

const CONSERVATION_STATUS_ES = {
  lc: "Preocupación Menor",
  nt: "Casi Amenazada",
  vu: "Vulnerable",
  en: "En Peligro",
  cr: "En Peligro Crítico",
  ew: "Extinta en Estado Silvestre",
  ex: "Extinta",
  dd: "Datos Insuficientes",
};

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    throw new Error(`${url} -> HTTP ${res.status}`);
  }
  return res.json();
}

export async function getGbifTaxonomy(scientificName) {
  const url = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`;
  const data = await fetchJson(url);
  if (data.matchType === "NONE") return null;
  return {
    phylum: data.phylum ?? null,
    class: data.class ?? null,
    order: data.order ?? null,
    family: data.family ?? null,
    genus: data.genus ?? null,
    gbifUsageKey: data.usageKey,
    gbifSourceUrl: `https://www.gbif.org/species/${data.usageKey}`,
  };
}

export async function getINaturalistData(scientificName) {
  const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&per_page=1`;
  const data = await fetchJson(url);
  const taxon = data.results?.[0];
  if (!taxon) return null;

  const obsUrl = `https://api.inaturalist.org/v1/observations?taxon_id=${taxon.id}&place_id=${VENEZUELA_PLACE_ID}&photos=true&per_page=3&order_by=votes`;
  const obsData = await fetchJson(obsUrl).catch(() => ({ results: [], total_results: 0 }));
  const venezuelaPhotos = (obsData.results ?? [])
    .flatMap((obs) => obs.photos ?? [])
    .map((photo) => photo.url?.replace("square", "medium"))
    .filter(Boolean);

  return {
    commonNameEn: taxon.preferred_common_name ?? null,
    defaultPhoto: taxon.default_photo
      ? {
          url: taxon.default_photo.medium_url,
          attribution: taxon.default_photo.attribution,
          license: taxon.default_photo.license_code,
        }
      : null,
    venezuelaPhotos,
    conservationStatus: taxon.conservation_status
      ? {
          code: taxon.conservation_status.status,
          label:
            CONSERVATION_STATUS_ES[taxon.conservation_status.status] ??
            taxon.conservation_status.status_name,
          authority: taxon.conservation_status.authority,
        }
      : null,
    wikipediaUrl: taxon.wikipedia_url ?? null,
    observationsInVenezuela: obsData.total_results ?? 0,
    inaturalistTaxonUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
  };
}

export async function getWikipediaSummaryEs(scientificName) {
  const title = scientificName.replace(/ /g, "_");
  const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const data = await fetchJson(url).catch(() => null);
  if (!data || data.type === "disambiguation") return null;
  return {
    description: data.extract ?? null,
    image: data.thumbnail?.source ?? null,
    pageUrl: data.content_urls?.desktop?.page ?? null,
  };
}

/**
 * Arma la ficha combinada de una especie.
 * `oldRecord` (opcional) es la entrada tal cual venia en el JSON viejo,
 * para conservar distribution/locations/imageDistribution que ninguna
 * API publica cubre.
 */
export async function buildSpeciesRecord(scientificName, localName, oldRecord) {
  const [gbif, inat, wiki] = await Promise.all([
    getGbifTaxonomy(scientificName).catch((e) => {
      console.error(`  GBIF fallo (${scientificName}):`, e.message);
      return null;
    }),
    getINaturalistData(scientificName).catch((e) => {
      console.error(`  iNaturalist fallo (${scientificName}):`, e.message);
      return null;
    }),
    getWikipediaSummaryEs(scientificName).catch((e) => {
      console.error(`  Wikipedia fallo (${scientificName}):`, e.message);
      return null;
    }),
  ]);

  return {
    scientificName,
    name: localName ?? inat?.commonNameEn ?? scientificName,

    // Prioridad: dato curado viejo primero. GBIF usa a veces un esquema
    // distinto (ej. clasifica tortugas/culebras/caimanes como "clase"
    // Testudines/Squamata/Crocodylia en vez de "Reptilia"), lo que rompe
    // la distincion Clase/Orden que el resto del sitio espera. GBIF solo
    // rellena lo que falte.
    phylum: oldRecord?.phylum ?? gbif?.phylum ?? null,
    class: oldRecord?.class ?? gbif?.class ?? null,
    order: oldRecord?.order ?? gbif?.order ?? null,
    family: oldRecord?.family ?? gbif?.family ?? null,
    genus: oldRecord?.genus ?? gbif?.genus ?? null,

    // Prioridad: el dato viejo es la evaluacion NACIONAL de Provita
    // (Libro Rojo de la Fauna Venezolana), que puede ser mas severa que
    // el estado GLOBAL de IUCN que trae iNaturalist -- una especie puede
    // estar bien a nivel mundial pero en peligro solo en Venezuela. No
    // sobreescribir con el dato global si ya hay una evaluacion nacional.
    state: oldRecord?.state ?? inat?.conservationStatus?.label ?? null,
    globalConservationStatus: inat?.conservationStatus?.label ?? null,

    description: wiki?.description ?? oldRecord?.description ?? null,

    image:
      inat?.defaultPhoto?.url ??
      wiki?.image ??
      (oldRecord?.image ? `https://www.especiesamenazadas.org${oldRecord.image}` : null),
    imageAttribution:
      inat?.defaultPhoto?.attribution ??
      (!inat?.defaultPhoto && !wiki?.image && oldRecord?.image
        ? "SIN CONFIRMAR: fuente original especiesamenazadas.org (Provita), sin licencia clara -- revisar antes de publicar"
        : null),
    additionalImages: inat?.venezuelaPhotos ?? [],

    // conservados del dataset viejo: ninguna API publica los cubre igual
    // de especifico (contenido editorial de Provita)
    distribution: oldRecord?.distribution ?? null,
    locations: oldRecord?.locations ?? [],
    imageDistribution: oldRecord?.imageDistribution ?? null,
    situation: oldRecord?.situation ?? null,
    danger: oldRecord?.danger ?? null,
    conservation: oldRecord?.conservation ?? null,

    sources: {
      gbif: gbif?.gbifSourceUrl ?? null,
      inaturalist: inat?.inaturalistTaxonUrl ?? null,
      wikipedia: wiki?.pageUrl ?? null,
    },
    observationsInVenezuela: inat?.observationsInVenezuela ?? 0,
  };
}
