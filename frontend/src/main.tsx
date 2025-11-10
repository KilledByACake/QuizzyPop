import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./routes/Home/Index";
import TakeQuiz from "./routes/Home/TakeQuiz";
import CreateQuiz from "./routes/Home/CreateQuiz";
import MyPage from "./routes/Home/MyPage";
import TakingQuiz from "./routes/Home/TakingQuiz";
import PublishedQuiz from "./routes/Home/PublishedQuiz";
import QuizCompleted from "./routes/Home/QuizCompleted";

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
