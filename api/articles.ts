import type { VercelRequest, VercelResponse } from "@vercel/node";

// El "keywords" de Currents API se comporta como un AND entre las
// palabras que se le pasan (mientras mas palabras, menos resultados), y
// por si solo no filtra bien por tema -- una busqueda de "agua" a secas
// trae de todo, hasta notas sobre celebridades. Por eso:
// 1. Primero se intenta la busqueda con el termino del usuario + "Venezuela"
//    (buen balance entre relevancia y cantidad de resultados, segun pruebas).
// 2. Si eso no trae nada, se reintenta solo con el termino del usuario
//    (mas resultados, aunque menos precisos de entrada).
// 3. En ambos casos, se filtran los resultados para quedarse solo con los
//    que de verdad mencionan Venezuela Y algo relacionado al agua --
//    la garantia real de relevancia no es la busqueda de Currents, es este filtro.
const WATER_TERMS = [
    "agua", "acuatic", "hidric", "hidrica", "hidrico", "rio", "rios", "sequia",
    "inundacion", "lluvia", "cuenca", "manglar", "delta", "oceano", "lago",
    "laguna", "humedal", "caudal", "represa", "embalse", "potable",
];

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(text: string): string {
    return text
        .normalize("NFD")
        .replace(DIACRITICS_PATTERN, "")
        .toLowerCase();
}

function isRelevant(article: { title?: string; description?: string }): boolean {
    const text = normalize(`${article.title ?? ""} ${article.description ?? ""}`);
    const mentionsVenezuela = text.includes("venezuela");
    const mentionsWater = WATER_TERMS.some((term) => text.includes(term));
    return mentionsVenezuela && mentionsWater;
}

// Algunos medios (sobre todo los mas chicos) no le mandan a Currents un
// resumen del articulo puntual -- le mandan la descripcion generica del
// sitio ("Ultimas noticias de Venezuela y el mundo..."), que Currents
// repite tal cual para CADA articulo de ese medio. La señal de que una
// descripcion es asi (generica, no del articulo) es que aparece
// identica en mas de un articulo del mismo resultado -- una descripcion
// real de un articulo especifico no se repite.
function clearBoilerplateDescriptions(articles: any[]): any[] {
    const counts = new Map<string, number>();
    for (const article of articles) {
        const desc = (article.description || "").trim();
        if (!desc) continue;
        counts.set(desc, (counts.get(desc) ?? 0) + 1);
    }
    return articles.map((article) => {
        const desc = (article.description || "").trim();
        if (desc && (counts.get(desc) ?? 0) > 1) {
            return { ...article, description: "" };
        }
        return article;
    });
}

async function fetchArticles(apiKey: string, keywords: string, pageSize: number) {
    const response = await fetch(
        `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(keywords)}&language=es&page_size=${pageSize}`,
        { headers: { Authorization: apiKey } }
    );
    const data = await response.json();
    return { ok: response.ok && data?.status === "ok", news: (data?.news ?? []) as any[] };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Missing 'q' query parameter" });
    }

    const apiKey = process.env.CURRENTS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Currents API key not configured" });
    }

    try {
        let { ok, news } = await fetchArticles(apiKey, `${q} Venezuela`, 20);
        let relevant = news.filter(isRelevant);

        if (ok && relevant.length < 3) {
            const broader = await fetchArticles(apiKey, q, 30);
            ok = ok || broader.ok;
            const seen = new Set(relevant.map((item) => item.id));
            for (const item of broader.news.filter(isRelevant)) {
                if (!seen.has(item.id)) {
                    relevant.push(item);
                    seen.add(item.id);
                }
            }
        }

        relevant = clearBoilerplateDescriptions(relevant);
        // Los que si tienen una descripcion real (no boilerplate) van primero.
        relevant.sort((a, b) => (b.description ? 1 : 0) - (a.description ? 1 : 0));

        return res.status(200).json({ status: ok ? "ok" : "error", news: relevant.slice(0, 12) });
    } catch (error) {
        return res.status(502).json({ error: "Failed to fetch articles" });
    }
}
