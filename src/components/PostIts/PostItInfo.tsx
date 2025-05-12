import PostItBase from "./PostItBase";

interface PostItInfoProps {
    titleText?: string;
    imageLink?: string;
    content?: string;
    onClick?: () => void;
}

export function PostItInfo({ titleText, imageLink, content, onClick }: PostItInfoProps) {
    return (
        <PostItBase color1="bg-light-primary dark:bg-dark-primary" color2="bg-light-primaryVar dark:bg-dark-primaryVar">
            <button onClick={onClick} className="flex flex-col gap-2 w-full">
                <header className="flex-1">
                    {imageLink && <img src={imageLink} alt="" />}
                </header>
                <div id="content" className="flex-1 p-2">
                    {titleText && <h2>titleText</h2>}
                    {content && <p>content</p>}
                </div>
            </button>
        </PostItBase>
    );
}

export default PostItInfo;