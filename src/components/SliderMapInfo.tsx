import ExpandedSVG from "#assets/ExpandedSVG.tsx";
import { useEffect, useRef, useState } from "react";
import { PostItMapProps } from "./PostIts/PostItMap";
import gsap from "gsap";
import CompressSVG from "#assets/CompressSVG.tsx";
import UnitPostItMap from "./UnitPostItMap";
import { LocationFact } from "#lib/liveLocationSearch.ts";


export interface RealatesDestination {
    onClick: () => void;
    content: PostItMapProps;
}

export function SliderMapInfo({ content, realates, handleDrag, onClose, isLiveResult, liveFacts, liveSourceUrl, onAddToHome, addedToHome }: { content?: PostItMapProps; realates?: RealatesDestination[], handleDrag: (event: Event) => void, onClose: () => void, isLiveResult?: boolean, liveFacts?: LocationFact[], liveSourceUrl?: string, onAddToHome?: () => void, addedToHome?: boolean }) {
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
            style={{ width: 0 }}
            className={`absolute pt-14 sm:pt-20 top-0 right-0 h-full overflow-y-scroll overflow-x-hidden bg-sand/95 sm:bg-sand/90 backdrop-blur-md shadow-2xl shadow-dark-tertiary/20 sm:rounded-l-[2rem] flex flex-col ${content ? "" : "pointer-events-none"}`}
        >
            {
                content
                    ? (
                        <div className="p-4 h-full flex flex-col">
                            {
                                !isExpanded
                                    ? CloseSlider({ content, realates, onOpen: () => setIsExpanded(true), onClose, handleDrag, isLiveResult, liveFacts, liveSourceUrl, onAddToHome, addedToHome })
                                    : OpenSlider({ content, onClose: () => setIsExpanded(false), isLiveResult, liveFacts, liveSourceUrl, onAddToHome, addedToHome })
                            }
                        </div>
                    )
                    : null
            }
        </aside>
    )
}
export default SliderMapInfo;

function LiveFactsFooter({ facts, sourceUrl }: { facts?: LocationFact[]; sourceUrl?: string }) {
    if ((!facts || facts.length === 0) && !sourceUrl) return null;
    return (
        <div className="flex flex-col gap-1">
            {facts && facts.length > 0 && (
                <ul className="text-sm text-shadow-50/80 flex flex-col gap-0.5">
                    {facts.map((fact) => (
                        <li key={fact.label}>
                            <span className="font-semibold">{fact.label}:</span> {fact.value}
                        </li>
                    ))}
                </ul>
            )}
            {sourceUrl && (
                <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-light-secondary hover:underline w-fit"
                >
                    Fuente: OpenStreetMap
                </a>
            )}
        </div>
    );
}

function AddToHomeButton({ onAddToHome, addedToHome }: { onAddToHome?: () => void; addedToHome?: boolean }) {
    if (!onAddToHome) return null;
    return (
        <button
            onClick={onAddToHome}
            disabled={addedToHome}
            className={`w-fit text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:cursor-default ${addedToHome ? "bg-leaf/20 text-leaf-dark" : "bg-leaf text-white hover:bg-leaf-dark"}`}
        >
            {addedToHome ? "✓ Agregado a Inicio" : "+ Agregar a Inicio"}
        </button>
    );
}

function OpenSlider({ content, onClose, isLiveResult, liveFacts, liveSourceUrl, onAddToHome, addedToHome }: { content: PostItMapProps; realates?: RealatesDestination[], onClose: () => void, isLiveResult?: boolean, liveFacts?: LocationFact[], liveSourceUrl?: string, onAddToHome?: () => void, addedToHome?: boolean }) {
    return (
        <div id="content" className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="sticky top-0 -mx-4 px-4 py-2 z-10 bg-sand flex flex-col shadow-sm">
                <button onClick={onClose} className="cursor-pointer size-9 rounded-full bg-light-primary/15 hover:bg-light-primary/25 flex items-center justify-center transition-colors text-dark-tertiary"><CompressSVG /></button>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <section className="flex-1 flex flex-col gap-4">
                    <h1 className="font-titles text-2xl sm:text-3xl text-dark-tertiary">{content.title}</h1>
                    <AddToHomeButton onAddToHome={onAddToHome} addedToHome={addedToHome} />
                    <p>{content.description}</p>
                    {isLiveResult && <LiveFactsFooter facts={liveFacts} sourceUrl={liveSourceUrl} />}
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

function CloseSlider({ content, realates, onOpen, onClose, handleDrag, isLiveResult, liveFacts, liveSourceUrl, onAddToHome, addedToHome }: { content: PostItMapProps; realates?: RealatesDestination[], onOpen: () => void, onClose: () => void, handleDrag: (event: Event) => void, isLiveResult?: boolean, liveFacts?: LocationFact[], liveSourceUrl?: string, onAddToHome?: () => void, addedToHome?: boolean }) {
    return (
        <div id="content" className="flex flex-col gap-4 h-full">
            <header className="sticky top-0 -mx-4 px-4 py-2 z-10 bg-sand flex justify-between items-center gap-2 sm:gap-4 shadow-sm">
                <button onClick={onOpen} className="cursor-pointer size-9 shrink-0 rounded-full bg-light-primary/15 hover:bg-light-primary/25 flex items-center justify-center transition-colors text-dark-tertiary" ><ExpandedSVG /></button>
                <h2 className="text-lg sm:text-xl font-titles flex-1 text-dark-tertiary truncate">{content?.title}</h2>
                <button onClick={onClose} className="cursor-pointer size-9 shrink-0 rounded-full bg-dark-tertiary/10 hover:bg-dark-tertiary/20 flex items-center justify-center transition-colors text-dark-tertiary">✕</button>
            </header>
            <div className="flex flex-col gap-8 justify-between h-full">
                <div className="flex flex-col gap-4">
                    <AddToHomeButton onAddToHome={onAddToHome} addedToHome={addedToHome} />
                    <UnitPostItMap key={content.title} postItProds={content} handleEvent={handleDrag}/>
                    <p>
                        {content?.description && content.description.length > 240
                            ? content.description.slice(0, 240) + '...'
                            : content?.description}
                    </p>
                    {isLiveResult && <LiveFactsFooter facts={liveFacts} sourceUrl={liveSourceUrl} />}
                </div>
                {realates && realates.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-dark-tertiary/70">Otros lugares para visitar</h3>
                        <span className="flex gap-2 overflow-x-auto">
                            {realates.map((related, index) => (
                                <RelateCard key={index} relate={related} />
                            ))}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

function RelateCard({ relate }: { relate: RealatesDestination }) {
    const [imageFailed, setImageFailed] = useState(false);
    const image = relate.content.images[0];

    return (
        <button onClick={relate.onClick} className="flex overflow-hidden flex-col shrink-0 w-28 h-32 bg-light-secondary/50 shadow-md rounded-2xl transition-all cursor-pointer hover:bg-light-secondary/70 hover:-translate-y-1">
            <div className="h-1/2 bg-leaf/20">
                {image && !imageFailed ? (
                    <img
                        className="w-full h-full object-cover"
                        src={image}
                        alt={relate.content.title}
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-leaf-dark text-2xl">💧</div>
                )}
            </div>
            <div className="p-2">
                <h4 className="text-left text-sm">{relate.content.title}</h4>
            </div>
        </button>
    )
}