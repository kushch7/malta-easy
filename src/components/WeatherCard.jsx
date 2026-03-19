import { useState, useEffect } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const MALTA_LAT = 35.8997;
const MALTA_LNG = 14.5147;

const WMO_CODES = {
    0: { label: "Clear sky", icon: "sun" },
    1: { label: "Mainly clear", icon: "sun" },
    2: { label: "Partly cloudy", icon: "cloud-sun" },
    3: { label: "Overcast", icon: "cloud" },
    45: { label: "Foggy", icon: "cloud" },
    48: { label: "Icy fog", icon: "cloud" },
    51: { label: "Light drizzle", icon: "cloud-rain" },
    53: { label: "Drizzle", icon: "cloud-rain" },
    55: { label: "Heavy drizzle", icon: "cloud-rain" },
    61: { label: "Slight rain", icon: "cloud-rain" },
    63: { label: "Rain", icon: "cloud-rain" },
    65: { label: "Heavy rain", icon: "cloud-rain" },
    71: { label: "Slight snow", icon: "cloud" },
    73: { label: "Snow", icon: "cloud" },
    75: { label: "Heavy snow", icon: "cloud" },
    80: { label: "Slight showers", icon: "cloud-rain" },
    81: { label: "Showers", icon: "cloud-rain" },
    82: { label: "Violent showers", icon: "cloud-rain" },
    95: { label: "Thunderstorm", icon: "cloud-lightning" },
    96: { label: "Thunderstorm", icon: "cloud-lightning" },
    99: { label: "Thunderstorm", icon: "cloud-lightning" },
};

function WeatherIcon({ type, color = "rgba(255,255,255,0.7)" }) {
    const s = {
        fill: "none",
        stroke: color,
        strokeWidth: 1.6,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };
    if (type === "cloud-rain")
        return (
            <svg width='52' height='52' viewBox='0 0 48 48' {...s}>
                <path d='M36 30a8 8 0 1 0-8-14.3A10 10 0 1 0 14 30Z' />
                <line x1='16' y1='36' x2='16' y2='40' />
                <line x1='24' y1='36' x2='24' y2='40' />
                <line x1='32' y1='36' x2='32' y2='40' />
            </svg>
        );
    if (type === "cloud")
        return (
            <svg width='52' height='52' viewBox='0 0 48 48' {...s}>
                <path d='M36 34a8 8 0 1 0-8-14.3A10 10 0 1 0 14 34Z' />
            </svg>
        );
    if (type === "cloud-sun")
        return (
            <svg width='52' height='52' viewBox='0 0 48 48' {...s}>
                <circle cx='18' cy='20' r='7' />
                <line x1='18' y1='8' x2='18' y2='5' />
                <line x1='18' y1='35' x2='18' y2='32' />
                <line x1='6' y1='20' x2='9' y2='20' />
                <line x1='29' y1='20' x2='27' y2='20' />
                <path
                    d='M38 38a6 6 0 0 0-2-11.6A8 8 0 1 0 26 38Z'
                    strokeOpacity='0.7'
                />
            </svg>
        );
    if (type === "cloud-lightning")
        return (
            <svg width='52' height='52' viewBox='0 0 48 48' {...s}>
                <path d='M36 30a8 8 0 1 0-8-14.3A10 10 0 1 0 14 30Z' />
                <polyline points='22 30 19 38 26 36 23 44' />
            </svg>
        );
    return (
        <svg width='52' height='52' viewBox='0 0 48 48' {...s}>
            <circle cx='24' cy='24' r='10' />
            <line x1='24' y1='4' x2='24' y2='10' />
            <line x1='24' y1='38' x2='24' y2='44' />
            <line x1='4' y1='24' x2='10' y2='24' />
            <line x1='38' y1='24' x2='44' y2='24' />
            <line x1='8.7' y1='8.7' x2='13' y2='13' />
            <line x1='35' y1='35' x2='39.3' y2='39.3' />
            <line x1='39.3' y1='8.7' x2='35' y2='13' />
            <line x1='13' y1='35' x2='8.7' y2='39.3' />
        </svg>
    );
}

const CACHE_KEY = "malta_weather_cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL) return null;
        return data;
    } catch {
        return null;
    }
}

function setCache(data) {
    try {
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data, ts: Date.now() }),
        );
    } catch {}
}

export default function WeatherCard() {
    const isOnline = useOnlineStatus();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const cached = getCached();
        if (cached) {
            setWeather(cached);
            setLoading(false);
            return;
        }
        if (!isOnline) {
            setLoading(false);
            setError(true);
            return;
        }

        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${MALTA_LAT}&longitude=${MALTA_LNG}` +
                `&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m` +
                `&wind_speed_unit=kmh&timezone=Europe%2FMalta`,
        )
            .then((r) => r.json())
            .then((json) => {
                const c = json.current;
                const data = {
                    temp: Math.round(c.temperature_2m),
                    wind: Math.round(c.windspeed_10m),
                    humidity: Math.round(c.relative_humidity_2m),
                    code: c.weathercode,
                };
                setCache(data);
                setWeather(data);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [isOnline]);

    const info = weather
        ? WMO_CODES[weather.code] || { label: "Clear sky", icon: "sun" }
        : null;
    const cached = !!getCached();

    return (
        <div
            style={{
                background:
                    "linear-gradient(135deg, var(--red) 0%, #A0102A 100%)",
                borderRadius: "var(--r-md)",
                padding: 18,
                marginBottom: 8,
                position: "relative",
                overflow: "hidden",
                minHeight: 110,
            }}>
            {/* Subtle pattern overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.06,
                    backgroundImage:
                        "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
                    backgroundSize: "10px 10px",
                }}
            />

            {loading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        opacity: 0.7,
                    }}>
                    <div
                        style={{
                            animation: "spin 1s linear infinite",
                            width: 20,
                            height: 20,
                        }}>
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='white'
                            strokeWidth='2'
                            strokeLinecap='round'>
                            <path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' />
                        </svg>
                    </div>
                    <p
                        style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.75)",
                            fontWeight: 300,
                        }}>
                        Fetching weather...
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : error && !weather ? (
                <div>
                    <p
                        style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.6)",
                            fontWeight: 300,
                        }}>
                        Weather unavailable offline
                    </p>
                    <p
                        style={{
                            fontSize: 20,
                            color: "white",
                            fontWeight: 300,
                            marginTop: 4,
                            fontFamily: "var(--font-display)",
                        }}>
                        Valletta, Malta
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                    }}>
                    <div>
                        <p
                            style={{
                                fontSize: 13,
                                color: "rgba(255,255,255,0.68)",
                                fontWeight: 400,
                                marginBottom: 2,
                            }}>
                            Valletta, Malta
                        </p>
                        <p
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 54,
                                fontWeight: 400,
                                color: "white",
                                lineHeight: 1,
                            }}>
                            {weather.temp}°
                        </p>
                        <p
                            style={{
                                fontSize: 13,
                                color: "rgba(255,255,255,0.82)",
                                fontWeight: 300,
                                marginTop: 5,
                            }}>
                            {info.label} · {weather.wind} km/h wind
                        </p>
                        <p
                            style={{
                                fontSize: 11,
                                color: "rgba(255,255,255,0.5)",
                                marginTop: 3,
                                fontWeight: 300,
                            }}>
                            Humidity {weather.humidity}%
                            {cached && !isOnline ? "  ·  Cached" : ""}
                        </p>
                    </div>
                    <WeatherIcon type={info.icon} />
                </div>
            )}
        </div>
    );
}
