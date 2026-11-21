import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Detection from "./pages/Detection.jsx";
import About from "./pages/About.jsx";
import Performance from "./pages/Performance.jsx";
import Dataset from "./pages/Dataset.jsx";

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detect" element={<Detection />} />
          <Route path="/about" element={<About />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/dataset" element={<Dataset />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
