import { useNavigate } from "react-router-dom";
import PostItBase from "./PostItBase";
import { navigateAnimateToPage } from "#components/TransitionToPage.tsx";
import { useGridStackWidgetContext } from "#lib/gridStackLib/grid-stack-widget-context.ts";
import { useGridStackContext } from "#lib/gridStackLib/grid-stack-context.ts";
import { useEffect, useState } from "react";
import { GridStackWidget } from "gridstack";
import OpenSVG from "#assets/OpenSVG.tsx";
const WHEATHER_API = import.meta.env.VITE_WEATHER_API;

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

    const [weather, setWeather] = useState<any | undefined>(undefined);

    useEffect(() => {
        fetch(`http://api.weatherapi.com/v1/current.json?key=${WHEATHER_API}&q=${city}&aqi=no`)
            .then(response => response.json())
            .then(json => {
                if (!json.error) {
                    setWeather(json);
                } else {
                    setWeather(undefined);
                }
            })
            .catch(error => console.error("Error:", error));
    }, []);


    useEffect(() => {
        if (!gridStack) return;
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
            <button onClick={handleClick} className="relative flex flex-col w-full h-full cursor-pointer group overflow-hidden">

                <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"></span>
                <span className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <OpenSVG />
                </span>
                {
                    dimensions.h <= 2 && dimensions.w <= 2 ? <ContentSmall content={content} /> :
                        dimensions.h <= 6 && dimensions.w <= 6 ? <ContentMedium content={content} /> :
                            <ContentLarge content={content} weather={weather} />
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
function ContentLarge({ content, weather }: { content: PostItMapProps, weather?: any }) {
    console.log(weather)
    return (
        <div className="flex flex-col gap-2">
            <h2 className="font-titles text-left text-2xl" >{content.title}</h2>
            <div className="flex gap-2">
                <div className="flex flex-1 overflow-hidden">
                    <img className="h-full object-cover" src={content.images[0]} alt={content.title} />
                </div>
                <div className="flex flex-1 items-start justify-center">
                    {weather && (
                        <span className="flex flex-col justify-center items-center gap-2">
                            <img className="size-16" src={weather["current"]["condition"]["icon"]} alt="condition" />
                            <h3 className="text-xl">{weather["current"]["condition"]["text"]}</h3>
                        </span>
                    )}
                </div>
            </div>
        </div>

    )
}