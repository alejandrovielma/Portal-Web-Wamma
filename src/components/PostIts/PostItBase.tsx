import { ReactNode } from "react";

export function PostItBase({ children, color1, color2 }: { children?: ReactNode | undefined, color1: string, color2: string, className?: string }) {
    const triangleSize = "2rem";

    return (
        <div className={`${color1} w-full h-full relative`}
        style={{ clipPath: `polygon(calc(100% - ${triangleSize}) 0, 100% ${triangleSize}, 100% 100%, 0 100%, 0 0)`}}
        >
            <div className={`${color2} size-[${triangleSize}] absolute top-0 right-0 z-10`}></div>

            <span className="flex items-center justify-center w-full h-10">
                <h1>*</h1>
            </span>

            {children}
        </div>
    )
}

export default PostItBase;