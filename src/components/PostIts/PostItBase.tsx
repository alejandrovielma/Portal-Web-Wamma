import React, { ReactNode, useRef, useState, useEffect } from "react";
import { gsap } from 'gsap';
import { useGridStackWidgetContext } from "#lib/gridStackLib/grid-stack-widget-context.ts";
import { useGridStackContext } from "#lib/gridStackLib/grid-stack-context.ts";
import TrashSVG from "#assets/TrashSVG.tsx";

export function PostItBase({ children, color1, color2, dimensions }: { children?: ReactNode | undefined, color1: string, color2: string, dimensions?: { h: number, w: number } }) {
    const pinRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pinHeadRef = useRef<HTMLDivElement>(null);
    const [isPinVisible, setIsPinVisible] = useState(true);
    const isDragging = useRef(false);

    const handleMouseEnter = () => {
        if (pinRef.current && pinHeadRef.current && !isDragging.current) {
            gsap.to(pinRef.current, {
                y: 12,
                scale: 1.5,
                duration: 0.2,
                ease: 'power2.out',
            });
            gsap.to(pinHeadRef.current, {
                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                duration: 0.2,
                ease: 'power2.out',
            });
        }
    };

    const handleMouseLeave = () => {
        if (pinRef.current && pinHeadRef.current && !isDragging.current) {
            gsap.to(pinRef.current, {
                y: 0,
                scale: 1,
                duration: 0.2,
                ease: 'power2.inOut',
            });
            gsap.to(pinHeadRef.current, {
                boxShadow: 'none',
                duration: 0.2,
                ease: 'power2.inOut',
            });
            if (containerRef.current) {
                gsap.to(containerRef.current, {
                    overflow: 'hidden',
                    duration: 0.1,
                });
            }
        }
    };

    const handleMouseDown = () => {
        isDragging.current = true;
        setIsPinVisible(false);
        if (containerRef.current) {
            containerRef.current.classList.add('cursor-grabbing');
        }
    };

    const handleMouseUp = () => {
        if (isDragging.current) {
            setIsPinVisible(true);
            isDragging.current = false
            setTimeout(() => { 
                if (pinRef.current) { 
                    gsap.fromTo(pinRef.current, 
                        { y: 12, scale: 1.5, opacity: 0 }, 
                        { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' } 
                    ); 
                } 
                if (pinHeadRef.current) { 
                    gsap.to(pinHeadRef.current, 
                        { boxShadow: 'none', duration: 0.8, ease: 'elastic.out(1, 0.3)' }
                    ); 
                } 
                if (containerRef.current) { 
                    containerRef.current.classList.remove('cursor-grabbing'); 
                    containerRef.current.classList.add('cursor-grab'); 
                } 
            }, 2); 
        } 
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const { widget } = useGridStackWidgetContext();
    const { removeWidget } = useGridStackContext();

    return (
        <div
            ref={containerRef}
            className={`${color1} w-full h-full relative overflow-hidden cursor-grab`}
            style={{ clipPath: `polygon(calc(100% - 2rem) 0, 100% 2rem, 100% 100%, 0 100%, 0 0)` }}
            onMouseDown={handleMouseDown}
        >
            <div className={`${color2} size-8 absolute top-0 right-0 z-10`}>
            </div>
            {
                (!dimensions || (dimensions?.h > 2 || dimensions?.w > 2)) && <button className="absolute top-0 left-0 h-10 z-20 cursor-pointer px-2 "
                onClick={() => {
                    if (widget) {
                        removeWidget(widget.id);
                    }
                }}
            >
                <TrashSVG/>
            </button>}

            <span
                ref={pinRef}
                
                className="flex items-start justify-center w-full h-10 pt-1.5"
            >
                {isPinVisible && (
                    <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        ref={pinHeadRef}
                        className="z-20 size-4 bg-black rounded-full shadow-md"
                    >
                    </div>
                )}
            </span>

            <div className="bg-white/10">
                {children}
            </div>

            
        </div>
    );
}

export default PostItBase;
