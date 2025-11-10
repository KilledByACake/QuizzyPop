import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext'; // Add this
import './index.css';
import ComponentTest from "./routes/ComponentTest";
import Login from "./routes/Account/Login"; // Add this

const router = createBrowserRouter([
  { path: "/", element: <ComponentTest /> },
  { path: "/test", element: <ComponentTest /> },
  { path: "/login", element: <Login /> }, // Add this route
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);