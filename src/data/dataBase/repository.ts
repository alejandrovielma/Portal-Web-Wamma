import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import articlesData from "#info/articles.json"
import worksData from "#info/works.json"

const articles: PostItInfoProps[] = articlesData.map(article => ({
    ...article
}));

export function getLastArticles(count: number): PostItInfoProps[] {
    return articles.slice(-count);
}

const works: PostItInfoProps[] = worksData.map(work => ({
    ...work
}));

export function getLastWorks(count: number): PostItInfoProps[] {
    return works.slice(-count);
}