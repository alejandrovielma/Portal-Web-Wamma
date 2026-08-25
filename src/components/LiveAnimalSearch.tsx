import { useEffect, useState } from "react";
import {
  searchAnimalLive,
  getLastCachedSearch,
  NetworkUnreachableError,
  LiveAnimalResult,
} from "#lib/liveSpeciesSearch.ts";

interface LiveAnimalSearchProps {
  initialQuery?: string;
  title?: string;
}

export function LiveAnimalSearch({ initialQuery = "", title = "Buscar otro animal en línea" }: LiveAnimalSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<LiveAnimalResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showingCached, setShowingCached] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  async function handleSearch() {
    if (!query.trim()) return;
    setStatus("loading");
    setErrorMessage(null);
    setShowingCached(false);

    try {
      const record = await searchAnimalLive(query);
      setResult(record);
      setStatus("success");
    } catch (e) {
      const isNetworkFailure = e instanceof NetworkUnreachableError;
      const cached = isNetworkFailure ? getLastCachedSearch() : null;

      if (cached) {
        setResult(cached.result);
        setShowingCached(true);
        setStatus("success");
        setErrorMessage("No se pudo conectar. Mostrando tu última búsqueda guardada.");
      } else {
        setResult(null);
        setStatus("error");
        setErrorMessage(
          isNetworkFailure
            ? "No se pudo conectar a internet y no hay ninguna búsqueda previa guardada."
            : e instanceof Error
              ? e.message
              : "Ocurrió un error inesperado"
        );
      }
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3 className="font-titles text-lg text-dark-tertiary">{title}</h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Nombre científico o común (ej. Puma concolor)"
          className="flex-1 min-w-0 ring-2 ring-light-primary/40 focus-visible:ring-light-primary rounded-full px-4 py-2 outline-none bg-white"
        />
        <button
          onClick={handleSearch}
          disabled={status === "loading" || !query.trim()}
          className="shrink-0 px-4 sm:px-6 py-2 rounded-full bg-leaf hover:bg-leaf-dark disabled:bg-leaf/40 disabled:cursor-not-allowed text-white font-semibold transition-colors cursor-pointer"
        >
          {status === "loading" ? "Buscando..." : "Buscar en línea"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      )}

      {showingCached && errorMessage && (
        <p className="text-sm text-dark-tertiary bg-light-primary/15 rounded-xl px-4 py-3">
          ⚠ {errorMessage}
        </p>
      )}

      {status === "success" && result && <ResultCard result={result} isCached={showingCached} />}
    </div>
  );
}

function ResultCard({ result, isCached }: { result: LiveAnimalResult; isCached: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-sand rounded-3xl shadow-md ring-1 ring-black/5 overflow-hidden">
      <div className="sm:w-1/3 shrink-0 bg-light-primary/10">
        {result.image ? (
          <img
            src={result.image}
            alt={result.scientificName}
            className="w-full h-48 sm:h-full object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:h-full flex items-center justify-center text-dark-tertiary/50 text-sm">
            Sin imagen disponible
          </div>
        )}
      </div>
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wide font-semibold bg-leaf/15 text-leaf-dark px-2 py-1 rounded-full">
            Resultado en línea
          </span>
          {isCached && (
            <span className="text-[10px] uppercase tracking-wide font-semibold bg-dark-tertiary/10 text-dark-tertiary px-2 py-1 rounded-full">
              Última búsqueda (caché)
            </span>
          )}
        </div>
        <h4 className="font-titles text-xl text-dark-tertiary">
          {result.commonName ?? result.scientificName}
        </h4>
        <p className="text-sm italic text-shadow-50/70">{result.scientificName}</p>

        {(result.phylum || result.class || result.order || result.family) && (
          <p className="text-sm text-shadow-50/85">
            {[result.phylum, result.class, result.order, result.family, result.genus]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        {result.globalConservationStatus && (
          <p className="text-sm">
            <span className="font-semibold">Estado de conservación (global):</span>{" "}
            {result.globalConservationStatus}
            <span className="block text-xs text-shadow-50/60">
              No es específico de Venezuela — solo el catálogo curado del sitio tiene ese dato nacional.
            </span>
          </p>
        )}

        {result.description && (
          <p className="text-sm text-shadow-50/85 leading-relaxed line-clamp-4">
            {result.description}
          </p>
        )}

        {result.observationsInVenezuela > 0 && (
          <p className="text-xs text-leaf-dark">
            📍 {result.observationsInVenezuela} avistamiento(s) registrados en Venezuela (iNaturalist)
          </p>
        )}

        <div className="flex gap-3 mt-1 text-xs text-light-secondary">
          {result.sources.gbif && (
            <a href={result.sources.gbif} target="_blank" rel="noreferrer" className="hover:underline">
              GBIF
            </a>
          )}
          {result.sources.inaturalist && (
            <a href={result.sources.inaturalist} target="_blank" rel="noreferrer" className="hover:underline">
              iNaturalist
            </a>
          )}
          {result.sources.wikipedia && (
            <a href={result.sources.wikipedia} target="_blank" rel="noreferrer" className="hover:underline">
              Wikipedia
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveAnimalSearch;
