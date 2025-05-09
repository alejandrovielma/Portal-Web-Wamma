import PostItBase from "./PostItBase";

export function PostItLink({ content }: { content: string }) {
    return (
        <PostItBase color1="bg-light-secondary" color2="bg-light-secondaryVar">
            {content}
        </PostItBase>
    );
}

export default PostItLink;