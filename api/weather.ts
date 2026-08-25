import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { city } = req.query;

    if (!city || typeof city !== "string") {
        return res.status(400).json({ error: "Missing 'city' query parameter" });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Weather API key not configured" });
    }

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`
        );
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(502).json({ error: "Failed to fetch weather data" });
    }
}
