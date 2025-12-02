/**
 * ProtectedRoute Component
 * 
 * Higher-order route component that restricts access to authenticated users only.
 * Wraps routes that require login (e.g., create quiz, user dashboard, edit quiz).
 * 
 * Behavior:
 * - If user is NOT authenticated: redirects to /login with return path saved
 * - If user IS authenticated: renders the protected content
 * 
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/create" element={<CreateQuiz />} />
 * </Route>
 * 
 * Or with direct children:
 * <ProtectedRoute>
 *   <CreateQuiz />
 * </ProtectedRoute>
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** Optional child components to render when authenticated */
  children?: ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Route wrapper that enforces authentication. Checks AuthContext for user authentication
 * status and either allows access or redirects to login page.
 * 
 * @param children - Optional child components (if not provided, renders nested routes via Outlet)
 * @returns Protected route content if authenticated, otherwise redirect to login
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Get authentication state from context
  const { isAuthenticated } = useAuth();
  
  // Capture current location to redirect back after login
  const location = useLocation();

  // User is not authenticated - redirect to login page
  if (!isAuthenticated) {
    // Save current location in state so user can be redirected back after login
    // 'replace' prevents adding login page to browser history
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // User is authenticated - render protected content
  // If children provided: render them
  // If no children: render nested routes using Outlet (React Router convention)
  return <>{children ?? <Outlet />}</>;
}

export default ProtectedRoute;
