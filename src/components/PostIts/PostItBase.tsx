import { ReactNode } from "react";

export function PostItBase({ children, color1, color2 }: { children?: ReactNode | undefined, color1: string, color2: string, className?: string }) {

    return (
        <div className={`${color1} w-full h-full relative overflow-hidden`}
        style={{ clipPath: `polygon(calc(100% - 2rem) 0, 100% 2rem, 100% 100%, 0 100%, 0 0)`}}
        >
            <div className={`${color2} size-8 absolute top-0 right-0 z-10`}></div>

            <span className="flex items-center justify-center w-full h-10">
                <div className="size-6 border-1 rounded-full text-center">*</div>
            </span>

            {children}
        </div>
    )
}

export default PostItBase;