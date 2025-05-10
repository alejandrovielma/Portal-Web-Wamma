import React, { ReactNode, useEffect, useRef } from 'react';
import { navigateAnimateToPage } from './TransitionToPage';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

interface BubbleProps {
  children?: ReactNode | undefined,
  navigate: NavigateFunction,
  href:string
}
function Bubble({children ,navigate, href}: BubbleProps) {

  const handleClick = () => {
    navigateAnimateToPage(navigate, href);
  }

  return (
    <button
      onClick={handleClick}
      className='cursor-pointer flex flex-col items-center hover:text-neutral-950 size-28 bg-white opacity-85 rounded-full shadow-md p-4 z-10'
    >
      {children}
    </button>
  )
}

interface NavMenuProps {
  text:string
}
export function NavMenu({ text}:NavMenuProps) {
  const navigate = useNavigate();
  const bubblesRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (bubblesRef.current === null) return;
    const bubbles = gsap.utils.toArray(bubblesRef.current.children);

    if (open){
      gsap.to(bubbles, {
        duration: 0.5,
        ease: "power2.inOut",
        opacity: 1,
        y: (i:number) => (i == 1 || i == 2) ? -280 : -200,
      })
    }else{
      gsap.to(bubbles, {
        duration: 0.5,
        ease: "power2.inOut",
        opacity: 1,
        y: 0,
      })
    }
  }, [open]);

  const onClick = () => {
      setOpen(!open);
  }

  return (
    <div ref={componentRef} className="w-50 z-10 flex flex-col items-center bottom-0 left-1/2 -translate-x-1/2 fixed">
        <button
        onClick={onClick}
        className="hover:h-13 hover:bg-neutral-950 cursor-pointer flex flex-row justify-center items-center gap-2.5 bg-black left-1/2 w-50 h-12 text-4xl rounded-t-full text-white transition-all duration-300 ease-in-out"
      >
        {text}
      </button>
      <div ref={bubblesRef} className='flex gap-8 absolute translate-y-full'>
        <Bubble navigate={navigate} href='/actualidad'>
          <h4 className="text-black font-semibold text-center">Actualidad</h4>
          <img className="w-5/12" src="./Public/svgs/Actualidad.svg" alt="Actualidad" />
        </Bubble>
        <Bubble navigate={navigate} href='/animales'>
          <h4 className="text-black font-semibold text-center">Animales</h4>
            <img className="w-7/12" src="./Public/svgs/Animales.svg" alt="Animales" />
        </Bubble>
        <Bubble navigate={navigate} href='/biblioteca'>
           <h4 className="text-black font-semibold text-center">Biblioteca</h4>
            <img className="w-4/6" src="./Public/svgs/Biblioteca.svg" alt="Biblioteca" />
        </Bubble>
        <Bubble navigate={navigate} href='/mapa'>
          <h4 className="text-black font-semibold text-center">Mapa</h4>
            <img src="./Public/svgs/Mapa.svg" alt="Mapa" />
        </Bubble>
      </div>
    </div>
  )
}

export default NavMenu;
