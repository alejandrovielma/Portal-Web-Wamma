import { NavHeader } from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";
import { useState } from "react";
import "./proyects.css";
import Separator from "#components/Separator.tsx";
import {
  getLastProjects,
  getLastProposals,
} from "../../data/dataBase/repository";
import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";

export function News() {
  const [isDragging, setIsDragging] = useState(false);
  function handleDrag(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <>
      <SelectPostItLayer isDragging={isDragging}>
        <NavHeader pathItems={[{ nombre: "Proyectos", link: "" }]} />
        <div className="flex flex-col items-center pt-32">
          <div className="flex flex-col items-center w-full gap-8">
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4">
              <span className="flex items-center justify-between">
                <h2 className="text-2xl">Proyectos Activos</h2>
              </span>
              <span id="articles" className="grid gap-8 justify-between">
                <LastArticles handleDrag={handleDrag} />
              </span>
            </section>
            <Separator />
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4">
              <h2 className="text-2xl">
                Motivate y aporta a la comunidad
              </h2>
              <LastWorks handleDrag={handleDrag} />
            </section>
          </div>
        </div>
      </SelectPostItLayer>
    </>
  );
}
export default News;

function LastWorks({ handleDrag }: { handleDrag: (event: Event) => void }) {
  const lastProposals = getLastProposals(12);

  return (
    <ul id="resources" className="grid gap-x-16 justify-between">
      {lastProposals.map((proposal: PostItInfoProps, i) => (
        <li key={i} className="relative">
          <div className="relative shadow-xl rounded-b-xl">
            <UnitPostItInfo postItProds={proposal} handleEvent={handleDrag} />
          </div>
          <div>
              <h3 className="font-titles text-sm">{proposal.title}</h3>
          </div>
        </li>
      ))}
    </ul>
  );
}

function LastArticles({ handleDrag }: { handleDrag: (event: Event) => void }) {
  const lastArticles = getLastProjects(3);

  return (
    <>
      {lastArticles.map((article: PostItInfoProps, i) => (
        <article key={i} className="flex flex-col shadow-md rounded-b-2xl">
          <div>
            <UnitPostItInfo postItProds={article} handleEvent={handleDrag} />
          </div>
          <div className="px-5 py-3 flex flex-col gap-1">
            <header>
              <h3 className="text-xl">{article.title}</h3>
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
