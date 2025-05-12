import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PopInfoProps {
    children?: React.ReactNode
    active: boolean
    onClose: () => void
}

export function PopInfo({children, active, onClose}: PopInfoProps){
    const popInfoRef = useRef<HTMLDivElement>(null);
    const popContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!popInfoRef.current || !popContainerRef.current) return;

        console.log("PopInfo active:", active);
        if (active) {
            gsap.set(popContainerRef.current, { opacity: 1, zIndex: 10 });
            gsap.fromTo(
                popInfoRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.3 }
            );
        }else{
            gsap.to(popInfoRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                onComplete: () => {
                    gsap.set(popContainerRef.current, { opacity: 0, zIndex: -10 }); // Estilos iniciales para cerrar
                },
            });
        }
    }, [active]);

    return (
        <div ref={popContainerRef} className="opacity-0 fixed top-0 left-0 w-full h-full bg-black/50 -z-10 flex justify-center items-center px-2 pt-8">
            <aside ref={popInfoRef} className="bg-white w-full h-full max-w-5xl overflow-y-auto">
                <header>
                    <button onClick={onClose} className="cursor-pointer hover:text-red-600">X</button>
                </header>
                {children}
            </aside>
        </div>
    )
}
export default PopInfo;