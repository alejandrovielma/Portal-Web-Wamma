import { LiveArticleResult } from "#lib/liveArticleSearch.ts";
import NewsSVG from "#assets/NewsSVG.tsx";
import PostItShell from "#components/PostIts/PostItShell.tsx";

export function LiveArticleCard({ article }: { article: LiveArticleResult }) {
  const date = article.publishedAt ? formatDate(article.publishedAt) : null;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className="group block w-full aspect-[4/5] cursor-pointer hover:-translate-y-1 transition-transform"
    >
      <PostItShell>
        <div className="w-full h-28 shrink-0 bg-black/5 flex items-center justify-center overflow-hidden">
          {article.imageUrl ? (
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <span className="opacity-30">
              <NewsSVG />
            </span>
          )}
        </div>
        <div className="px-3 py-2 flex flex-col gap-1 flex-1 min-h-0">
          <h4 className="font-titles text-sm line-clamp-2">{article.title}</h4>
          {article.description && (
            <p className="text-xs opacity-70 line-clamp-2">{article.description}</p>
          )}
          {(article.source || date) && (
            <p className="text-[10px] uppercase tracking-wide font-semibold text-leaf-dark mt-auto pt-1">
              {[article.source, date].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </PostItShell>
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

export default LiveArticleCard;
