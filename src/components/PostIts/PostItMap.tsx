import { useNavigate } from "react-router-dom";
import PostItBase from "./PostItBase";
import { navigateAnimateToPage } from "#components/TransitionToPage.tsx";

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

    function handleClick() {
        navigateAnimateToPage(navigate, `/mapa`, {
            state: {
                coordinates,
            }
        });
    }

    return (
        <PostItBase color1="bg-light-secondary dark:bg-dark-secondary" color2="bg-light-secondaryVar dark:bg-dark-secondaryVar">
            <button onClick={handleClick} className="flex flex-col gap-2 w-full h-full cursor-pointer">
                <img src={images[0]} alt={title}/>
                <div className="p-2">
                    <h2 className="font-titles text-left" >{title}</h2>
                    <p>{description}</p>
                </div>
            </button>
        </PostItBase>
    );
}

export default PostItMap;