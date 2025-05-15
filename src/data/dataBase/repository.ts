import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import { PostItMapProps } from "#components/PostIts/PostItMap.tsx";
import articlesData from "#info/articles.json"
import worksData from "#info/works.json"
import destinationsData from "#info/destinations.json"

const articles: PostItInfoProps[] = articlesData.map(article => ({
    ...article
}));

export function getLastArticles(count: number): PostItInfoProps[] {
    return articles.slice(-count);
}

export function getAllArticles(): PostItInfoProps[] {
    return articles;
}

export interface Work {
    type: string;
    content: PostItInfoProps
}

const works: Work[] = worksData.map(work => ({
    type: work.type,
    content: {
        ...work
    }
}));

export function getLastWorks(count: number): Work[] {
    return works.slice(-count);
}

export interface Destination{
    type: string;
    content: PostItMapProps
}

const destinations: Destination[] = destinationsData.map(destination => ({
    type: destination.type,
    content: {
        ...destination
    }
}));

export function getAllDestinations(): Destination[] {
    return destinations;
}