import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import OnlineStatus from "./components/OnlineStatus";
import Home from "./pages/Home";
import Places from "./pages/Places";
import Transport from "./pages/Transport";
import MapPage from "./pages/MapPage";
import Practical from "./pages/Practical";

export default function App() {
    return (
        <BrowserRouter>
            <div
                style={{
                    maxWidth: 480,
                    margin: "0 auto",
                    minHeight: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--cream)",
                    position: "relative",
                    overflow: "hidden",
                }}>
                {/* Top status bar */}
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "100%",
                        maxWidth: 480,
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "8px 16px",
                        zIndex: 200,
                        pointerEvents: "none",
                    }}>
                    <div style={{ pointerEvents: "all" }}>
                        <OnlineStatus />
                    </div>
                </div>

                <main
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        paddingBottom: "var(--nav-h)",
                        paddingTop: 36,
                    }}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/places' element={<Places />} />
                        <Route path='/transport' element={<Transport />} />
                        <Route path='/map' element={<MapPage />} />
                        <Route path='/practical' element={<Practical />} />
                    </Routes>
                </main>
                <BottomNav />
            </div>
        </BrowserRouter>
    );
}
