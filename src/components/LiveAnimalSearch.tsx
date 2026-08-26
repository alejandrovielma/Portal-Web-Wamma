import { useEffect, useState } from "react";
import {
  searchAnimalLive,
  getLastCachedSearch,
  NetworkUnreachableError,
  NotAquaticError,
  LiveAnimalResult,
} from "#lib/liveSpeciesSearch.ts";
import LiveAnimalCard from "#components/LiveAnimalCard.tsx";

interface LiveAnimalSearchProps {
  initialQuery?: string;
  title?: string;
  handleDrag: (event: Event) => void;
}

export function LiveAnimalSearch({ initialQuery = "", title = "Buscar otro animal en línea", handleDrag }: LiveAnimalSearchProps) {
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
        if (isNetworkFailure) {
          setErrorMessage("No se pudo conectar a internet y no hay ninguna búsqueda previa guardada.");
        } else if (e instanceof NotAquaticError) {
          setErrorMessage(`🌊 ${e.message}`);
        } else {
          setErrorMessage(e instanceof Error ? e.message : "Ocurrió un error inesperado");
        }
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

      {status === "success" && result && (
        <div className="max-w-xs">
          <LiveAnimalCard result={result} handleDrag={handleDrag} />
        </div>
      )}
    </div>
  );
}

export default LiveAnimalSearch;
