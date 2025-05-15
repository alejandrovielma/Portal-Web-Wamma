interface ExpandedDropItem{
    title: string
    onClick?: () => void
    content?: ExpandedDropItem[]
}

interface ExpandedDropProps {
    items: ExpandedDropItem[]
}

export function ExpandedDrop({items}: ExpandedDropProps) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index} className="flex flex-col">
                    
                </li>
            ))}
        </ul>
    );

}
export default ExpandedDrop;