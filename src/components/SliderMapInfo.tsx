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

export function SliderMapInfo({ content, realates, handleDrag }: { content?: PostItMapProps; realates?: RealatesDestination[], handleDrag: (event: Event) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const asideRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (asideRef.current) {
            gsap.to(asideRef.current, {
                width: isExpanded ? "80%" : "24rem",
                duration: 0.5,
                ease: "power2.inOut"
            });
            gsap.fromTo("#content",
                { opacity: 0, },
                { opacity: 1, duration: 0.8, ease: "power2.inOut" }
            );
        }
    }, [isExpanded, content]);

    return (
        <aside ref={asideRef} className="absolute pt-24 top-0 right-0 w-96 h-full overflow-y-scroll bg-white/80 shadow-lg p-4 flex flex-col">
            {
                content
                    ? (
                        !isExpanded
                            ? CloseSlider({ content, realates, onOpen: () => setIsExpanded(true), handleDrag })
                            : OpenSlider({ content, realates, onClose: () => setIsExpanded(false) })
                    )
                    : null
            }
        </aside>
    )
}
export default SliderMapInfo;

function OpenSlider({ content, realates, onClose }: { content: PostItMapProps; realates?: RealatesDestination[], onClose: () => void }) {
    return (
        <div id="content" className="flex gap-12">
            <div className="flex flex-col">
                <button onClick={onClose} className="cursor-pointer hover:text-neutral-900"><CompressSVG /></button>
            </div>
            <div className="flex gap-12">
                <section className="flex-1 flex flex-col gap-4">
                    <h1 className="font-titles text-3xl">{content.title}</h1>
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

function CloseSlider({ content, realates, onOpen, handleDrag }: { content: PostItMapProps; realates?: RealatesDestination[], onOpen: () => void, handleDrag: (event: Event) => void }) {
    return (
        <div id="content" className="flex flex-col gap-4 h-full">
            <header className="flex justify-between items-center gap-4">
                <button onClick={onOpen} className="cursor-pointer hover:text-neutral-900" ><ExpandedSVG /></button>
                <h2 className="text-xl font-titles flex-1">{content?.title}</h2>
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
        <button onClick={relate.onClick} className="flex overflow-hidden flex-col bg-light-secondary/50 shadow-lg rounded-lg transition-colors cursor-pointer hover:bg-light-secondary/70 hover:-translate-y-1">
            <div className="h-1/2">
                <img className="w-full h-full object-cover" src={relate.content.images[0]} alt={relate.content.title} />
            </div>
            <div className="p-2">
                <h4 className="text-left text-sm">{relate.content.title}</h4>
            </div>
        </button>
    )
}