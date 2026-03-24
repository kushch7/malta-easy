import { useState } from "react";

const STORAGE_KEY = "malta-app-onboarded";

const steps = [
    {
        icon: (
            <svg
                width='26'
                height='26'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--red)'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <line x1='1' y1='1' x2='23' y2='23' />
                <path d='M16.72 11.06A10.94 10.94 0 0 1 19 12.55' />
                <path d='M5 12.55a10.94 10.94 0 0 1 5.17-2.39' />
                <path d='M10.71 5.05A16 16 0 0 1 22.56 9' />
                <path d='M1.42 9a15.91 15.91 0 0 1 4.7-2.88' />
                <path d='M8.53 16.11a6 6 0 0 1 6.95 0' />
                <line x1='12' y1='20' x2='12.01' y2='20' />
            </svg>
        ),
        title: "Works without internet",
        desc: "Transport, maps, and emergency info are saved on your device. No signal needed.",
    },
    {
        icon: (
            <svg
                width='26'
                height='26'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--red)'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                <path d='M7 11V7a5 5 0 0 1 10 0v4' />
            </svg>
        ),
        title: "No login required",
        desc: "No account, no password, no waiting.",
    },
    {
        icon: (
            <svg
                width='26'
                height='26'
                viewBox='0 0 24 24'
                fill='none'
                stroke='var(--red)'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z' />
            </svg>
        ),
        title: "Emergency contacts one tap away",
        desc: "Tap the Info tab at any time to call 112 or Mater Dei Hospital instantly.",
    },
];

const EUROPASS_LOGO =
    "https://www.teacheracademy.eu/wp-content/themes/epta/img/logo-europass-teacher-academy.svg";
const HEADSTART_LOGO =
    "https://headstart.technology/wp-content/uploads/2019/05/Headstart-logo-05.png";

export default function OnboardingScreen() {
    const [visible, setVisible] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) !== "true";
        } catch {
            return false;
        }
    });
    const [leaving, setLeaving] = useState(false);

    if (!visible) return null;

    const handleDone = () => {
        setLeaving(true);
        try {
            localStorage.setItem(STORAGE_KEY, "true");
        } catch {}
        setTimeout(() => setVisible(false), 380);
    };

    return (
        <div
            role='dialog'
            aria-modal='true'
            aria-label='Welcome to Malta!'
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 2000,
                display: "flex",
                flexDirection: "column",
                background: "var(--cream)",
                opacity: leaving ? 0 : 1,
                transform: leaving ? "scale(0.97)" : "scale(1)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                overflowY: "auto",
            }}>
            {/* Red hero */}
            <div
                style={{
                    background: "var(--red)",
                    padding: "52px 32px 32px",
                    position: "relative",
                    overflow: "hidden",
                    flexShrink: 0,
                }}>
                {/* Diagonal pattern */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.09,
                        backgroundImage:
                            "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
                        backgroundSize: "14px 14px",
                    }}
                />
                {/* Faint George Cross */}
                <div
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 24,
                        opacity: 0.14,
                        width: 52,
                        height: 52,
                    }}>
                    <div
                        style={{
                            position: "absolute",
                            width: 7,
                            height: 52,
                            left: 22,
                            top: 0,
                            background: "white",
                            borderRadius: 2,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            width: 52,
                            height: 7,
                            top: 22,
                            left: 0,
                            background: "white",
                            borderRadius: 2,
                        }}
                    />
                </div>

                <p
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.6)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                        fontFamily: "var(--font-body)",
                        position: "relative",
                    }}>
                    Headstart Technology · Malta
                </p>
                <h1
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 38,
                        fontWeight: 500,
                        color: "white",
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        position: "relative",
                    }}>
                    Welcome to
                    <br />
                    Malta Guide
                </h1>
                <p
                    style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.72)",
                        marginTop: 8,
                        fontWeight: 300,
                        fontFamily: "var(--font-body)",
                        position: "relative",
                    }}>
                    Everything you need for your stay
                </p>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 24px 32px" }}>
                {/* Steps */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        marginBottom: 24,
                    }}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                gap: 14,
                                alignItems: "flex-start",
                                background: "var(--white)",
                                borderRadius: "var(--r-md)",
                                padding: "14px 16px",
                                border: "1px solid var(--border)",
                                opacity: 0,
                                animation: `fadeUp 0.4s ease ${0.08 + i * 0.09}s both`,
                            }}>
                            <div
                                style={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 11,
                                    background: "var(--red-light)",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                {step.icon}
                            </div>
                            <div>
                                <p
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "var(--ink)",
                                        marginBottom: 3,
                                        fontFamily: "var(--font-body)",
                                    }}>
                                    {step.title}
                                </p>
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: "var(--ink-3)",
                                        lineHeight: 1.55,
                                        fontWeight: 300,
                                        fontFamily: "var(--font-body)",
                                    }}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Get started button */}
                <button
                    onClick={handleDone}
                    style={{
                        width: "100%",
                        padding: "15px 24px",
                        background: "var(--red)",
                        color: "white",
                        border: "none",
                        borderRadius: "var(--r-md)",
                        fontSize: 15,
                        fontWeight: 500,
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(207,20,43,0.28)",
                        marginBottom: 8,
                        minHeight: 52,
                    }}
                    onPointerDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.98)";
                    }}
                    onPointerUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}>
                    Get started
                </button>

                <p
                    style={{
                        textAlign: "center",
                        fontSize: 12,
                        color: "var(--ink-4)",
                        marginBottom: 28,
                        fontFamily: "var(--font-body)",
                    }}>
                    You won't see this again
                </p>

                {/* Partner logos */}
                <div
                    style={{
                        borderTop: "1px solid var(--border)",
                        paddingTop: 22,
                    }}>
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: 10,
                            fontWeight: 500,
                            color: "var(--ink-4)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: 16,
                            fontFamily: "var(--font-body)",
                        }}>
                        In partnership with
                    </p>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 24,
                            flexWrap: "wrap",
                        }}>
                        {/* Europass Teacher Academy */}
                        <a
                            href='https://www.teacheracademy.eu'
                            target='_blank'
                            rel='noreferrer'
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                flexShrink: 0,
                            }}>
                            <img
                                src={EUROPASS_LOGO}
                                alt='Europass Teacher Academy'
                                style={{
                                    height: 36,
                                    width: "auto",
                                    maxWidth: 160,
                                    objectFit: "contain",
                                    display: "block",
                                }}
                                onError={(e) => {
                                    // Fallback: render text logo if image fails
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement.innerHTML =
                                        '<span style="font-size:12px;font-weight:500;color:#1C1917;font-family:sans-serif">Europass Teacher Academy</span>';
                                }}
                            />
                        </a>

                        {/* Divider */}
                        <div
                            style={{
                                width: 1,
                                height: 28,
                                background: "var(--border)",
                                flexShrink: 0,
                            }}
                        />

                        {/* Headstart Technology */}
                        <a
                            href='https://headstart.technology'
                            target='_blank'
                            rel='noreferrer'
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                flexShrink: 0,
                            }}>
                            <img
                                src={HEADSTART_LOGO}
                                alt='Headstart Technology Ltd.'
                                style={{
                                    height: 36,
                                    width: "auto",
                                    maxWidth: 140,
                                    objectFit: "contain",
                                    display: "block",
                                }}
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement.innerHTML =
                                        '<span style="font-size:12px;font-weight:500;color:#1C1917;font-family:sans-serif">Headstart Technology</span>';
                                }}
                            />
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
        </div>
    );
}
