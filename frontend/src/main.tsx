import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Home/Index";
import TakeQuiz from "./pages/Home/TakeQuiz";
import CreateQuiz from "./pages/Home/CreateQuiz";
import MyPage from "./pages/Home/MyPage";
import TakingQuiz from "./pages/Home/TakingQuiz";
import PublishedQuiz from "./pages/Home/PublishedQuiz";
import QuizCompleted from "./pages/Home/QuizCompleted";

//må endre ved behov, error nå fordi de ikke finnes


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      {/* Default (home) page */}
      <Route path="/" element={<Index />} />

      {/* Other pages */}
      <Route path="/quizzes" element={<TakeQuiz />} />
      <Route path="/create" element={<CreateQuiz />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/quizzes/:id/take" element={<TakingQuiz />} />
      <Route path="/quizzes/:id/published" element={<PublishedQuiz />} />
      <Route path="/quizzes/:id/completed" element={<QuizCompleted />} />

      {/* Catch-all (redirect unknown routes to home) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
