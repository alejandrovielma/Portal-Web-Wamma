import { LiveArticleResult } from "#lib/liveArticleSearch.ts";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";

export function LiveArticleCard({ article, handleDrag }: { article: LiveArticleResult; handleDrag: (event: Event) => void }) {
  return (
    <div className="w-full">
      <UnitPostItInfo
        dimensions={{ w: 2, h: 3 }}
        handleEvent={handleDrag}
        postItProds={{
          title: article.title,
          content: [{ paragraphs: [article.description ?? "Todavía no hay una descripción disponible para este artículo."] }],
          images: article.imageUrl ? [article.imageUrl] : [],
          sourceUrl: article.url,
        }}
      />
    </div>
  );
}

export default LiveArticleCard;
