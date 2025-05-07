interface BubbleMenuProps {
    text: string
    link: string
}
export function BubbleMenu({text, link}: BubbleMenuProps) {

    return (
        
        <a href={link} className="z-10 bottom-0 fixed" >
            <div className="flex-col justify-center content-center text-center size-16 rounded-full items-center bg-blue-500 text-white opacity-80">
                <h4>{text}</h4>
            </div>
        </a>
    )
    
    
}

export default BubbleMenu