import { NavigateFunction, NavigateOptions } from "react-router-dom";
import { NavHeader } from "./NavHeader";
import { gsap } from "gsap";

export function navigateAnimateToPage(navigate: NavigateFunction, href: string, options?: NavigateOptions) {
    console.log("click");
    gsap.to(".animatePageContainer", {
      y: "0%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        navigate(href, options);
      },
    });
  } 

export function TransitionToPage() {
  return (
    <>
      <div className="animatePageContainer bg-white z-50 fixed top-0 left-0 w-full h-full translate-y-full">
        <NavHeader breadcrumbs={[]}/>
      </div>
    </>
  )
}