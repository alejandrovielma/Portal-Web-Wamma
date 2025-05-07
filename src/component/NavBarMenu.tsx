
interface NavBarMenuProps {
    text: string
}

export function NavBarMenu({text}: NavBarMenuProps) {

    return (
        <button className="z-10 left-1/2 right-0 bottom-0 transform -translate-x-1/2 fixed border-2 border-gray-500 w-40 h-12 color-white opacity-50 p-4 bg-black bo" >
            {text}
        </button>
    )
}

export default NavBarMenu