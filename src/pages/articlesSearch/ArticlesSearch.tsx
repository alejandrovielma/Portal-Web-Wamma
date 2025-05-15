import { useState, useEffect } from "react";
import { getAllArticles } from "../../data/dataBase/repository"; 
import { NavHeader, BreadcrumbItem } from "#components/NavHeader.tsx";
import { SearchBar } from "#components/SearchBar.tsx"; 
import UnitPostIt from "#components/UnitPostIt.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";

export function ArticlesSearch() {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<PostItInfoProps[]>([]);
  const [articles, setArticles] = useState<PostItInfoProps[]>(getAllArticles());

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

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader pathItems={breadcrumbs} />
      <SearchBar onSearch={setSearchTerm} /> 
      <section className="w-11/12 flex flex-col px-4 mt-52">
        <div id="articles" className="flex flex-col gap-8">
          {filteredArticles.length > 0 ? (
            <Articles handleDrag={handleEvent} articles={filteredArticles} />
          ) : (
            <p className="text-center translate-x-14 text-6xl text-gray-500">No se encontró el artículo solicitado</p>
          )}
        </div>
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
            <UnitPostIt key={article.title} postItProds={article} handleEvent={handleDrag} />
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