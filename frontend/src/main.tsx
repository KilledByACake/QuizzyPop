import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import { QuizProvider } from "./contexts/QuizContext";  // ✅ Uncomment this

import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import ComponentTest from "./routes/ComponentTest";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import CreateQuiz from "./pages/CreateQuiz"; 
import AddQuestions from "./pages/AddQuestions";
import ProtectedRoute from "./routes/ProtectedRoute";

// Render the application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QuizProvider>  {/* ✅ Uncommented */}
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test" element={<ComponentTest />} />

              {/* Create is PUBLIC (uses its own login modal when submitting) */}
              <Route path="/create" element={<CreateQuiz />} />

              {/* Add Questions is PROTECTED (must be logged in to access) */}
              <Route
                path="/quiz/:id/questions"
                element={
                  <ProtectedRoute>
                    <AddQuestions />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />

              {/* Temporary local testing route */}
              <Route path="/dev/quiz/123/questions" element={<AddQuestions />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QuizProvider>  {/* ✅ Uncommented */}
    </AuthProvider>
  </StrictMode>
);
