import PostItBase from "./PostItBase";

export function PostItLink({ content }: { content: string }) {
    return (
        <PostItBase>
            {content}
        </PostItBase>
    );
}

export default PostItLink;