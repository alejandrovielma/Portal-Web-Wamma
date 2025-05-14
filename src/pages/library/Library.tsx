import DialogInfo from "#components/DialogInfo.tsx";
import {NavHeader} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";
import "./library.css"
import Separator from "#components/Separator.tsx";
import LinkButton from "#components/LinkButton.tsx";
import { Article, getLastArticles } from "../../data/dataBase/articles";

export function Library() {
  const [isDragging, setIsDragging] = useState(false);
  function handleDrag(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <>
      <SelectPostItLayer isDragging={isDragging}>
        <NavHeader
          pathItems={[{ nombre: "Biblioteca", link: "" }]}
        />
        <div className="flex flex-col items-center pt-32">
          <div className="flex flex-col items-center w-full gap-8">
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4">
              <span className="flex items-center justify-between">
                <h2 className="text-2xl">Ultimos Articulos</h2>
                <LinkButton href="/articulos">
                  Ver más
                </LinkButton>
              </span>
              <span id="articles" className="grid gap-8 justify-between">
                <LastArticles handleDrag={handleDrag}/>
              </span>
            </section>
            <Separator/>
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4">
              <h2 className="text-2xl">Descubre mas sobre la cultura del agua</h2>
              <div id="resources" className="grid gap-x-16 justify-between">
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleDrag} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleDrag} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleDrag} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleDrag} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleDrag} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleDrag} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleDrag} />
              </div>
            </section>
          </div>
            
          
        </div>
        
      </SelectPostItLayer>
    </>
    
  );
}
export default Library;

function LastArticles({handleDrag}: {handleDrag: (event: Event) => void}) {
  const lastArticles = getLastArticles(3)

  return(
    <>
      {lastArticles.map((article: Article) => (
          <article key={article.id} className="flex flex-col shadow-md rounded-b-2xl">
            <div className="">
              <UnitPostIt 
              imageLink={article.images && article.images.length > 0 ? article.images[0] : "images/perro.jpg"}
              onClickInfo={article.id}
              handleEvent={handleDrag}
              />
            </div>
            <div className="px-5 py-3 flex flex-col gap-1">
              <header>
                <h3 className="text-xl">{article.title}</h3>
                </header>
              <p className="text-sm opacity-90">{article.content[0].paragraphs[0]}</p>
            </div>
          </article>
      ))}
    </>
  );
}
