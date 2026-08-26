import { NavHeader } from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";
import { useState } from "react";
import "./library.css";
import Separator from "#components/Separator.tsx";
import LinkButton from "#components/LinkButton.tsx";
import {
  getLastArticles,
  getLastWorks,
  Work,
} from "../../data/dataBase/repository";
import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import BookSVG from "#assets/BookSVG.tsx";
import AudioSVG from "#assets/AudioSVG.tsx";
import VideoSVG from "#assets/VideoSVG.tsx";
import LiveBookSearch from "#components/LiveBookSearch.tsx";

export function Library() {
  const [isDragging, setIsDragging] = useState(false);
  function handleDrag(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <>
      <SelectPostItLayer isDragging={isDragging}>
        <NavHeader pathItems={[{ nombre: "Biblioteca", link: "" }]} />
        <div className="flex flex-col items-center pt-32">
          <div className="flex flex-col items-center w-full gap-8">
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4">
              <span className="flex items-center justify-between">
                <h2 className="text-2xl">Ultimos Articulos</h2>
                <LinkButton href="/articulos">Ver más</LinkButton>
              </span>
              <span id="articles" className="grid gap-8 justify-between">
                <LastArticles handleDrag={handleDrag} />
              </span>
            </section>
            <Separator />
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4">
              <h2 className="text-2xl">
                Descubre mas sobre la cultura del agua
              </h2>
              <LastWorks handleDrag={handleDrag} />
            </section>
            <Separator />
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4 pb-16">
              <span className="flex items-center gap-3">
                <span className="text-leaf-dark shrink-0">
                  <BookSVG />
                </span>
                <h2 className="text-2xl font-titles">Busca más libros en el catálogo</h2>
              </span>
              <p className="text-sm text-shadow-50/70">
                Escribe un tema o título y encuentra libros reales para seguir leyendo.
              </p>
              <LiveBookSearch />
            </section>
          </div>
        </div>
      </SelectPostItLayer>
    </>
  );
}
export default Library;

function LastWorks({ handleDrag }: { handleDrag: (event: Event) => void }) {
  const lastWorks = getLastWorks(12);

  return (
    <ul id="resources" className="grid gap-x-16 pb-24 justify-between">
      {lastWorks.map((work: Work, i) => (
        <li key={i} className="relative">
          <div className="relative shadow-xl rounded-b-xl">
            <UnitPostItInfo postItProds={work.content} handleEvent={handleDrag} />
            <div className="bg-light-primary/70 absolute bottom-0 left-0 rounded-tr-2xl px-4 py-1">
            {work.type === "video" ? (
              <span className="text-sm text-shadow-50 font-bold">
                <VideoSVG />
              </span>
            ) : work.type === "audio" ? (
              <span className="text-sm text-shadow-50 font-bold">
                <AudioSVG />
              </span>
            ) : work.type === "book" ? (
              <span className="text-sm text-shadow-50 font-bold">
                <BookSVG />
              </span>
            ) : null}
          </div>
          </div>
          <div>
              <h3 className="font-titles text-sm">{work.content.title}</h3>
          </div>
          
        </li>
      ))}
    </ul>
  );
}

function LastArticles({ handleDrag }: { handleDrag: (event: Event) => void }) {
  const lastArticles = getLastArticles(3);

  return (
    <>
      {lastArticles.map((article: PostItInfoProps, i) => (
        <article key={i} className="flex flex-col shadow-md rounded-b-2xl">
          <div>
            <UnitPostItInfo postItProds={article} handleEvent={handleDrag} />
          </div>
          <div className="px-5 py-3 flex flex-col gap-1">
            <header>
              <h3 className="text-xl font-titles">{article.title}</h3>
            </header>
            <p className="text-sm opacity-90">
              {article.content[0].paragraphs[0]}
            </p>
          </div>
        </article>
      ))}
    </>
  );
}
