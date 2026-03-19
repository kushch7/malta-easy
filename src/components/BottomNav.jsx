import { useNavigate, useLocation } from "react-router-dom";
import OnlineStatus from "./OnlineStatus";

const tabs = [
    {
        path: "/",
        label: "Home",
        icon: (
            <svg
                viewBox='0 0 24 24'
                fill='none'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                <polyline points='9 22 9 12 15 12 15 22' />
            </svg>
        ),
    },
    {
        path: "/places",
        label: "Places",
        icon: (
            <svg
                viewBox='0 0 24 24'
                fill='none'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                <circle cx='12' cy='10' r='3' />
            </svg>
        ),
    },
    {
        path: "/transport",
        label: "Transport",
        icon: (
            <svg
                viewBox='0 0 24 24'
                fill='none'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <rect x='1' y='3' width='15' height='13' rx='2' />
                <polygon points='16 8 20 8 23 11 23 16 16 16 16 8' />
                <circle cx='5.5' cy='18.5' r='2.5' />
                <circle cx='18.5' cy='18.5' r='2.5' />
            </svg>
        ),
    },
    {
        path: "/map",
        label: "Map",
        icon: (
            <svg
                viewBox='0 0 24 24'
                fill='none'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <polygon points='1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6' />
                <line x1='8' y1='2' x2='8' y2='18' />
                <line x1='16' y1='6' x2='16' y2='22' />
            </svg>
        ),
    },
    {
        path: "/practical",
        label: "Info",
        icon: (
            <svg
                viewBox='0 0 24 24'
                fill='none'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <circle cx='12' cy='12' r='10' />
                <line x1='12' y1='8' x2='12' y2='12' />
                <line x1='12' y1='16' x2='12.01' y2='16' />
            </svg>
        ),
    },
];

export default function BottomNav() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <nav
            style={{
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 480,
                background: "var(--white)",
                borderTop: "1px solid var(--border)",
                zIndex: 100,
            }}>
            {/* Online / Offline status strip */}
            <div
                style={{
                    padding: "6px 16px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                }}>
                <OnlineStatus />
            </div>

            {/* Tab row */}
            <div style={{ display: "flex", height: 56 }}>
                {tabs.map((tab) => {
                    const active = pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                                paddingTop: 8,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                WebkitTapHighlightColor: "transparent",
                            }}>
                            <span
                                style={{
                                    width: 26,
                                    height: 26,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 8,
                                    background: active
                                        ? "var(--red-light)"
                                        : "transparent",
                                    transition: "background 0.2s",
                                }}>
                                <span
                                    style={{
                                        width: 18,
                                        height: 18,
                                        display: "block",
                                        stroke: active
                                            ? "var(--red)"
                                            : "var(--ink-3)",
                                    }}>
                                    {tab.icon}
                                </span>
                            </span>
                            <span
                                style={{
                                    fontSize: 10,
                                    fontWeight: 500,
                                    color: active
                                        ? "var(--red)"
                                        : "var(--ink-4)",
                                    letterSpacing: "0.02em",
                                    fontFamily: "var(--font-body)",
                                }}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
