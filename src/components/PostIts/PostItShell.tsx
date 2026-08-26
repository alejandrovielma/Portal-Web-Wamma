import { ReactNode } from "react";

// La misma cascara visual que PostItBase (fondo de color, esquina
// doblada, el pin de arriba) pero sin depender del contexto de
// GridStack -- para usar en listas de resultados que no son widgets
// arrastrables (ej. las tarjetas de busqueda en vivo), y que aun asi se
// vean parte de la misma familia de postits que el resto del sitio.
interface PostItShellProps {
    children?: ReactNode;
    color1?: string;
    color2?: string;
}

export function PostItShell({
    children,
    color1 = "bg-light-primary dark:bg-dark-primary",
    color2 = "bg-light-primaryVar dark:bg-dark-primaryVar",
}: PostItShellProps) {
    return (
        <div
            className={`${color1} w-full h-full flex-col flex relative overflow-hidden drop-shadow-[0_6px_14px_rgba(1,46,65,0.18)] group-hover:drop-shadow-[0_10px_22px_rgba(1,46,65,0.28)] transition-[filter] duration-300`}
            style={{ clipPath: `polygon(calc(100% - 2rem) 0, 100% 2rem, 100% 100%, 0 100%, 0 0)` }}
        >
            <div className={`${color2} size-8 absolute top-0 right-0 z-10 shadow-[inset_4px_-4px_6px_rgba(0,0,0,0.15)]`}></div>

            <span className="flex items-start justify-center w-full py-2.5 shrink-0">
                <div className="size-4 bg-black rounded-full shadow-md"></div>
            </span>

            <div className="bg-white/10 flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    );
}

export default PostItShell;
