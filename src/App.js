import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QRLandingPage from "./QRLandingPage";
import MobileAccessoriesStore from "./MobileAccessoriesStore";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRLandingPage />} />
        <Route path="/product" element={<MobileAccessoriesStore />} />
      </Routes>
    </Router>
  );
}
