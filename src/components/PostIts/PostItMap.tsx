import { useNavigate } from "react-router-dom";
import PostItBase from "./PostItBase";
import { navigateAnimateToPage } from "#components/TransitionToPage.tsx";
import { useGridStackWidgetContext } from "#lib/gridStackLib/grid-stack-widget-context.ts";
import { useGridStackContext } from "#lib/gridStackLib/grid-stack-context.ts";
import { useEffect, useState } from "react";
import { GridStackWidget } from "gridstack";

export interface PostItMapProps {
    title: string;
    description: string;
    images: string[];
    video: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    city?: string;
}

export function PostItMap({ title, description, images, video, coordinates, city }: PostItMapProps) {
    const navigate = useNavigate();
    const { widget } = useGridStackWidgetContext();
    const { saveOptions, gridStack } = useGridStackContext()
    const [dimensions, setDimensions] = useState({ h: 2, w: 2 });
    


    useEffect(() => {
        function updateDimensions() {
            const childrens: GridStackWidget[] = saveOptions()["children"]
            const self = childrens.find((child: GridStackWidget) => child.id === widget.id)
            setDimensions({
                h: self?.h || 2,
                w: self?.w || 2,
            })
        }
        updateDimensions();

        if (gridStack) {
            gridStack.on('change', updateDimensions);
        }
        return () => {
            if (gridStack) {
                gridStack.off('change');
            }
        };

    }, [])


    function handleClick() {
        navigateAnimateToPage(navigate, `/mapa`, {
            state: {
                coordinates,
            }
        });
    }

    const content: PostItMapProps = {
        title,
        description,
        images,
        video,
        coordinates,
        city
    }
    return (
        <PostItBase dimensions={dimensions} color1="bg-light-secondary dark:bg-dark-secondary" color2="bg-light-secondaryVar dark:bg-dark-secondaryVar">
            <button onClick={handleClick} className="flex flex-col gap-2 w-full h-full cursor-pointer">
                {
                    dimensions.h <= 2 && dimensions.w <= 2 ? <ContentSmall content={content} /> :
                        dimensions.h <= 4 && dimensions.w <= 4 ? <ContentMedium content={content} /> :
                            <ContentLarge content={content} />
                }

            </button>
        </PostItBase>
    );
}
export default PostItMap;

function ContentSmall({ content }: { content: PostItMapProps }) {
    return <img className="flex-1" src={content.images[0]} alt={content.title} />
}
function ContentMedium({ content }: { content: PostItMapProps }) {
    return (
        <>
            <h2 className="font-titles text-left text-xl" >{content.title}</h2>
            <img className="flex-1" src={content.images[0]} alt={content.title} />
        </>
    )
}
function ContentLarge({ content }: { content: PostItMapProps }) {
    return (
        <>
            <div>
                <h2 className="font-titles text-left text-xl" >{content.title}</h2>
                <img className="flex-1" src={content.images[0]} alt={content.title} />
            </div>
            <div>

            </div>
        </>

    )
}