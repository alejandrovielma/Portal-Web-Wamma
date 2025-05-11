import { ReactNode } from "react";
import { NavigateFunction, NavigateOptions, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export function navigateTransitionToMenu(navigate: NavigateFunction, href: string, options?: NavigateOptions) {
  gsap.to(".pageContainer", {
    y: "100vh",
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      navigate(href, options)
    },
  });
}

export function TransitionToMenuButton(
  {children, className ,href}:
  {children?: ReactNode | undefined, className:string  ,href: string}
) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigateTransitionToMenu(navigate, href);
  } 

  return (
    <button onClick={handleClick} className={className}>
    {children}
    </button>
  )
}