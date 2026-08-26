import { useState } from "react";
import {
  searchBooksLive,
  getLastCachedBookSearch,
  NetworkUnreachableError,
  LiveBookResult,
} from "#lib/liveBookSearch.ts";
import BookSVG from "#assets/BookSVG.tsx";

export function LiveBookSearch() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [results, setResults] = useState<LiveBookResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showingCached, setShowingCached] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setStatus("loading");
    setErrorMessage(null);
    setShowingCached(false);

    try {
      const books = await searchBooksLive(query);
      setResults(books);
      setStatus("success");
    } catch (e) {
      const isNetworkFailure = e instanceof NetworkUnreachableError;
      const cached = isNetworkFailure ? getLastCachedBookSearch() : null;

      if (cached) {
        setResults(cached.results);
        setShowingCached(true);
        setStatus("success");
        setErrorMessage(`No se pudo conectar. Mostrando tu última búsqueda ("${cached.query}") guardada.`);
      } else {
        setResults([]);
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
      <div className="flex gap-2 bg-sand-dark/40 ring-1 ring-sand-dark rounded-2xl p-2">
        <span className="hidden sm:flex items-center pl-2 text-leaf-dark/70 shrink-0">
          <BookSVG />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Busca un tema o título (ej. cultura del agua, ríos de Venezuela)"
          className="flex-1 min-w-0 rounded-xl px-4 py-2 outline-none bg-sand focus-visible:ring-2 focus-visible:ring-leaf/50"
        />
        <button
          onClick={handleSearch}
          disabled={status === "loading" || !query.trim()}
          className="shrink-0 px-4 sm:px-6 py-2 rounded-xl bg-leaf hover:bg-leaf-dark disabled:bg-leaf/40 disabled:cursor-not-allowed text-white font-semibold transition-colors cursor-pointer"
        >
          {status === "loading" ? "Buscando..." : "Buscar libros"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{errorMessage}</p>
      )}
      {showingCached && errorMessage && (
        <p className="text-sm text-dark-tertiary bg-light-primary/15 rounded-xl px-4 py-3">
          ⚠ {errorMessage}
        </p>
      )}

      {status === "success" && results.length > 0 && (
        <div className="bg-sand-dark/30 rounded-2xl p-4 sm:p-6 flex flex-col gap-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-x-4 sm:gap-y-0 items-end">
            {results.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
          <div className="h-3 bg-sand-dark rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.15)]" />
        </div>
      )}
    </div>
  );
}

function BookCard({ book }: { book: LiveBookResult }) {
  return (
    <a
      href={book.readUrl ?? book.openLibraryUrl}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col gap-2 bg-sand rounded-t-md rounded-b-sm shadow-md ring-1 ring-black/5 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all mb-2"
    >
      <div className="w-full h-40 bg-light-primary/10 flex items-center justify-center border-b-4 border-leaf-dark/20">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-dark-tertiary/50 px-2 text-center">Sin portada</span>
        )}
      </div>
      <div className="px-3 pb-3 flex flex-col gap-1">
        <h4 className="font-titles text-sm text-dark-tertiary line-clamp-2">{book.title}</h4>
        <p className="text-xs text-shadow-50/70 line-clamp-1">
          {book.authors.join(", ") || "Autor desconocido"}
          {book.year ? ` · ${book.year}` : ""}
        </p>
        {book.readUrl && (
          <span className="text-[10px] uppercase tracking-wide font-semibold text-leaf-dark">
            Disponible para leer
          </span>
        )}
      </div>
    </a>
  );
}

export default LiveBookSearch;
