import { TransitionToPageButton } from "./TransitionToPageButton";

interface BubbleMenuProps {
    text: string
    link: string
}
export function BubbleMenu({text, link}: BubbleMenuProps) {

    return (
        <TransitionToPageButton href={link} className="cursor-pointer z-10 bottom-0 fixed" >
            <div className="flex-col justify-center content-center text-center size-16 rounded-full items-center bg-blue-500 text-white opacity-80">
                <h4>{text}</h4>
            </div>
        </TransitionToPageButton>
    )
    
    
}

export default BubbleMenu