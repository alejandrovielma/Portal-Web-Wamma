import { useState, useEffect } from "react";
import { getAllArticles } from "../../data/dataBase/repository";
import { NavHeader, BreadcrumbItem } from "#components/NavHeader.tsx";
import { SearchBar } from "#components/SearchBar.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import LiveArticleCard from "#components/LiveArticleCard.tsx";
import {
  searchArticlesLive,
  getLastCachedArticleSearch,
  NetworkUnreachableError,
  LiveArticleResult,
} from "#lib/liveArticleSearch.ts";

export function ArticlesSearch() {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<PostItInfoProps[]>([]);
  const [articles] = useState<PostItInfoProps[]>(getAllArticles());

  const [liveStatus, setLiveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [liveResults, setLiveResults] = useState<LiveArticleResult[]>([]);
  const [liveErrorMessage, setLiveErrorMessage] = useState<string | null>(null);
  const [showingCachedLive, setShowingCachedLive] = useState(false);

  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { nombre: "Biblioteca", link: "/biblioteca" },
    { nombre: "Artículos", link: "/articulos" },
  ];

  useEffect(() => {
    const results = articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  // Si la persona cambia lo que escribió, los resultados de internet de
  // la busqueda anterior ya no aplican -- se limpian para no mezclarlos.
  useEffect(() => {
    setLiveStatus("idle");
    setLiveResults([]);
    setLiveErrorMessage(null);
  }, [searchTerm]);

  async function handleLiveSearch() {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setLiveStatus("loading");
    setLiveErrorMessage(null);
    setShowingCachedLive(false);

    try {
      const results = await searchArticlesLive(trimmed);
      setLiveResults(results);
      setLiveStatus("success");
    } catch (e) {
      const isNetworkFailure = e instanceof NetworkUnreachableError;
      const cached = isNetworkFailure ? getLastCachedArticleSearch() : null;

      if (cached) {
        setLiveResults(cached.results);
        setShowingCachedLive(true);
        setLiveStatus("success");
        setLiveErrorMessage(`No se pudo conectar. Mostrando tu última búsqueda ("${cached.query}") guardada.`);
      } else {
        setLiveResults([]);
        setLiveStatus("error");
        setLiveErrorMessage(
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
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader pathItems={breadcrumbs} />
      <SearchBar estilo="w-1/3 top-24 left-1/2 -translate-x-1/2" onSearch={setSearchTerm} />
      <section className="w-11/12 flex flex-col px-4 mt-52 gap-8">
        <div id="articles" className="flex flex-col gap-8">
          {filteredArticles.length > 0 ? (
            <Articles handleDrag={handleEvent} articles={filteredArticles} />
          ) : (
            <p className="text-center translate-x-14 text-6xl text-gray-500">No se encontró el artículo solicitado</p>
          )}
        </div>

        {searchTerm.trim() && (
          <div className="flex flex-col items-center gap-4 pb-16">
            <button
              onClick={handleLiveSearch}
              disabled={liveStatus === "loading"}
              className="px-6 py-2 rounded-full bg-leaf hover:bg-leaf-dark disabled:bg-leaf/40 disabled:cursor-not-allowed text-white font-semibold transition-colors cursor-pointer"
            >
              {liveStatus === "loading" ? "Buscando en internet..." : `Buscar "${searchTerm.trim()}" también en internet`}
            </button>

            {liveStatus === "error" && (
              <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3 w-full max-w-2xl text-center">
                {liveErrorMessage}
              </p>
            )}
            {showingCachedLive && liveErrorMessage && (
              <p className="text-sm text-dark-tertiary bg-light-primary/15 rounded-xl px-4 py-3 w-full max-w-2xl text-center">
                ⚠ {liveErrorMessage}
              </p>
            )}

            {liveStatus === "success" && liveResults.length > 0 && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveResults.map((article) => (
                  <LiveArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </SelectPostItLayer>
  );
}
export default ArticlesSearch;

function Articles({ handleDrag, articles }: { handleDrag: (event: Event) => void; articles: PostItInfoProps[] }) {
  return (
    <>
      {articles.map((article: PostItInfoProps, i) => (
        <article key={i} className="flex shadow-md rounded-b-2xl">
          <div className="w-1/4 relative">
            <UnitPostItInfo key={article.title} postItProds={article} handleEvent={handleDrag} />
          </div>
          <div className="w-3/4 p-5 flex flex-col items-start justify-start gap-2">
            <header className="text-center">
              <h3 className="text-xl">{article.title}</h3>
            </header>
            <p className="text-sm opacity-90 overflow-hidden whitespace-normal">
              {article.content[1]?.paragraphs[0]?.length > 300
                ? article.content[1].paragraphs[0].slice(0, 300) + "..."
                : article.content[1]?.paragraphs[0]}
            </p>
          </div>
        </article>
      ))}
    </>
  );
}
