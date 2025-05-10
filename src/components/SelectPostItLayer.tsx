import { ReactNode } from "react"
import { useNavigate } from "react-router-dom";
import { navigateTransitionToMenu } from "#components/TransitionToMenuButton.tsx";

export function SelectPostItLayer({  children, isLargePadding }: { children?: ReactNode | undefined, isLargePadding: boolean }) {
    const navigate = useNavigate();

    const onMouseEnter = () => {
        navigateTransitionToMenu(navigate, "/")
    }
    
    return (
        <>
            <div
            className="bg-red-500 overflow-hidden transition-all duration-500 delay-200"
            style={{ height: isLargePadding ? '10rem' : '0'}}
            onMouseEnter={onMouseEnter}
            >
                
            </div>
            <div className="pageContainer">
                {children}
            </div>
        </>
    )
}

export default SelectPostItLayer