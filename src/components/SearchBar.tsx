import React, { useState } from "react";

interface SearchBarProps {}

export const SearchBar: React.FC<SearchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // You can perform search logic here or pass the searchTerm to a parent component
    console.log("Search Term:", searchTerm);
  };

  return (
    <div className="z-10 w-1/3 ring-2 ring-black flex items-center fixed top-0 left-1/2 -translate-x-1/2 m-4 p-2 rounded-full bg-white opacity-85">
      <input
        type="text"
        placeholder="¿Que Buscas?"
        value={searchTerm}
        onChange={handleInputChange}
        className=" border-0 p-2 w-2/3 focus-visible:outline-0"
      />
      {searchTerm && (
        <button onClick={() => setSearchTerm("")} className="ml-2 px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchBar;