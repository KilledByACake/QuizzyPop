import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import ComponentTest from "./routes/ComponentTest";
import Login from "./pages/Account/Login";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ComponentTest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<ComponentTest />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
