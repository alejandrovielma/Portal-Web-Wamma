import { useState } from "react";
import PostItBase from "./PostItBase";
import PopInfo from "#components/PopInfo.tsx";
import { getArticleById } from "../../data/dataBase/articles";

interface PostItInfoProps {
    titleText?: string;
    imageLink?: string;
    content?: string;
    onClickInfo?: string;
}

export function PostItInfo({ titleText, imageLink, content, onClickInfo }: PostItInfoProps) {
    const [isPopOpen, setIsPopOpen] = useState(false);
    
    return (
        <>  
            <PostItBase color1="bg-light-primary dark:bg-dark-primary" color2="bg-light-primaryVar dark:bg-dark-primaryVar">
                <button onClick={()=>{setIsPopOpen(true)}} className="flex flex-col gap-2 w-full cursor-pointer">
                    <header className="flex-1">
                        {imageLink && <img src={imageLink} alt="" />}
                    </header>
                    <div id="content" className="flex-1 p-2">
                        {titleText && <h2>titleText</h2>}
                        {content && <p>content</p>}
                    </div>
                </button>
            </PostItBase>
            <PopInfo active={isPopOpen} onClose={()=>{setIsPopOpen(false)}}>
                hola
            </PopInfo>
        </>
    );
}

export default PostItInfo;