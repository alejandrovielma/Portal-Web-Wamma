import { useState } from "react";
import PostItBase from "./PostItBase";
import DialogInfo from "#components/DialogInfo.tsx";

export interface PostItInfoContent {
    subtitle?: string;
    paragraphs: string[];
}

export interface PostItInfoProps {
    title: string
    content: PostItInfoContent[]
    video?: string
    images?: string[]
}

export function PostItInfo({title, content, video, images }: PostItInfoProps) {
    const [isPopOpen, setIsPopOpen] = useState(false);
    
    return (
        <>  
            <PostItBase color1="bg-light-primary dark:bg-dark-primary" color2="bg-light-primaryVar dark:bg-dark-primaryVar">
                <button onClick={()=>{setIsPopOpen(true)}} className="flex flex-col gap-2 w-full h-full cursor-pointer">
                    <header className="flex-1">
                        {images && <img src={images[0]} alt="" className="h-full w-full" />}
                    </header>
                    <div id="content" className="flex-1 p-2">
                        {title && <h2>{title}</h2>}
                        {content && <p>{content[0].paragraphs}</p>}
                    </div>
                    
                </button>
            </PostItBase>
            <DialogInfo active={isPopOpen} onClose={()=>{setIsPopOpen(false)}}>
                <>
                    <h2>{title}</h2>
                    {
                        content.map((content, i) => (
                            <section key={i}>
                                {content.subtitle && <h3>{content.subtitle}</h3>}
                                <p>{content.paragraphs}</p>
                            </section>
                        ))
                    }
                </>
            </DialogInfo>
        </>
    );
}

export default PostItInfo;