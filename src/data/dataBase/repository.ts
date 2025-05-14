import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import articlesData from "#info/articles.json"

const articles: PostItInfoProps[] = articlesData.map(article => ({
    ...article
}));

export function getLastArticles(count: number): PostItInfoProps[] {
    return articles.slice(-count);
}