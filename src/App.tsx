import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import LandingPage from "@/pages/LandingPage";
import LabPage from "@/pages/LabPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}