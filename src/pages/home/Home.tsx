import NavMenu from "#components/NavMenu.js";
import { TransitionToPage } from "#components/TransitionToPage.tsx";
import GlobalGrip from "#components/globalgrid/GlobalGrid.tsx";

export function Home() {

  return (
    <div className="bgGrid">
      <header className="bg-light-tertiary px-4 text-white flex items-center gap-4 h-20 fixed w-full z-50">
        <img src="logo.svg" alt="Logo Awani" className="size-24" />
        <div>
          <h1 className="text-2lx font-semibold text-start">Wamma</h1>
          <p className="text-sm">Aprendices del agua</p>
        </div>
      </header>
      <div className="pt-20">
        <GlobalGrip/>
      </div>
      <NavMenu text="Menu"/>
      <TransitionToPage/>
    </div>
  );
}
export default Home;
