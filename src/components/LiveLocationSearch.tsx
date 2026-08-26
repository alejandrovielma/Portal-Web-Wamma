import { useState } from "react";
import {
  searchLocationLive,
  getLastCachedLocationSearch,
  NetworkUnreachableError,
  LiveLocationResult,
} from "#lib/liveLocationSearch.ts";

interface LiveLocationSearchProps {
  onResult: (result: LiveLocationResult) => void;
}

export function LiveLocationSearch({ onResult }: LiveLocationSearchProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSearch() {
    if (!query.trim()) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const result = await searchLocationLive(query);
      onResult(result);
      setStatus("idle");
    } catch (e) {
      const isNetworkFailure = e instanceof NetworkUnreachableError;
      const cached = isNetworkFailure ? getLastCachedLocationSearch() : null;

      if (cached) {
        onResult(cached.result);
        setStatus("idle");
        setErrorMessage("No se pudo conectar. Se muestra tu última búsqueda guardada.");
      } else {
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
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md flex flex-col gap-1">
      <div className="flex gap-2 bg-sand/95 backdrop-blur-md rounded-full shadow-lg ring-1 ring-black/5 p-1.5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Buscar un lugar en Venezuela..."
          className="flex-1 min-w-0 rounded-full px-4 py-1.5 outline-none bg-transparent text-sm sm:text-base"
        />
        <button
          onClick={handleSearch}
          disabled={status === "loading" || !query.trim()}
          className="shrink-0 px-3 sm:px-5 py-1.5 rounded-full bg-light-secondary hover:bg-light-tertiary disabled:bg-light-secondary/40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          {status === "loading" ? "..." : "Buscar"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-white bg-red-700/90 rounded-full px-4 py-1.5 shadow">
          {errorMessage}
        </p>
      )}
      {status === "idle" && errorMessage && (
        <p className="text-xs text-dark-tertiary bg-sand/95 rounded-full px-4 py-1.5 shadow">
          ⚠ {errorMessage}
        </p>
      )}
    </div>
  );
}

export default LiveLocationSearch;
