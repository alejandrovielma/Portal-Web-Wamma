import { useNavigate } from "react-router-dom";
import PostItBase from "./PostItBase";

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
        navigate(`/mapa`, {
            state: {
                coordinates,
            }
        });
    }

    return (
        <PostItBase color1="bg-light-secondary dark:bg-dark-secondary" color2="bg-light-secondaryVar dark:bg-dark-secondaryVar">
            <button onClick={handleClick} className="flex flex-col gap-2 w-full h-full cursor-pointer">
                <h2>{title}</h2>
                <img src={images[0]} alt={title}/>
                <p>{description}</p>
            </button>
        </PostItBase>
    );
}

export default PostItMap;