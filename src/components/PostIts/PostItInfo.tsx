import PostItBase from "./PostItBase";

export function PostItInfo({ content }: { content: string }) {
    return (
        <PostItBase>
            {content}
        </PostItBase>
    );
}

export default PostItInfo;