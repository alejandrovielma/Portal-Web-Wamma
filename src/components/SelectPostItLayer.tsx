import { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { navigateTransitionToMenu } from "#components/TransitionToMenuButton.tsx";
import GlobalGrip from "./globalgrid/GlobalGrid";
import { gsap } from "gsap";

export function SelectPostItLayer({  children, isDragging }: { children?: ReactNode | undefined, isDragging: boolean }) {
    const navigate = useNavigate();

    function handleEvent(event: Event) {
        console.log(event);
        if (event.type === 'added') {
            navigateTransitionToMenu(navigate, '/');
        }
    }

    function onMouseEnter(){
        console.log("Mouse enter");
        gsap.to("#expander", {
            duration: 0.5,
            height: "100vh",
            visibility: "hidden",
        })
        gsap.to("#gridContainer", {
            duration: 0.5,
            zIndex: 10,
        })
    }

    useEffect(()=>{
        gsap.to("#gridContainer", {
            duration: 0.5,
            zIndex: -10,
        })
        if (isDragging) {
            gsap.to("#expander", {
                duration: 0.5,
                height: "10vh",
                visibility: "visible",
            })
        }else{
            gsap.to("#expander", {
                duration: 0.5,
                height: "0vh",
                visibility: "hidden",
            })
        }

    }, [isDragging])
    
    return (
        <>
            <div id="gridContainer" className="overflow-hidden fixed top-0 left-0 w-full h-full -z-10">
                <GlobalGrip/>
            </div>
            <div id="expander" onMouseEnter={onMouseEnter}>

            </div>
            <div id="pageContainer" className="bg-white h-screen">
                {children}
            </div>
        </>
    )
}

export default SelectPostItLayer