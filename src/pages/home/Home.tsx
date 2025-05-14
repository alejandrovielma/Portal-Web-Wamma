import NavMenu from "#components/NavMenu.js";
import SearchBar from "#components/SearchBar.tsx";
import { TransitionToPage } from "#components/TransitionToPage.tsx";
import GlobalGrip from "#components/globalgrid/GlobalGrid.tsx";
import { useState } from "react";

export function Home() {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY });
  };

  const handleClose = () => setMenu(null);

  return (
    <div className="relative min-h-screen" onContextMenu={handleContextMenu}>
      <GlobalGrip/>
      <SearchBar/>
      <NavMenu text="Menu"/>
      <TransitionToPage/>
      {menu && (
        <>
        {/* Overlay para cerrar el menú al hacer clic fuera */}
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
        />
        <div
          className="absolute bg-white border rounded shadow p-2 z-50"
          style={{ top: menu.y, left: menu.x }}
        >
          <button className="block w-full text-left">Opción 1</button>
          <button className="block w-full text-left">Opción 2</button>
        </div>
      </>
      )}
    </div>
  );
}
export default Home;
