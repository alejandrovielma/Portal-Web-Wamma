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
    city?: string;
}

export function PostItMap({ content }: { content: PostItMapProps }) {
    return (
        <PostItBase color1="bg-light-secondary dark:bg-dark-secondary" color2="bg-light-secondaryVar dark:bg-dark-secondaryVar">
            <h2>{content.title}</h2>
            <img src={content.images[0]} alt={content.title}/>
            <p>{content.description}</p>
        </PostItBase>
    );
}

export default PostItMap;