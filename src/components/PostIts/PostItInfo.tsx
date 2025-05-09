import PostItBase from "./PostItBase";

export function PostItInfo({ content }: { content: string }) {
    return (
        <PostItBase color1="bg-light-primary" color2="bg-light-primaryVar">
            {content}
        </PostItBase>
    );
}

export default PostItInfo;