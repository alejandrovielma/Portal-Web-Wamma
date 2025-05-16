import NavBubbleAnimals from "#components/NavBubbleAnimals.tsx";
import { NavHeader } from "#components/NavHeader.tsx";
import { SearchBar } from "#components/SearchBar.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import { Animal, getAllAnimals } from "../../data/dataBase/repository";
import { useState, useEffect } from "react";
import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";

export function Animals() {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClass, setFilteredClass] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [animals, setAnimals] = useState<Animal[]>(getAllAnimals())

  useEffect(() => {
    const results = animals.filter((animal) =>
      animal.content.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      animal.class.toLowerCase().includes(filteredClass.toLowerCase())
    );
    setFilteredAnimals(results);
  }, [searchTerm, animals]);

  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  useEffect(() => {
    const results = animals.filter((animal) =>
      animal.class.toLowerCase().includes(filteredClass.toLowerCase())
    );
    setFilteredAnimals(results);
  }, [filteredClass, animals]);

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader pathItems={[{ nombre: "Animales", link: "/animales" }]} />

      <div className="relative w-full h-5/6 flex items-center justify-center">
        <img
          src="./public/images/FondoMar.png"
          alt="Fondo Mar"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="relative z-10">
          <NavBubbleAnimals setfiltered={setFilteredClass}/>
        </div>
      </div>
      <span className="flex items-center justify-start gap-4 mt-8">
        <SearchBar estilo="w-1/3" onSearch={setSearchTerm} />
        <h2 className="text-xl" >Buscando: {filteredClass}</h2>
      </span>
      <AnimalGrip filteredAnimals={filteredAnimals} handleEvent={handleEvent} />
    </SelectPostItLayer>
  );
}
export default Animals;

function AnimalGrip({filteredAnimals, handleEvent}:{ filteredAnimals: Animal[], handleEvent: (event: Event) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pb-24">
      {filteredAnimals.length > 0 && filteredAnimals.slice(0,16).map((info: Animal, i) => (
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



