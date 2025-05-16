import React from "react";

export function NavBubbleAnimals({setfiltered}: {setfiltered: React.Dispatch<React.SetStateAction<string>>}) {
  const bubbleItems = [
    {
      name: "Anfibios",
      info: "Los anfibios son vertebrados de 'doble vida', ya que típicamente pasan parte de su ciclo vital en el agua y otra en la tierra.",
      image: "/images/rana.jpg",
      class: "Amphibia",
    },
    {
      name: "Mamíferos",
      info: "Los mamíferos son animales vertebrados que se caracterizan por la presencia de glándulas mamarias, que les permiten alimentar a sus crías con leche.",
      image: "/images/tonia.jpg",
      class: "Mammalia",
    },
    {
      name: "Aves",
      info: "Las aves acuáticas son un grupo diverso de aves que se han adaptado a la vida en ambientes acuáticos, incluyendo océanos, ríos, lagos y humedales.",
      image: "/images/Garzas.jpg",
      class: "Aves",
    },
    {
      name: "Crustáceos",
      info: "Los crustáceos son un grupo diverso de artrópodos, principalmente acuáticos, que se caracterizan por tener un exoesqueleto duro, cuerpos segmentados y apéndices articulados.",
      image: "/images/Crustaceos.jpg",
      class: "Crustacea",
    },
    {
      name: "Reptiles",
      info: "Los reptiles son una clase de vertebrados que incluye tortugas, cocodrilos, lagartos y serpientes. Se caracterizan por su piel seca y escamosa, su respiración pulmonar y el hecho de que ponen huevos",
      image: "/images/Reptiles.jpg",
      class: "Reptilia",
    },
    {
      name: "Peces",
      info: "Los peces son un grupo diverso de vertebrados acuáticos que se caracterizan por tener branquias para respirar, aletas para moverse y un cuerpo cubierto de escamas.",
      image: "/images/peces.jpg",
      class: "Actinopterygii",
    },
  ];

  return (
    <nav className="flex mt-44 justify-center items-center space-x-24">
      {bubbleItems.map((item, index) => (
        <button
          key={index}
          className={`relative group w-24 h-24 rounded-full border-2 border-gray-300 shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer ${
            index % 2 !== 1 ? "-top-10" : ""
          }`}
          title={item.name}
          onClick={() => {setfiltered(item.class)}}
        >

          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
            <div className="bg-white border border-gray-200 rounded shadow-md p-3 w-72 z-60">
              <div className="flex items-center">
                <div>
                  <h4 className="text-sm font-bold text-center">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.info}</p>
                </div>
              </div>
            </div>
          </div>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-full"
          />
        </button>
      ))}
    </nav>
  );
}

export default NavBubbleAnimals;
