import React, { useRef, useEffect, ReactNode } from 'react';
import { navigateAnimateToPage } from './TransitionToPage';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface BubbleMenuProps {
  isVisible: boolean;
  onClose: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement>;
}

function Bubble({children ,navigate}: {children?: ReactNode | undefined, navigate: NavigateFunction}) {

  const handleClick = () => {
    navigateAnimateToPage(navigate, './Animales');
  }

  return (
    <button
      onClick={handleClick}
      className='flex flex-col items-center w-28 h-28 bg-white opacity-85 rounded-full shadow-md p-4 transition-all duration-600 ease-in-out'
    >
      {children}
    </button>
  )
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ isVisible, onClose, menuButtonRef }) => {
  const navigate = useNavigate();
  const bubbleMenuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ bottom: 0, left: 0 });

  useEffect(() => {
    if (menuButtonRef.current && isVisible) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setPosition({
        bottom: window.innerHeight - rect.top + 10,
        left: rect.left + rect.width / 2 - (bubbleMenuRef.current?.offsetWidth || 300) / 2,
      });
    }
  }, [isVisible, menuButtonRef]);

  return (
    <div
      ref={bubbleMenuRef}
      className={`fixed z-20 flex flex-row justify-between w-2/5 transition-all duration-700 ease-in-out`}

    >
        <Bubble navigate={navigate}>
          <h4 className="text-black font-semibold text-center">Actualidad</h4>
          <img className="w-5/12" src="./Public/svgs/Actualidad.svg" alt="Actualidad" />
        </Bubble>
        {/* Actualidad 
        <a href="./Actualidad" onClick={onClose}>
          <div className={`flex flex-col items-center w-28 h-28 bg-white opacity-85 rounded-full shadow-md p-4 transition-all duration-600 ease-in-out  ${
            isVisible ? 'opacity-95 translate-y-10' : ''
          }`}>
            <h4 className="text-black font-semibold text-center">Actualidad</h4>
            <img className="w-5/12" src="./Public/svgs/Actualidad.svg" alt="Actualidad" />
          </div>
        </a>

        <a href="./Animales" onClick={onClose}>
          <div className={`flex flex-col items-center w-28 h-28 bg-white opacity-85 rounded-full shadow-md p-4 transition-all duration-600 ease-in-out  ${
            isVisible ? 'opacity-95 -translate-y-10' : ''
          }`}>
            <h4 className="text-black font-semibold text-center">Animales</h4>
            <img className="w-7/12" src="./Public/svgs/Animales.svg" alt="Animales" />
          </div>
        </a>

        <a href="./Biblioteca" onClick={onClose}>
          <div className={`flex flex-col items-center w-28 h-28 bg-white opacity-85 rounded-full shadow-md p-4 transition-all duration-600 ease-in-out  ${
            isVisible ? 'opacity-95 -translate-y-10' : ''
          }`}>
            <h4 className="text-black font-semibold text-center">Biblioteca</h4>
            <img className="w-4/6" src="./Public/svgs/Biblioteca.svg" alt="Biblioteca" />
          </div>
        </a>

        <a href="./Mapa" onClick={onClose}>
          <div className={`flex flex-col items-center w-28 h-28 bg-white opacity-85 rounded-full shadow-md p-4 transition-all duration-600 ease-in-out  ${
            isVisible ? 'opacity-95 translate-y-10' : ''
          }`}>
            <h4 className="text-black font-semibold text-center">Mapa</h4>
            <img src="./Public/svgs/Mapa.svg" alt="Mapa" />
          </div>
        </a>*/}
    </div>
  );
};

export default BubbleMenu;