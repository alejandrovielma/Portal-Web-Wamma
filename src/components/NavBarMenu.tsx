import React, { forwardRef } from 'react';

interface NavBarMenuProps {
  text: string;
  isVisible: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const NavBarMenu = forwardRef<HTMLButtonElement, NavBarMenuProps>(({ text, isVisible, onClick }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`z-10 flex flex-row justify-center items-center gap-2.5 bg-black left-1/2 right-0 bottom-0 transform -translate-x-1/2 fixed w-50 h-12 text-4xl rounded-t-full text-white transition-all duration-300 ease-in-out ${
        !isVisible ? 'hover:h-16 cursor-pointer' : '' 
      } `}
    >
      {text}
    </button>
  );
});

export default NavBarMenu;
