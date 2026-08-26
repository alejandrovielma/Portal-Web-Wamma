interface NavBubbleAnimalsProps {
  setfiltered: (value: string) => void;
  setBackgroundImage: (img: string) => void;
}

export function NavBubbleAnimals({ setfiltered, setBackgroundImage }: NavBubbleAnimalsProps) {
  const bubbleItems = [
    {
      name: "Anfibios",
      info: "Los anfibios son vertebrados de 'doble vida'.",
      image: "/images/rana.jpg",
      class: "Amphibia",
      // bg-anfibios.webp: foto de "portioid" en iNaturalist (CC BY 4.0)
      // https://www.inaturalist.org/photos/622903407 -- se eligio porque
      // el sapito queda bien encuadrado tanto en el recorte alto de
      // mobile como en el recorte panoramico de escritorio.
      background: "/images/bg-anfibios.webp"
    },
    {
      name: "Mamíferos",
      info: "Los mamíferos tienen glándulas mamarias.",
      image: "/images/tonia.jpg",
      class: "Mammalia",
      background: "/images/bg-mamiferos.webp"
    },
    {
      name: "Aves",
      info: "Las aves acuáticas viven en hábitats acuáticos.",
      image: "/images/Garzas.jpg",
      class: "Aves",
      background: "/images/bg-aves.webp"
    },
    {
      name: "Crustáceos",
      info: "Los crustáceos tienen un exoesqueleto duro.",
      image: "/images/Crustaceos.jpg",
      class: "Crustacea",
      background: "/images/bg-crustaceos.webp"
    },
    {
      name: "Reptiles",
      info: "Los reptiles tienen piel seca y escamosa.",
      image: "/images/Reptiles.jpg",
      class: "Reptilia",
      background: "/images/bg-reptiles.webp"
    },
    {
      name: "Peces",
      info: "Los peces tienen branquias para respirar.",
      image: "/images/peces.jpg",
      class: "Actinopterygii",
      background: "/images/bg-peces.webp"
    },
  ];

  return (
    <nav className="flex flex-wrap mt-24 md:mt-44 justify-center items-center gap-x-6 gap-y-8 sm:gap-x-8 md:gap-x-10 lg:gap-x-16 px-4">
      {bubbleItems.map((item, index) => (
        <button
          key={index}
          className={`relative group w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-gray-300 shadow-red-600 hover:scale-110 transition-transform duration-300 cursor-pointer ${ index % 2 !== 1 ? "lg:-top-10" : "" }`}
          title={item.name}
          onClick={() => {
            setfiltered(item.class);
            setBackgroundImage(item.background);
          }}
        >
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
            <div className="bg-white border border-gray-200 rounded shadow-md p-3 w-56 sm:w-72 max-w-[80vw] z-60">
              <h4 className="text-sm font-bold text-center">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.info}</p>
            </div>
          </div>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-full" />
        </button>
      ))}
    </nav>
  );
}

export default NavBubbleAnimals;

