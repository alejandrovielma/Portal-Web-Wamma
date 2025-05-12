import { BreadcrumbItem, generateBreadcrumbs, NavHeader } from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";



export function Library() {

    const [isDragging, setIsDragging] = useState(false);
    function handleEvent(event: Event) {
        setIsDragging(event.type === 'dragstart');
    }

    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs(pathSegments);

    return (
        <SelectPostItLayer isDragging={isDragging}>
            <NavHeader breadcrumbs={breadcrumbs} />
            <div className="size-60">
                <UnitPostIt imageLink="images/homeBg.jpg" handleEvent={handleEvent}/>
            </div>
        </SelectPostItLayer>
    )
}
export default Library;