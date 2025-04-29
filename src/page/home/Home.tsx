import { useEffect, useRef } from 'react'
import { GridStack } from 'gridstack';
import './Home.css'

function Home() {

  useEffect(() => {
    const grid = GridStack.init();
    grid.addWidget({w: 2, content: 'item 1'});
  }, []);

  return (
    <>
        <h1>GridStack</h1>
        <div className="grid-stack"></div>
    </>
  );
}

export default Home;
