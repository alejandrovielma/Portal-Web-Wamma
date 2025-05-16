import NavBubbleAnimals from "#components/NavBubbleAnimals.tsx";
import { NavHeader } from "#components/NavHeader.tsx";
import { SearchBar } from "#components/SearchBar.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostItInfoAnimals from "#components/UnitPostItInfoAnimals.tsx";
import { getAllAnimals } from "../../data/dataBase/repository";
import { useState, useEffect } from "react";
import { PostItInfoAnimalsProps } from "#components/PostIts/PostItInfoAnimals.tsx";
import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";

export function Animals() {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState<PostItInfoProps[]>([]);
  const [animals, setAnimals] = useState<PostItInfoProps[]>(getAllAnimals())

  useEffect(() => {
    const results = animals.filter((animal) =>
      animal.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnimals(results);
  }, [searchTerm, animals]);

  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

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
          <NavBubbleAnimals />
        </div>
      </div>
      <SearchBar estilo="w-1/3" onSearch={setSearchTerm} />
      <AnimalGrip filteredAnimals={filteredAnimals} handleEvent={handleEvent} />
    </SelectPostItLayer>
  );
}
export default Animals;

function AnimalGrip({filteredAnimals, handleEvent}:{ filteredAnimals: PostItInfoProps[], handleEvent: (event: Event) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredAnimals.length > 0 && filteredAnimals.slice(0,16).map((info: PostItInfoProps, i) => (
        <article key={i} className="flex flex-col items-center justify-center shadow-xl rounded-b-xl overflow-hidden">
          <UnitPostItInfo
            key={info.title}
            postItProds={info}
            handleEvent={handleEvent}
          />
          <div>
            <h3 className="font-titles">{info.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );

}



