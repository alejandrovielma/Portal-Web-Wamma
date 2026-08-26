import { LiveArticleResult } from "#lib/liveArticleSearch.ts";
import NewsSVG from "#assets/NewsSVG.tsx";

export function LiveArticleCard({ article }: { article: LiveArticleResult }) {
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

export default LiveArticleCard;
