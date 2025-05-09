import PostItBase from "./PostItBase";

export function PostItInfo({ content }: { content: string }) {
    return (
        <PostItBase color1="bg-light-primary dark:bg-dark-primary" color2="bg-light-primaryVar dark:bg-dark-primaryVar">
            {content}
        </PostItBase>
    );
}

export default PostItInfo;