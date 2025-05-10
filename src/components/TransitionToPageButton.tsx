import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { NavHeader } from "./NavHeader";
import { gsap } from "gsap";

export function TransitionToPageButton(
  {children, className ,href}:
  {children?: ReactNode | undefined, className:string  ,href: string}
) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("click");
    gsap.to(".animatePageContainer", {
      y: "0%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        navigate(href);
      },
    });
  } 

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
      </button>
      <div className="animatePageContainer bg-white z-50 fixed top-0 left-0 w-full h-full translate-y-full">
        <NavHeader breadcrumbs={[]}/>
      </div>
    </>
  )
}