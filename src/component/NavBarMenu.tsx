
interface NavBarMenuProps {
    text: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function NavBarMenu({text}: NavBarMenuProps) {

    return (
        <button className="z-10 flex-row justify-center transition-all duration-300 hover:h-16 items-center gap-2.5 bg-black left-1/2 right-0 bottom-0 transform -translate-x-1/2 fixed w-50 h-12 text-4xl rounded  text-white" >
            {text}
        </button>
    )



}   

export default NavBarMenu