import { LiveArticleResult } from "#lib/liveArticleSearch.ts";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";

export function LiveArticleCard({ article, handleDrag }: { article: LiveArticleResult; handleDrag: (event: Event) => void }) {
  const metaLine = [article.source, article.publishedDate, ...article.categories]
    .filter(Boolean)
    .join(" · ");

  const paragraphs = [
    article.description ?? "Todavía no hay una descripción disponible para este artículo -- entra a la fuente original para leerlo completo.",
  ];
  if (metaLine) paragraphs.push(metaLine);

  return (
    <div className="w-full">
      <UnitPostItInfo
        dimensions={{ w: 2, h: 3 }}
        handleEvent={handleDrag}
        postItProds={{
          title: article.title,
          content: [{ paragraphs }],
          images: article.imageUrl ? [article.imageUrl] : [],
          sourceUrl: article.url,
        }}
      />
    </div>
  );
}

export default LiveArticleCard;
