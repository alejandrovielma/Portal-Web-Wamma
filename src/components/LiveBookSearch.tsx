import { useState } from "react";
import {
  searchBooksLive,
  getLastCachedBookSearch,
  NetworkUnreachableError,
  LiveBookResult,
} from "#lib/liveBookSearch.ts";
import BookSVG from "#assets/BookSVG.tsx";
import PostItShell from "#components/PostIts/PostItShell.tsx";

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {results.map((book) => (
            <BookCard key={book.key} book={book} />
          ))}
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
      className="group block w-full aspect-[4/5] cursor-pointer hover:-translate-y-1 transition-transform"
    >
      <PostItShell>
        <div className="w-full h-28 shrink-0 bg-black/5 flex items-center justify-center overflow-hidden">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs opacity-50 px-2 text-center">Sin portada</span>
          )}
        </div>
        <div className="px-3 py-2 flex flex-col gap-1 flex-1 min-h-0">
          <h4 className="font-titles text-sm line-clamp-2">{book.title}</h4>
          <p className="text-xs opacity-70 line-clamp-1">
            {book.authors.join(", ") || "Autor desconocido"}
            {book.year ? ` · ${book.year}` : ""}
          </p>
          {book.readUrl && (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-leaf-dark mt-auto pt-1">
              Disponible para leer
            </span>
          )}
        </div>
      </PostItShell>
    </a>
  );
}

export default LiveBookSearch;
