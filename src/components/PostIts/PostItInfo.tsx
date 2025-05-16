import { useEffect, useState } from "react";
import PostItBase from "./PostItBase";
import DialogInfo from "#components/DialogInfo.tsx";
import { useGridStackContext } from "#lib/gridStackLib/grid-stack-context.ts";
import { GridStackWidget } from "gridstack";
import { useGridStackWidgetContext } from "#lib/gridStackLib/grid-stack-widget-context.ts";

export interface PostItInfoContent {
    subtitle?: string;
    paragraphs: string[];
}

export interface PostItInfoProps {
    title: string
    content: PostItInfoContent[]
    video?: string
    images: string[]
}

export function PostItInfo({title, content, video, images }: PostItInfoProps) {
    const [isPopOpen, setIsPopOpen] = useState(false);
    const { widget } = useGridStackWidgetContext();
    const { gridStack, saveOptions } = useGridStackContext()
    const [dimensions, setDimensions] = useState({ h: 2, w: 2 });
    const [childrens, setChildrens] = useState<GridStackWidget[]>(saveOptions()["children"] as GridStackWidget[])

    useEffect(() => {
        if (!gridStack) return;
        function updateDimensions() {
            const self = childrens.find((child: GridStackWidget) => child.id === widget.id)
            setDimensions({
                h: self?.h || 2,
                w: self?.w || 2,
            })
        }
        updateDimensions();
    }, [])
    
    const allContent = {
        title: title,
        content: content,
        video: video,
        images: images
    }
    return (
        <>  
            <PostItBase color1="bg-light-primary dark:bg-dark-primary" color2="bg-light-primaryVar dark:bg-dark-primaryVar">
                <button onClick={()=>{setIsPopOpen(true)}} className="flex flex-col gap-2 w-full h-full cursor-pointer">
                    {
                    dimensions.h <= 2 && dimensions.w <= 2 ? <ContentSmall allContent={allContent} /> :
                        <ContentMedium allContent={allContent} />
                        }
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

function ContentSmall({ allContent }: { allContent: PostItInfoProps }) {
    return <img className="flex-1" src={allContent.images[0]} alt={allContent.title} />
}
function ContentMedium({ allContent }: { allContent: PostItInfoProps }) {
    return (
        <>
            <img className="flex-1" src={allContent.images[0]} alt={allContent.title} />
            <div className="flex-1/2 px-4 py-2">
                <h2 className="font-titles text-left text-xl" >{allContent.title}</h2>
                <p className="text-left">{allContent.content[0]?.paragraphs?.join(' ')}</p>
            </div>
        </>
    )
}