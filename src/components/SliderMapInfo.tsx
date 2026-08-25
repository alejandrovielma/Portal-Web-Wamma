import ExpandedSVG from "#assets/ExpandedSVG.tsx";
import { useEffect, useRef, useState } from "react";
import { PostItMapProps } from "./PostIts/PostItMap";
import gsap from "gsap";
import CompressSVG from "#assets/CompressSVG.tsx";
import UnitPostItMap from "./UnitPostItMap";


export interface RealatesDestination {
    onClick: () => void;
    content: PostItMapProps;
}

export function SliderMapInfo({ content, realates, handleDrag, onClose }: { content?: PostItMapProps; realates?: RealatesDestination[], handleDrag: (event: Event) => void, onClose: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const asideRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (asideRef.current) {
            const isMobile = window.innerWidth < 640;
            const width = !content ? "0px" : isExpanded ? (isMobile ? "100%" : "80%") : (isMobile ? "100%" : "24rem");
            gsap.to(asideRef.current, {
                width,
                duration: 0.5,
                ease: "power2.inOut"
            });
            if (content) {
                gsap.fromTo("#content",
                    { opacity: 0, },
                    { opacity: 1, duration: 0.8, ease: "power2.inOut" }
                );
            }
        }
    }, [isExpanded, content]);

    return (
        <aside
            ref={asideRef}
            style={{ width: 0, padding: 0 }}
            className={`absolute pt-14 sm:pt-20 top-0 right-0 h-full overflow-y-scroll overflow-x-hidden bg-sand/95 sm:bg-sand/90 backdrop-blur-md shadow-2xl shadow-dark-tertiary/20 sm:rounded-l-[2rem] flex flex-col ${content ? "" : "pointer-events-none"}`}
        >
            {
                content
                    ? (
                        <div className="p-4 h-full flex flex-col">
                            {
                                !isExpanded
                                    ? CloseSlider({ content, realates, onOpen: () => setIsExpanded(true), onClose, handleDrag })
                                    : OpenSlider({ content, onClose: () => setIsExpanded(false) })
                            }
                        </div>
                    )
                    : null
            }
        </aside>
    )
}
export default SliderMapInfo;

function OpenSlider({ content, onClose }: { content: PostItMapProps; realates?: RealatesDestination[], onClose: () => void }) {
    return (
        <div id="content" className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col">
                <button onClick={onClose} className="cursor-pointer size-9 rounded-full bg-light-primary/15 hover:bg-light-primary/25 flex items-center justify-center transition-colors text-dark-tertiary"><CompressSVG /></button>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <section className="flex-1 flex flex-col gap-4">
                    <h1 className="font-titles text-2xl sm:text-3xl text-dark-tertiary">{content.title}</h1>
                    <p>{content.description}</p>
                </section>
                <section className="flex-1/3">
                    <article>

                    </article>
                    <article className="grid grid-cols-2 gap-4">
                        {
                            content.images.map((image, index) => (
                                <img key={index} src={image} alt={content.title} className="w-full h-full object-cover" />
                            ))
                        }
                    </article>
                </section>
            </div>
        </div>
    )
}

function CloseSlider({ content, realates, onOpen, onClose, handleDrag }: { content: PostItMapProps; realates?: RealatesDestination[], onOpen: () => void, onClose: () => void, handleDrag: (event: Event) => void }) {
    return (
        <div id="content" className="flex flex-col gap-4 h-full">
            <header className="flex justify-between items-center gap-2 sm:gap-4">
                <button onClick={onOpen} className="cursor-pointer size-9 shrink-0 rounded-full bg-light-primary/15 hover:bg-light-primary/25 flex items-center justify-center transition-colors text-dark-tertiary" ><ExpandedSVG /></button>
                <h2 className="text-lg sm:text-xl font-titles flex-1 text-dark-tertiary truncate">{content?.title}</h2>
                <button onClick={onClose} className="cursor-pointer size-9 shrink-0 rounded-full bg-dark-tertiary/10 hover:bg-dark-tertiary/20 flex items-center justify-center transition-colors text-dark-tertiary">✕</button>
            </header>
            <div className="flex flex-col gap-8 justify-between h-full">
                <div className="flex flex-col gap-4">
                    <UnitPostItMap key={content.title} postItProds={content} handleEvent={handleDrag}/>
                    <p>
                        {content?.description && content.description.length > 240
                            ? content.description.slice(0, 240) + '...'
                            : content?.description}
                    </p>
                </div>
                <span className="flex gap-2">
                    {
                        realates && realates.length > 0 && realates.map((related, index) => (
                            <RelateCard key={index} relate={related} />
                        ))
                    }
                </span>
            </div>
        </div>
    )
}

function RelateCard({ relate }: { relate: RealatesDestination }) {


    return (
        <button onClick={relate.onClick} className="flex overflow-hidden flex-col bg-light-secondary/50 shadow-md rounded-2xl transition-all cursor-pointer hover:bg-light-secondary/70 hover:-translate-y-1">
            <div className="h-1/2">
                <img className="w-full h-full object-cover" src={relate.content.images[0]} alt={relate.content.title} />
            </div>
            <div className="p-2">
                <h4 className="text-left text-sm">{relate.content.title}</h4>
            </div>
        </button>
    )
}