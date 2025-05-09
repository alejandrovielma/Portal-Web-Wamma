import { ReactNode } from "react";

export function PostItBase({ children }: { children?: ReactNode | undefined }) {
    const triangleSize = "2rem";

    return (
        <div className="bg-blue-400 w-full h-full relative "
        style={{ clipPath: `polygon(calc(100% - ${triangleSize}) 0, 100% ${triangleSize}, 100% 100%, 0 100%, 0 0)`}}
        >
            <div className={`size-[${triangleSize}] absolute top-0 right-0 bg-blue-200 z-10`}></div>

            <span className="flex items-center justify-center w-full h-10">
                <h1>*</h1>
            </span>

            {children}
        </div>
    )
}

export default PostItBase;