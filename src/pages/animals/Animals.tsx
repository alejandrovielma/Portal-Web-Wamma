import NavBubbleAnimals from "#components/NavBubbleAnimals.tsx";
import { NavHeader } from "#components/NavHeader.tsx";
import { SearchBar } from "#components/SearchBar.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostItInfoAnimals from "#components/UnitPostItInfoAnimals.tsx";
import { getAllAnimals } from "../../data/dataBase/repository";
import { useState, useEffect } from "react";
import { PostItInfoAnimalsProps } from "#components/PostIts/PostItInfoAnimals.tsx";

export function Animals() {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState<PostItInfoAnimalsProps[]>([]);
  const [animals, setAnimals] = useState<PostItInfoAnimalsProps[]>(getAllAnimals())

  useEffect(() => {
    const results = animals.filter((animal) =>
      animal.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/*filteredAnimals.length > 0 ? (
        <AnimalsGrid handleDrag={handleEvent} animals={filteredAnimals} />
      ) : (
        <p className="text-center translate-x-14 text-6xl text-gray-500">
          No se encontró el artículo solicitado
        </p>
      )*/}

      
    </SelectPostItLayer>
  );
}

export default Animals;

/*function AnimalsGrid({ handleDrag, animals }: { handleDrag: (event: Event) => void; animals: PostItInfoAnimalsProps[] }) {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-4">
      {animals.map((animal: PostItInfoAnimalsProps, i) => (
        <article key={i} className="flex flex-col items-center justify-center">
          <UnitPostItInfoAnimals key={animal.scientificName} postItProds={animal} handleEvent={handleDrag} />
        </article>
      ))}
    </div>
  );
}*/



