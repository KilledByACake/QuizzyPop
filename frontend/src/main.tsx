import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComponentTest from "./routes/ComponentTest";

const router = createBrowserRouter([
  { path: "/", element: <ComponentTest /> },
  { path: "/test", element: <ComponentTest /> },
]);

// Mount React to the DOM
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);