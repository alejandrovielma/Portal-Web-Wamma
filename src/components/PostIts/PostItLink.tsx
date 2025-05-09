import PostItBase from "./PostItBase";

export function PostItLink({ content }: { content: string }) {
    return (
        <PostItBase color1="bg-light-secondary dark:bg-dark-secondary" color2="bg-light-secondaryVar dark:bg-dark-secondaryVar">
            {content}
        </PostItBase>
    );
}

export default PostItLink;