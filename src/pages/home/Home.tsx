import NavMenu from "#components/NavMenu.js";
import { TransitionToPage } from "#components/TransitionToPage.tsx";
import GlobalGrip from "#components/globalgrid/GlobalGrid.tsx";

export function Home() {
  
  return (
    <>
      <GlobalGrip/>
      <NavMenu text="Menu"/>
      <TransitionToPage/>
    </>
  );
}

export default Home;

