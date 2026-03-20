import { useState, useEffect } from "react";

const memCache = {};

function cacheKey(title) {
    return `malta-wiki-${title}`;
}

function loadFromStorage(title) {
    try {
        const raw = localStorage.getItem(cacheKey(title));
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveToStorage(title, data) {
    try {
        localStorage.setItem(cacheKey(title), JSON.stringify(data));
    } catch {}
}

/**
 * Wikipedia thumbnail URLs follow this pattern:
 *   https://upload.wikimedia.org/wikipedia/.../NNNpx-Filename.ext
 * We swap the NNN for 1200 to get a high-resolution version.
 * If the URL doesn't match (rare), we fall back to the original.
 */
function upscaleWikipediaImage(url) {
    if (!url) return null;
    // Match the pixel-width segment e.g. /320px- or /640px-
    return url.replace(/\/\d+px-/, "/1200px-");
}

export function useWikipedia(title) {
    const [data, setData] = useState(
        () => memCache[title] || loadFromStorage(title),
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!title) return;
        if (memCache[title]) {
            setData(memCache[title]);
            return;
        }
        const stored = loadFromStorage(title);
        if (stored) {
            memCache[title] = stored;
            setData(stored);
            return;
        }

        setLoading(true);
        fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        )
            .then((r) => r.json())
            .then((json) => {
                const result = {
                    extract: json.extract || "",
                    imageUrl: upscaleWikipediaImage(
                        json.thumbnail?.source || null,
                    ),
                    pageUrl: json.content_urls?.mobile?.page || null,
                };
                memCache[title] = result;
                saveToStorage(title, result);
                setData(result);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [title]);

    return { data, loading };
}
