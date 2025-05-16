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
                    {/* Mostrar solo la primera imagen y el título principal */}
                    {images && images[0] && (
                        <img src={images[0]} alt="" className="w-full h-56 object-cover rounded-t-2xl" />
                    )}
                    {title && <h2 className="text-center text-2xl font-bold py-4">{title}</h2>}
                </button>
            </PostItBase>
            <DialogInfo active={isPopOpen} onClose={()=>{setIsPopOpen(false)}}>
                <div className="flex flex-row gap-8 p-6">
                    {/* Text Section */}
                    <div className="flex-1 text-left">
                        {title && <h2 className="text-4xl font-bold mb-6">{title}</h2>}
                        {content.map((item, i) => (
                            <section key={i} className="mb-6">
                                {item.subtitle && <h3 className="text-2xl font-semibold mb-4">{item.subtitle}</h3>}
                                {item.paragraphs.map((para, j) => (
                                    <p key={j} className="text-lg mb-4">{para}</p>
                                ))}
                            </section>
                        ))}
                    </div>

                    {/* Media Section */}
                    <div className="flex flex-col gap-4 flex-none w-2/5">
                        {images && images.slice(1).map((src, i) => (
                            <img key={i} src={src} alt="" className="w-full rounded-2xl shadow-lg" />
                        ))}
                        {video && (
                            <iframe 
                                src={video} 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen 
                                className="w-full h-64 rounded-2xl shadow-lg"
                            />
                        )}
                    </div>
                </div>
            </DialogInfo>
        </>
    );
}

export default PostItInfo;