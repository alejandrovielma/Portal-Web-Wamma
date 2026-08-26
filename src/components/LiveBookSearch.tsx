import { useState } from "react";
import {
  searchBooksLive,
  getLastCachedBookSearch,
  NetworkUnreachableError,
  LiveBookResult,
} from "#lib/liveBookSearch.ts";
import BookSVG from "#assets/BookSVG.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";

export function LiveBookSearch({ handleDrag }: { handleDrag: (event: Event) => void }) {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((book) => (
            <BookCard key={book.key} book={book} handleDrag={handleDrag} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookCard({ book, handleDrag }: { book: LiveBookResult; handleDrag: (event: Event) => void }) {
  const authorLine =
    `${book.authors.join(", ") || "Autor desconocido"}${book.year ? ` · ${book.year}` : ""}` +
    (book.readUrl ? " · Disponible para leer online." : "");
  // Open Library no trae una sinopsis en la busqueda -- los temas del
  // libro son lo mas parecido a una descripcion que hay disponible.
  const subjectsLine = book.subjects.length > 0 ? `Temas: ${book.subjects.join(", ")}.` : null;

  return (
    <div className="w-full">
      <UnitPostItInfo
        dimensions={{ w: 2, h: 3 }}
        handleEvent={handleDrag}
        postItProds={{
          title: book.title,
          content: [{ paragraphs: subjectsLine ? [authorLine, subjectsLine] : [authorLine] }],
          images: book.coverUrl ? [book.coverUrl] : [],
          sourceUrl: book.readUrl ?? book.openLibraryUrl,
        }}
      />
    </div>
  );
}

export default LiveBookSearch;
