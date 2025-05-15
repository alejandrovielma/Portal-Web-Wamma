import PostItBase from "./PostItBase";

export interface PostItMapProps {
    title: string;
    description: string;
    images: string[];
    video: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    city: string;
}

export function PostItMap({ content }: { content: string }) {
    return (
        <PostItBase color1="bg-light-secondary dark:bg-dark-secondary" color2="bg-light-secondaryVar dark:bg-dark-secondaryVar">
            {content}
        </PostItBase>
    );
}

export default PostItMap;