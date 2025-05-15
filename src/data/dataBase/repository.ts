import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import articlesData from "#info/articles.json"
import worksData from "#info/works.json"

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