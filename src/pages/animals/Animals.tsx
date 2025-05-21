import { useState, useEffect } from "react";
import NavBubbleAnimals from "#components/NavBubbleAnimals.tsx";
import { NavHeader } from "#components/NavHeader.tsx";
import { SearchBar } from "#components/SearchBar.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import { Animal, getAllAnimals } from "../../data/dataBase/repository";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";

export function Animals() {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClass, setFilteredClass] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [animals] = useState<Animal[]>(getAllAnimals());

  
  const [backgroundImage, setBackgroundImage] = useState("/images/fondoMar.gif");
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const results = animals.filter((animal) =>
      animal.content.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      animal.class.toLowerCase().includes(filteredClass.toLowerCase())
    );
    setFilteredAnimals(results);
  }, [searchTerm, filteredClass, animals]);

  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  function resetFilter() {
    setFilteredClass("");
    setFilteredAnimals(animals);
    fadeBackground("/images/fondoMar.gif");
  }

  function fadeBackground(newImage: string) {
    setIsFading(true);

    setTimeout(() => {
      setBackgroundImage(newImage);
      setTimeout(() => setIsFading(false), 500); 
    }, 500); 
  }

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader pathItems={[{ nombre: "Acuario", link: "/animales" }]} />

      <div className="relative mt-20 w-full h-3/5 flex items-center justify-center">
        <img
          src={backgroundImage}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}
        />
        <div className="relative z-10">
          <NavBubbleAnimals setfiltered={setFilteredClass} setBackgroundImage={fadeBackground} />
        </div>
      </div>

      <span className="flex items-center justify-start gap-4 mt-8">
        <SearchBar estilo="w-1/3" onSearch={setSearchTerm} />
        <h2 className="text-xl">
          Filtrando por clase: <span className="font-semibold">{filteredClass}</span>
          {filteredClass && (
            <button onClick={resetFilter} className="ml-2 w-6 h-6 cursor-pointer">
              <img className="h-full w-full mt-1.5" src="/svgs/Close.svg" alt="Limpiar búsqueda" />
            </button>
          )}
        </h2>
      </span>

      <AnimalGrip filteredAnimals={filteredAnimals} handleEvent={handleEvent} />
    </SelectPostItLayer>
  );
}

export default Animals;



function AnimalGrip({ filteredAnimals, handleEvent }: { filteredAnimals: Animal[], handleEvent: (event: Event) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pb-24">
      {filteredAnimals.length > 0 && filteredAnimals.slice(0, 18).map((info: Animal, i) => (
        <article key={i} className="flex flex-col items-center justify-center shadow-xl rounded-b-xl overflow-hidden">
          <UnitPostItInfo
            key={info.content.title}
            postItProds={info.content}
            handleEvent={handleEvent}
          />
          <div>
            <h3 className="font-titles">{info.content.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}
