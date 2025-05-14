import NavMenu from "#components/NavMenu.js";
import SearchBar from "#components/SearchBar.tsx";
import { TransitionToPage } from "#components/TransitionToPage.tsx";
import GlobalGrip from "#components/globalgrid/GlobalGrid.tsx";

export function Home() {

  return (
    <>
      <GlobalGrip/>
      <SearchBar/>
      <NavMenu text="Menu"/>
      <TransitionToPage/>
      
    </>
  );
}
export default Home;
