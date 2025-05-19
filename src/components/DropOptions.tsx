interface DropOptionsItem {
    text: string;
    onClick: () => void;
}

interface DropOptionsProps {
    className?: string;
    title: string;
    items: DropOptionsItem[];
}

export function DropOptions({ className, title, items }: DropOptionsProps) {
    return (
        <ol className={className + " absolute top-0 left-0 z-10 flex flex-col bg-white/50"}>
            <li className="flex items-center gap-2 p-2"><h3 className="text-xl font-medium">{title}</h3></li>
            {items.map((item, index) => (
                <li key={index} className="flex items-center">
                    <button className="flex items-center gap-2 p-2 transition-transform opacity-70 hover:opacity-100 cursor-pointer group" onClick={item.onClick}>
                        <span className="w-4 h-0.5 bg-black rounded-4xl opacity-0 group-hover:opacity-100"></span>
                        <h4 className="text-sm">{item.text}</h4>
                    </button>
                </li>
            ))}
        </ol>
    )
}
export default DropOptions;