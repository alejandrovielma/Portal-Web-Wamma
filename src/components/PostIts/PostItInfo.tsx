import { useEffect, useState } from "react";
import PostItBase from "./PostItBase";
import { motion, AnimatePresence } from "framer-motion"; 
import { useGridStackContext } from "#lib/gridStackLib/grid-stack-context.ts";
import { useGridStackWidgetContext } from "#lib/gridStackLib/grid-stack-widget-context.ts";
import { GridStackWidget } from "gridstack";
import OpenSVG from "#assets/OpenSVG.tsx";

export interface PostItInfoContent {
    subtitle?: string;
    paragraphs: string[];
}

export interface PostItInfoProps {
    title: string;
    content: PostItInfoContent[];
    video?: string;
    images: string[];
}


export function PostItInfo({ title, content, video, images }: PostItInfoProps) {
    const [isPopOpen, setIsPopOpen] = useState(false);
    const { widget } = useGridStackWidgetContext();
    const { saveOptions, gridStack } = useGridStackContext()
    const [dimensions, setDimensions] = useState({ h: 2, w: 2 });

    useEffect(() => {
        if (!gridStack) return;
        function updateDimensions() {
            const childrens: GridStackWidget[] = saveOptions()["children"]
            const self = childrens.find((child: GridStackWidget) => child.id === widget.id)
            setDimensions({
                h: self?.h || 2,
                w: self?.w || 2,
            })
        }
        updateDimensions();

        if (gridStack) {
            gridStack.on('change', updateDimensions);
        }
        return () => {
            if (gridStack) {
                gridStack.off('change');
            }
        };

    }, [])

    const allContent: PostItInfoProps = {
        title: title,
        content: content,
        video: video,
        images: images
    }
    return (
        <>
            <PostItBase dimensions={dimensions} color1="bg-light-primary dark:bg-dark-primary" color2="bg-light-primaryVar dark:bg-dark-primaryVar">
                <button onClick={() => { setIsPopOpen(true) }} className="relative flex flex-col w-full h-full cursor-pointer group overflow-hidden">

                    <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"></span>
                    <span className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <OpenSVG />
                    </span>
                    {
                        dimensions.h <= 2 && dimensions.w <= 2 ? <ContentSmall allContent={allContent} /> :
                            <ContentMedium allContent={allContent} />
                    }
                </button>
            </PostItBase>
            {/* Modal desplegable con animación */}
            <AnimatePresence>
                {isPopOpen && (
                    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50" onClick={() => { setIsPopOpen(false) }}>
                        <motion.div
                            initial={{ y: "100%" }} // Ajusta este valor para cambiar el punto de inicio del modal
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="relative w-full max-w-5xl bg-white z-50 rounded-t-2xl shadow-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()} // Evita que los clics dentro del modal lo cierren
                        >
                            {/* Barra superior para cerrar el modal */}
                            <div className="bg-gray-200 p-4 cursor-pointer rounded-t-2xl" onClick={() => { setIsPopOpen(false) }}>
                                <div className="h-1 w-12 bg-gray-500 mx-auto rounded-full"></div>
                            </div>
                            {/* Contenedor desplazable completo */}
                            <div className="overflow-y-auto max-h-[85vh]"> {/* Ajusta este valor para cambiar la altura máxima del modal */}
                                {/* Imagen principal en la parte superior del modal */}
                                {images && images[0] && (
                                    <div className="relative w-full overflow-hidden rounded-t-2xl mb-6">
                                        <img src={images[0]} alt="" className="w-full h-auto object-contain rounded-t-2xl shadow-lg" loading="lazy" />
                                    </div>
                                )}
                                <div className="px-8 pb-8">
                                    {/* Título principal del modal */}
                                    {title && <h2 className="text-4xl font-bold mb-6 text-center">{title}</h2>}
                                    <div className="flex gap-8">
                                        {/* Sección de texto principal */}
                                        <div className="flex-1 text-left">
                                            {content.map((item, i) => (
                                                <section key={i} className="mb-6">
                                                    {item.subtitle && <h3 className="text-2xl font-semibold mb-4">{item.subtitle}</h3>}
                                                    {item.paragraphs.map((para, j) => (
                                                        <p key={j} className="text-lg mb-4">{para}</p>
                                                    ))}
                                                </section>
                                            ))}
                                        </div>

                                        {/* Sección de imágenes y videos */}
                                        <div className="flex flex-col gap-4 flex-none w-2/5">
                                            {images &&
                                                images
                                                    .slice(1)
                                                    .map((src, i) => (
                                                        <img
                                                            key={i}
                                                            src={src}
                                                            alt=""
                                                            className="w-full rounded-2xl shadow-lg"
                                                        />
                                                    ))}
                                            {video && (
                                                <iframe
                                                    src={video}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-64 rounded-2xl shadow-lg"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
export default PostItInfo;

function ContentSmall({ allContent }: { allContent: PostItInfoProps }) {
    return <img className="flex-1" src={allContent.images[0]} alt={allContent.title} />
}
function ContentMedium({ allContent }: { allContent: PostItInfoProps }) {
    return (
        <>
            <img className="flex-1" src={allContent.images[0]} alt={allContent.title} />
            <div className="flex-1/2 px-4 py-2 flex flex-col gap-2">
                <h2 className="font-titles text-left text-xl" >{allContent.title}</h2>
                <p className="text-left">{allContent.content[0]?.paragraphs?.join(' ')}</p>
            </div>
        </>
    )
}
