import { useState, useEffect, useRef } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const CURRENCIES = [
    { code: "GBP", label: "British Pound", flag: "GB" },
    { code: "USD", label: "US Dollar", flag: "US" },
    { code: "PLN", label: "Polish Złoty", flag: "PL" },
    { code: "CZK", label: "Czech Koruna", flag: "CZ" },
    { code: "SEK", label: "Swedish Krona", flag: "SE" },
    { code: "NOK", label: "Norwegian Krone", flag: "NO" },
    { code: "HUF", label: "Hungarian Forint", flag: "HU" },
    { code: "RON", label: "Romanian Leu", flag: "RO" },
    { code: "BGN", label: "Bulgarian Lev", flag: "BG" },
    { code: "CHF", label: "Swiss Franc", flag: "CH" },
    { code: "TRY", label: "Turkish Lira", flag: "TR" },
    { code: "AUD", label: "Australian Dollar", flag: "AU" },
    { code: "CAD", label: "Canadian Dollar", flag: "CA" },
];

const CACHE_KEY = "malta_fx_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCachedRates() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { rates, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL) return null;
        return rates;
    } catch {
        return null;
    }
}

function setCacheRates(rates) {
    try {
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ rates, ts: Date.now() }),
        );
    } catch {}
}

export default function CurrencyConverter() {
    const isOnline = useOnlineStatus();
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [amount, setAmount] = useState("10");
    const [selectedCurrency, setSelectedCurrency] = useState("GBP");
    const inputRef = useRef(null);

    useEffect(() => {
        const cached = getCachedRates();
        if (cached) {
            setRates(cached);
            setLoading(false);
            return;
        }
        if (!isOnline) {
            setLoading(false);
            setError(true);
            return;
        }

        const codes = CURRENCIES.map((c) => c.code).join(",");
        fetch(`https://api.frankfurter.app/latest?from=EUR&to=${codes}`)
            .then((r) => r.json())
            .then((json) => {
                setCacheRates(json.rates);
                setRates(json.rates);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [isOnline]);

    // Re-fetch when coming back online if no rates yet
    useEffect(() => {
        if (isOnline && !rates && !loading) {
            setLoading(true);
            setError(false);
            const codes = CURRENCIES.map((c) => c.code).join(",");
            fetch(`https://api.frankfurter.app/latest?from=EUR&to=${codes}`)
                .then((r) => r.json())
                .then((json) => {
                    setCacheRates(json.rates);
                    setRates(json.rates);
                    setLoading(false);
                })
                .catch(() => {
                    setError(true);
                    setLoading(false);
                });
        }
    }, [isOnline]);

    const numAmount = parseFloat(amount) || 0;
    const selectedRate = rates ? rates[selectedCurrency] : null;
    const converted = selectedRate
        ? (numAmount * selectedRate).toFixed(2)
        : null;
    const reverseRate = selectedRate ? (1 / selectedRate).toFixed(4) : null;
    const currencyInfo = CURRENCIES.find((c) => c.code === selectedCurrency);

    return (
        <div
            style={{
                background: "var(--white)",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--border)",
                overflow: "hidden",
                marginBottom: 8,
            }}>
            {/* Header */}
            <div
                style={{
                    padding: "14px 16px 10px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <div>
                    <h3
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 19,
                            fontWeight: 500,
                            color: "var(--ink)",
                        }}>
                        Currency converter
                    </h3>
                    <p
                        style={{
                            fontSize: 12,
                            color: "var(--ink-3)",
                            fontWeight: 300,
                            marginTop: 1,
                        }}>
                        Euro (€) to your currency
                    </p>
                </div>
                {!isOnline && (
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 500,
                            padding: "3px 8px",
                            borderRadius: 100,
                            background: "var(--red-light)",
                            color: "var(--red-dark)",
                        }}>
                        Offline
                    </span>
                )}
            </div>

            {/* Body */}
            <div style={{ padding: 16 }}>
                {/* Offline / error state */}
                {(error || !isOnline) && !rates && (
                    <div
                        style={{
                            padding: "20px 0",
                            textAlign: "center",
                        }}>
                        <svg
                            width='32'
                            height='32'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='var(--ink-4)'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            style={{ marginBottom: 8 }}>
                            <line x1='1' y1='1' x2='23' y2='23' />
                            <path d='M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01' />
                        </svg>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--ink-3)",
                                fontWeight: 300,
                            }}>
                            Connect to the internet to use the currency
                            converter
                        </p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div
                        style={{
                            padding: "16px 0",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}>
                        <div
                            style={{
                                animation: "spin 1s linear infinite",
                                width: 16,
                                height: 16,
                                flexShrink: 0,
                            }}>
                            <svg
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='var(--red)'
                                strokeWidth='2.5'
                                strokeLinecap='round'>
                                <path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4' />
                            </svg>
                        </div>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--ink-3)",
                                fontWeight: 300,
                            }}>
                            Loading exchange rates...
                        </p>
                    </div>
                )}

                {/* Converter UI */}
                {rates && !loading && (
                    <>
                        {/* EUR input */}
                        <div style={{ marginBottom: 12 }}>
                            <label
                                style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: "var(--ink-3)",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    display: "block",
                                    marginBottom: 6,
                                }}>
                                Euro amount
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "var(--stone)",
                                    borderRadius: "var(--r-sm)",
                                    border: "1px solid var(--border)",
                                    overflow: "hidden",
                                }}>
                                <span
                                    style={{
                                        padding: "0 12px",
                                        fontSize: 18,
                                        fontFamily: "var(--font-display)",
                                        fontWeight: 500,
                                        color: "var(--ink-3)",
                                        borderRight: "1px solid var(--border)",
                                        height: 48,
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                    €
                                </span>
                                <input
                                    ref={inputRef}
                                    type='number'
                                    inputMode='decimal'
                                    min='0'
                                    step='any'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: "0 14px",
                                        height: 48,
                                        fontSize: 20,
                                        fontWeight: 500,
                                        color: "var(--ink)",
                                        background: "transparent",
                                        border: "none",
                                        outline: "none",
                                        fontFamily: "var(--font-display)",
                                    }}
                                    placeholder='0'
                                />
                            </div>
                        </div>

                        {/* Currency selector */}
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: "var(--ink-3)",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    display: "block",
                                    marginBottom: 6,
                                }}>
                                Convert to
                            </label>
                            <select
                                value={selectedCurrency}
                                onChange={(e) =>
                                    setSelectedCurrency(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    height: 48,
                                    padding: "0 14px",
                                    borderRadius: "var(--r-sm)",
                                    border: "1px solid var(--border)",
                                    background: "var(--stone)",
                                    color: "var(--ink)",
                                    fontSize: 14,
                                    fontWeight: 400,
                                    fontFamily: "var(--font-body)",
                                    cursor: "pointer",
                                    outline: "none",
                                    appearance: "none",
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 12px center",
                                    paddingRight: 40,
                                }}>
                                {CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.code} — {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Result */}
                        {converted !== null && (
                            <div
                                style={{
                                    background: "var(--red-light)",
                                    borderRadius: "var(--r-sm)",
                                    padding: "14px 16px",
                                    border: "1px solid var(--red-mid)",
                                }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        justifyContent: "space-between",
                                        marginBottom: 6,
                                    }}>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "var(--ink-3)",
                                            fontWeight: 300,
                                        }}>
                                        €{numAmount.toFixed(2)} equals
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: 28,
                                            fontWeight: 500,
                                            color: "var(--red-dark)",
                                        }}>
                                        {Number(converted).toLocaleString(
                                            "en-GB",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            },
                                        )}
                                        <span
                                            style={{
                                                fontSize: 16,
                                                marginLeft: 4,
                                            }}>
                                            {selectedCurrency}
                                        </span>
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: "var(--ink-3)",
                                        fontWeight: 300,
                                    }}>
                                    1 {selectedCurrency} = €{reverseRate} · Rate
                                    updated hourly
                                </p>
                            </div>
                        )}

                        {/* Quick amounts */}
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                marginTop: 12,
                                flexWrap: "wrap",
                            }}>
                            {[5, 10, 20, 50, 100].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setAmount(String(v))}
                                    style={{
                                        padding: "6px 14px",
                                        borderRadius: 100,
                                        fontSize: 13,
                                        fontWeight:
                                            amount === String(v) ? 500 : 400,
                                        fontFamily: "var(--font-body)",
                                        border: "1px solid",
                                        borderColor:
                                            amount === String(v)
                                                ? "var(--red)"
                                                : "var(--border)",
                                        background:
                                            amount === String(v)
                                                ? "var(--red)"
                                                : "transparent",
                                        color:
                                            amount === String(v)
                                                ? "white"
                                                : "var(--ink-2)",
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                    }}>
                                    €{v}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
