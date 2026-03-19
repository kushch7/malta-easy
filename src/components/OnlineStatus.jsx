import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function OnlineStatus() {
    const isOnline = useOnlineStatus();

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 100,
                background: isOnline
                    ? "rgba(45,122,96,0.1)"
                    : "rgba(207,20,43,0.08)",
                border: `1px solid ${isOnline ? "rgba(45,122,96,0.25)" : "rgba(207,20,43,0.2)"}`,
                transition: "all 0.4s ease",
            }}>
            {/* Pulsing dot */}
            <span
                style={{
                    position: "relative",
                    width: 8,
                    height: 8,
                    flexShrink: 0,
                }}>
                <span
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: isOnline ? "#2D7A60" : "var(--red)",
                        animation: isOnline
                            ? "pulse-online 2s ease-in-out infinite"
                            : "none",
                    }}
                />
                {isOnline && (
                    <span
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            background: "#2D7A60",
                            animation: "ping 1.5s ease-in-out infinite",
                            opacity: 0,
                        }}
                    />
                )}
            </span>
            <span
                style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: isOnline ? "#085041" : "var(--red-dark)",
                    letterSpacing: "0.02em",
                    fontFamily: "var(--font-body)",
                }}>
                {isOnline ? "Online" : "Offline — showing saved content"}
            </span>

            <style>{`
        @keyframes ping {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes pulse-online {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>
        </div>
    );
}
