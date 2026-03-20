import { useEffect } from "react";
import { useWikipedia } from "../hooks/useWikipedia";

const catColors = {
    historic: "#CF142B",
    nature: "#2D7A60",
    beaches: "#2466A8",
    village: "#8B6A52",
    default: "#CF142B",
};

export default function PlaceDetailModal({ place, onClose }) {
    const isOpen = Boolean(place);
    const { data, loading } = useWikipedia(place?.wikipediaTitle);
    const accentColor = catColors[place?.category] || catColors.default;

    // Block body scroll while open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                aria-hidden='true'
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(28,25,23,0.5)",
                    zIndex: 500,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "all" : "none",
                    transition: "opacity 0.28s ease",
                }}
            />

            {/* Bottom sheet */}
            <div
                role='dialog'
                aria-modal='true'
                aria-label={place?.name}
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: "50%",
                    transform: isOpen
                        ? "translateX(-50%) translateY(0)"
                        : "translateX(-50%) translateY(105%)",
                    width: "100%",
                    maxWidth: 480,
                    background: "var(--white)",
                    borderRadius: "22px 22px 0 0",
                    zIndex: 600,
                    transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
                    /*
                     * maxHeight must leave room for the bottom nav bar.
                     * We subtract var(--nav-h) so the sheet never slides under it.
                     * On iOS with a home indicator we also respect safe-area-inset-bottom
                     * via the env() fallback.
                     */
                    maxHeight: "calc(88dvh - var(--nav-h))",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}>
                {/* Drag handle */}
                <div
                    style={{
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        background: "var(--border)",
                        margin: "12px auto 0",
                        flexShrink: 0,
                    }}
                />

                {/* Image */}
                <div
                    style={{
                        height: 210,
                        flexShrink: 0,
                        position: "relative",
                        overflow: "hidden",
                        background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "12px 16px 0",
                        borderRadius: "var(--r-md)",
                    }}>
                    {data?.imageUrl && (
                        <img
                            src={data.imageUrl}
                            alt={place?.name}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    )}

                    {/* Gradient scrim so close button is always visible */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%)",
                            pointerEvents: "none",
                        }}
                    />

                    {!data?.imageUrl && (
                        <span
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 28,
                                fontWeight: 400,
                                color: "rgba(255,255,255,0.9)",
                                letterSpacing: "0.03em",
                                textShadow: "0 2px 12px rgba(0,0,0,0.25)",
                                position: "relative",
                                zIndex: 1,
                            }}>
                            {place?.name}
                        </span>
                    )}

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label='Close'
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(0,0,0,0.38)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                        }}>
                        <svg
                            width='14'
                            height='14'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='white'
                            strokeWidth='2.5'>
                            <line x1='18' y1='6' x2='6' y2='18' />
                            <line x1='6' y1='6' x2='18' y2='18' />
                        </svg>
                    </button>
                </div>

                {/*
                 * Scrollable content.
                 * padding-bottom = nav bar height + 24px breathing room
                 * + env(safe-area-inset-bottom) for iPhone home indicator.
                 * This ensures the Wikipedia link is always reachable above the nav.
                 */}
                <div
                    style={{
                        overflowY: "auto",
                        flex: 1,
                        WebkitOverflowScrolling: "touch",
                        padding: "16px 20px",
                        paddingBottom:
                            "calc(var(--nav-h) + 24px + env(safe-area-inset-bottom, 0px))",
                    }}>
                    {/* Name */}
                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 26,
                            fontWeight: 500,
                            color: "var(--ink)",
                            marginBottom: 8,
                        }}>
                        {place?.name}
                    </h2>

                    {/* Tags */}
                    <div
                        style={{
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap",
                            marginBottom: 16,
                        }}>
                        {place?.tags?.map((tag, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    padding: "4px 11px",
                                    borderRadius: 100,
                                    background:
                                        i === 0
                                            ? `${accentColor}18`
                                            : "var(--stone)",
                                    color:
                                        i === 0 ? accentColor : "var(--ink-2)",
                                    border: `1px solid ${i === 0 ? `${accentColor}40` : "var(--border)"}`,
                                }}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Description — shimmer skeleton while loading */}
                    {loading && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}>
                            {[92, 78, 64].map((w) => (
                                <div
                                    key={w}
                                    style={{
                                        height: 14,
                                        width: `${w}%`,
                                        background: "var(--stone)",
                                        borderRadius: 4,
                                        animation: "shimmer 1.4s ease infinite",
                                    }}
                                />
                            ))}
                            <style>{`@keyframes shimmer{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
                        </div>
                    )}

                    {data?.extract && !loading && (
                        <p
                            style={{
                                fontSize: 15,
                                color: "var(--ink-2)",
                                lineHeight: 1.7,
                                fontWeight: 300,
                            }}>
                            {data.extract}
                        </p>
                    )}

                    {!data?.extract && !loading && place?.description && (
                        <p
                            style={{
                                fontSize: 14,
                                color: "var(--ink-4)",
                                fontStyle: "italic",
                            }}>
                            {place.description}
                        </p>
                    )}

                    {/* Wikipedia link — always visible above the nav bar thanks to padding */}
                    {data?.pageUrl && (
                        <a
                            href={data.pageUrl}
                            target='_blank'
                            rel='noreferrer'
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 18,
                                fontSize: 13,
                                color: accentColor,
                                fontWeight: 500,
                                textDecoration: "none",
                                minHeight: 44 /* accessible tap target */,
                                padding: "10px 0",
                            }}>
                            Read more on Wikipedia
                            <svg
                                width='13'
                                height='13'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke={accentColor}
                                strokeWidth='2'>
                                <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                                <polyline points='15 3 21 3 21 9' />
                                <line x1='10' y1='14' x2='21' y2='3' />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}
