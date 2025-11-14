import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
// import { QuizProvider } from "./contexts/QuizContext";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import ComponentTest from "./routes/ComponentTest";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";

// 
// Må lages (TODO: Create these files)
//
// import MyPage from "./pages/Home/MyPage";     
// import CreateQuiz from "./pages/Home/CreateQuiz"; 
// import ProtectedRoute from "./routes/ProtectedRoute";

// Render the application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      {/* <QuizProvider> */}
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test" element={<ComponentTest />} />

              {/* Protected routes - TODO: Uncomment when files are created */}
              {/* <Route
                path="/mypage"
                element={
                  <ProtectedRoute>
                    <MyPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              /> */}

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      {/* </QuizProvider> */}
    </AuthProvider>
  </StrictMode>
);
