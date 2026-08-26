import { useState } from "react";
import {
  searchArticlesLive,
  getLastCachedArticleSearch,
  NetworkUnreachableError,
  LiveArticleResult,
} from "#lib/liveArticleSearch.ts";
import NewsSVG from "#assets/NewsSVG.tsx";

export function LiveArticleSearch() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [results, setResults] = useState<LiveArticleResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showingCached, setShowingCached] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setStatus("loading");
    setErrorMessage(null);
    setShowingCached(false);

    try {
      const articles = await searchArticlesLive(query);
      setResults(articles);
      setStatus("success");
    } catch (e) {
      const isNetworkFailure = e instanceof NetworkUnreachableError;
      const cached = isNetworkFailure ? getLastCachedArticleSearch() : null;

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
          <NewsSVG />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Busca un tema (ej. sequía, ríos, cambio climático)"
          className="flex-1 min-w-0 rounded-xl px-4 py-2 outline-none bg-sand focus-visible:ring-2 focus-visible:ring-leaf/50"
        />
        <button
          onClick={handleSearch}
          disabled={status === "loading" || !query.trim()}
          className="shrink-0 px-4 sm:px-6 py-2 rounded-xl bg-leaf hover:bg-leaf-dark disabled:bg-leaf/40 disabled:cursor-not-allowed text-white font-semibold transition-colors cursor-pointer"
        >
          {status === "loading" ? "Buscando..." : "Buscar artículos"}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: LiveArticleResult }) {
  const date = article.publishedAt ? formatDate(article.publishedAt) : null;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col bg-sand rounded-2xl shadow-md ring-1 ring-black/5 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
    >
      <div className="w-full h-36 bg-light-primary/10 flex items-center justify-center">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-leaf-dark/40">
            <NewsSVG />
          </span>
        )}
      </div>
      <div className="px-4 py-3 flex flex-col gap-1.5 flex-1">
        <h4 className="font-titles text-sm text-dark-tertiary line-clamp-2">{article.title}</h4>
        {article.description && (
          <p className="text-xs text-shadow-50/70 line-clamp-2">{article.description}</p>
        )}
        {(article.source || date) && (
          <p className="text-[10px] uppercase tracking-wide font-semibold text-leaf-dark mt-auto pt-1">
            {[article.source, date].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </a>
  );
}

function formatDate(published: string): string | null {
  // Currents manda "YYYY-MM-DD HH:MM:SS +0000", que no es ISO 8601 valido
  // tal cual (le falta la T y los ":" del offset) -- se normaliza antes de parsear.
  const normalized = published
    .trim()
    .replace(" ", "T")
    .replace(/\s?([+-]\d{2})(\d{2})$/, "$1:$2");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-VE", { day: "numeric", month: "short", year: "numeric" });
}

export default LiveArticleSearch;
