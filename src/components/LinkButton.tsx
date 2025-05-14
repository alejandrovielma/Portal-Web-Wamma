import { useNavigate } from "react-router-dom";

interface LinkButtonProps {
    children?: React.ReactNode;
    href: string;
}

export function LinkButton({children, href}: LinkButtonProps) {
    const navigate = useNavigate();

    function onClick(){
        navigate(href);
    }

    return (
        <a onClick={onClick} className="flex tems-center justify-center px-6 py-1 text-sm font-medium text-white bg-shadow-50 rounded-2xl shadow-sm hover:bg-neutral-800">
            {children}
        </a>
    )
}
export default LinkButton