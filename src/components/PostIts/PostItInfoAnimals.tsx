import { useState } from "react";
import PostItBase from "./PostItBase";
import DialogInfo from "#components/DialogInfo.tsx";


export interface PostItInfoAnimalsProps{
    image?: string;
    imageDistribution?: string;
    scientificName: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    state: string;
    description: string;
    distribution: string;
    situation: string;
    danger: string;
    conservation: string;
}

export function PostItInfoAnimals({image, scientificName, description, distribution}: PostItInfoAnimalsProps) {
    const [isPopOpen, setIsPopOpen] = useState(false);
    
    return (
        <>  
            <PostItBase color1="bg-light-primary dark:bg-dark-primary" color2="bg-light-primaryVar dark:bg-dark-primaryVar">
                <button onClick={()=>{setIsPopOpen(true)}} className="flex flex-col gap-2 w-full h-full cursor-pointer">
                    <header className="flex-1">
                        {image && <img src={image[0]} alt="" className="h-full w-full" />}
                    </header>
                    <div id="content" className="flex-1 p-2">
                        {scientificName && <h2>{scientificName}</h2>}
                        {description && <p>{description}</p>}
                    </div>
                    
                </button>
            </PostItBase>
            <DialogInfo active={isPopOpen} onClose={()=>{setIsPopOpen(false)}}>
                <>
                    <h2>{scientificName}</h2>
                    {
                        <p>{description}</p>
                    }
                    {
                        <p>{distribution}</p>
                    }
                </>
            </DialogInfo>
        </>
    );
}

export default PostItInfoAnimals;