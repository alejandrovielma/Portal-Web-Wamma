import type { VercelRequest, VercelResponse } from "@vercel/node";

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
        const response = await fetch(
            `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(q)}&language=es&page_size=12`,
            { headers: { Authorization: apiKey } }
        );
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(502).json({ error: "Failed to fetch articles" });
    }
}
