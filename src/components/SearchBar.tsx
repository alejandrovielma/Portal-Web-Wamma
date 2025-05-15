import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm); 
  };

  return (
    <div className="z-10 w-1/3 ring-2 ring-black flex items-center relative top-24 left-1/2 -translate-x-1/2 m-4 p-2 rounded-full bg-white opacity-85">
      <input
        type="text"
        placeholder="¿Que Buscas?"
        value={searchTerm}
        onChange={handleInputChange}
        className="border-0 p-2 w-11/12 focus-visible:outline-0"
      />
      {searchTerm && (
        <button onClick={() => { setSearchTerm(""); onSearch(""); }} className="ml-2 px-2 py-1 flex items-center justify-center cursor-pointer">
          <span className="h-6 w-6">
            <img className="h-full w-full" src="./Public/svgs/Close.svg" alt="Limpiar búsqueda" />
          </span>
        </button>
      )}
    </div>
  );
};