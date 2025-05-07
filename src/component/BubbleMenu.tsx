interface BubbleMenuProps {
    text: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export function BubbleMenu({text}: BubbleMenuProps) {

    return (
        <button className="z-10 flex-col justify-center items-center w-7 h-7 bg-white opacity-80" >
            {text}
        </button>
    )
    
    
}

export default BubbleMenu