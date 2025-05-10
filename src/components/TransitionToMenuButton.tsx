import { ReactNode } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export function navegateTransitionToMenu(navigate: NavigateFunction, href: string){
  gsap.to(".pageContainer", {
    y: "100vh",
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      navigate(href);
    },
  });
}

export function TransitionToMenuButton(
  {children, className ,href}:
  {children?: ReactNode | undefined, className:string  ,href: string}
) {
  const navigate = useNavigate();

  const handleClick = () => {
    navegateTransitionToMenu(navigate, href);
  } 

  return (
    <button onClick={handleClick} className={className}>
    {children}
    </button>
  )
}