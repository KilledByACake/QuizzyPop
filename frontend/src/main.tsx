/**
 * Application Entry Point
 * 
 * Main entry file that renders the React application and configures routing.
 * Sets up context providers (Auth, Quiz) and defines all application routes.
 * 
 * Route Structure:
 * - Public routes: /, /about, /login, /register, /create, /quizzes, /quiz/:id/take, etc.
 * - Protected routes: /quiz/:id/questions (requires authentication)
 * - Layout wrapper: All routes wrapped in Layout component (NavBar + Footer)
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { QuizProvider } from "./contexts/QuizContext"; 
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import CreateQuiz from "./pages/CreateQuiz"; 
import AddQuestions from "./pages/AddQuestions";
import ProtectedRoute from "./routes/ProtectedRoute";
import TakeQuiz from "./pages/TakeQuiz";
import TakingQuiz from "./pages/TakingQuiz";
import QuizCompleted from "./pages/QuizCompleted";
import MyPage from "./pages/MyPage";
import EditQuiz from "./pages/EditQuiz";
import PublishedQuiz from "./pages/PublishedQuiz";

/**
 * Render the React application to the DOM
 * StrictMode enables additional development checks and warnings
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* AuthProvider: Manages user authentication state and JWT tokens */}
    <AuthProvider>
      {/* QuizProvider: Manages quiz CRUD operations and state */}
      <QuizProvider>
        {/* BrowserRouter: Enables client-side routing */}
        <BrowserRouter>
          <Routes>
            {/* Layout wrapper: All routes include NavBar and Footer */}
            <Route element={<Layout />}>
              {/* ========== PUBLIC ROUTES ========== */}
              
              {/* Home/Landing page with mascot animation */}
              <Route path="/" element={<Index />} />
              
              {/* About page with project information */}
              <Route path="/about" element={<About />} />
              
              {/* Authentication pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* CreateQuiz is PUBLIC - uses LoginPromptModal when unauthenticated user tries to submit */}
              <Route path="/create" element={<CreateQuiz />} />

              {/* ========== PROTECTED ROUTES ========== */}
              
              {/* AddQuestions requires authentication - second step of quiz creation */}
              <Route
                path="/quiz/:id/questions"
                element={
                  <ProtectedRoute>
                    <AddQuestions />
                  </ProtectedRoute>
                }
              />

              {/* ========== QUIZ TAKING FLOW ========== */}
              
              {/* Browse/search available quizzes */}
              <Route path="/quizzes" element={<TakeQuiz />} />
              
              {/* Interactive quiz player with questions */}
              <Route path="/quiz/:id/take" element={<TakingQuiz />} />
              
              {/* Results page after completing a quiz */}
              <Route path="/quiz/:id/completed" element={<QuizCompleted />} />  

              {/* ========== USER DASHBOARD (Week 3 feature) ========== */}
              
              {/* User dashboard with stats and created quizzes */}
              <Route path="/mypage" element={<MyPage />} />
              
              {/* Edit existing quiz (uses mock data currently) */}
              <Route path="/quiz/:id/edit" element={<EditQuiz />} />
              
              {/* Success page after publishing a quiz */}
              <Route path="/quiz/:id/published" element={<PublishedQuiz />} />

              {/* ========== CATCH-ALL ========== */}
              
              {/* Redirect any unknown routes to home page */}
              <Route path="*" element={<Navigate to="/" replace />} />

              {/* ========== DEVELOPMENT/TESTING ROUTES ========== */}
              
              {/* Temporary route for local testing without authentication */}
              <Route path="/dev/quiz/123/questions" element={<AddQuestions />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QuizProvider>  
    </AuthProvider>
  </StrictMode>
);
