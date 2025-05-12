import articlesData from "#info/articles.json"

export interface ArticleContent {
    subtitle?: string;
    paragraphs: string[];
}

export interface Article {
    id: number
    title: string
    content: ArticleContent[]
    video?: string
    images?: string[]
}

const articles: Article[] = articlesData.map(article => ({
    ...article,
    id: article.id,
}));

export function getArticleById(id: number): Article | undefined {
    return articles.find(article => article.id === id);
}