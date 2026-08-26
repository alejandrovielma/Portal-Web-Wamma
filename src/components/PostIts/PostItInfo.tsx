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

// Normaliza cualquier link de YouTube (watch?v=, youtu.be/, o ya en
// formato embed) al formato /embed/ID que un <iframe> si puede
// reproducir -- un link watch?v=... simplemente no carga dentro de un
// iframe (YouTube lo bloquea). De paso, si el "video" es un placeholder
// invalido (ej. "EjemploVideo1") no matchea un ID real de YouTube
// (siempre 11 caracteres) y devuelve null, ocultando el reproductor
// en vez de mostrar un iframe roto.
function toYouTubeEmbedUrl(video?: string): string | null {
  if (!video) return null;
  const match = video.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export interface PostItInfoProps {
  title: string;
  content: PostItInfoContent[];
  video?: string;
  images: string[];
}

export function PostItInfo({ title, content, video, images }: PostItInfoProps) {
  const embedVideo = toYouTubeEmbedUrl(video);
  const [isPopOpen, setIsPopOpen] = useState(false);
  const { widget } = useGridStackWidgetContext();
  const { saveOptions, gridStack } = useGridStackContext();
  const [dimensions, setDimensions] = useState({ h: 2, w: 2 });

  useEffect(() => {
    if (!gridStack) return;
    function updateDimensions() {
      // @ts-ignore
      const childrens: GridStackWidget[] = saveOptions()["children"];
      const self = childrens.find(
        (child: GridStackWidget) => child.id === widget.id
      );
      setDimensions({
        h: self?.h || 2,
        w: self?.w || 2,
      });
    }
    updateDimensions();

    if (gridStack) {
      gridStack.on("change", updateDimensions);
    }
    return () => {
      if (gridStack) {
        gridStack.off("change");
      }
    };
  }, []);

  const allContent: PostItInfoProps = {
    title: title,
    content: content,
    video: video,
    images: images,
  };
  return (
    <>
      <PostItBase
        dimensions={dimensions}
        color1="bg-light-primary dark:bg-dark-primary"
        color2="bg-light-primaryVar dark:bg-dark-primaryVar"
      >
        <button
          onClick={() => {
            setIsPopOpen(true);
          }}
          className="relative flex-1 flex flex-col w-full h-full cursor-pointer group overflow-hidden"
        >
          <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"></span>
          <span className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <OpenSVG />
          </span>
          {dimensions.h <= 2 && dimensions.w <= 2 ? (
            <ContentSmall allContent={allContent} />
          ) : (
            <ContentMedium allContent={allContent} />
          )}
        </button>
      </PostItBase>
      <AnimatePresence>
        {isPopOpen && (
          <div
            className="fixed inset-0 z-200 flex items-end justify-center bg-dark-tertiary/60 backdrop-blur-sm"
            onClick={() => {
              setIsPopOpen(false);
            }}
          >
            <motion.div
              initial={{ y: "100%" }} // Ajusta este valor para cambiar el punto de inicio del modal
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full max-w-5xl bg-sand z-50 rounded-t-[2rem] shadow-2xl shadow-dark-tertiary/30 overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Evita que los clics dentro del modal lo cierren
            >
              {/* Barra superior para cerrar el modal */}
              <div className="relative flex items-center justify-center bg-gradient-to-r from-light-primary to-light-secondary p-4 rounded-t-[2rem]">
                <div className="h-1.5 w-12 bg-white/60 mx-auto rounded-full"></div>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer size-9 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors"
                  onClick={() => {
                    setIsPopOpen(false);
                  }}
                >
                  <img src="svgs/Close.svg" alt="salir" className="size-5 brightness-0 invert" />
                </button>
              </div>
              {/* Contenedor desplazable completo */}
              <div className="overflow-y-auto max-h-[85vh]">
                {" "}
                {/* Ajusta este valor para cambiar la altura máxima del modal */}
                {/* Imagen principal en la parte superior del modal */}
                {images && images[0] && (
                  <div className="relative w-full overflow-hidden mb-6">
                    <img
                      src={images[0]}
                      alt=""
                      className="w-full h-auto max-h-80 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sand to-transparent" />
                  </div>
                )}
                <div className="px-6 sm:px-8 pb-8">
                  {/* Título principal del modal */}
                  {title && (
                    <h2 className="font-titles text-3xl sm:text-4xl mb-6 text-center text-dark-tertiary">
                      {title}
                    </h2>
                  )}
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Sección de texto principal */}
                    <div className="flex-1 text-left">
                      {content.map((item, i) => (
                        <section key={i} className="mb-6">
                          {item.subtitle && (
                            <h3 className="font-titles text-xl sm:text-2xl mb-4 text-leaf-dark">
                              {item.subtitle}
                            </h3>
                          )}
                          {item.paragraphs.map((para, j) => (
                            <p key={j} className="text-base sm:text-lg mb-4 leading-relaxed text-shadow-50/85">
                              {para}
                            </p>
                          ))}
                        </section>
                      ))}
                    </div>

                    {/* Sección de imágenes y videos */}
                    <div className="flex flex-col gap-4 flex-none w-full md:w-2/5">
                      {images &&
                        images
                          .slice(1)
                          .map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt=""
                              className="w-full rounded-2xl shadow-md ring-1 ring-black/5"
                            />
                          ))}
                      {embedVideo && (
                        <iframe
                          src={embedVideo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-64 rounded-2xl shadow-md ring-1 ring-black/5"
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
  return (
    <div className="flex-1 overflow-hidden">
      <img
        className="object-cover h-full w-full"
        src={allContent.images[0]}
        alt={allContent.title}
      />
    </div>
  );
}
function ContentMedium({ allContent }: { allContent: PostItInfoProps }) {
  return (
    <>
      <div className="flex-1/4 max-h-48 overflow-hidden">
        <img
          className="object-cover h-full w-full"
          src={allContent.images[0]}
          alt={allContent.title}
        />
      </div>
      <div className="flex-1 px-4 py-2 flex flex-col gap-2">
        <h2 className="font-titles text-left text-xl">{allContent.title}</h2>
        <p className="text-left">
          {allContent.content[0]?.paragraphs?.join(" ")}
        </p>
      </div>
    </>
  );
}
