import { ReactNode, useEffect } from "react"
import GlobalGrip from "./globalgrid/GlobalGrid";
import { gsap } from "gsap";

export function SelectPostItLayer({  children, isDragging }: { children?: ReactNode | undefined, isDragging: boolean }) {
    function onMouseEnter(){
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
        <div className="overflow-hidden h-screen">
            <div id="gridContainer" className="overflow-hidden fixed top-0 left-0 w-full h-full -z-10">
                <GlobalGrip/>
            </div>
            <div id="expander" onMouseEnter={onMouseEnter}>

            </div>
            <div id="pageContainer" className="bg-white h-screen overflow-clip">
                <div className="overflow-y-scroll h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SelectPostItLayer