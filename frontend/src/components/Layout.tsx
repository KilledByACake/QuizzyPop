import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Clouds from "./Clouds";

/**
 * Main layout wrapper component that provides consistent page structure
 * Renders background clouds, conditional navbar, page content, and footer
 * Used by React Router to wrap all page routes
 */
export default function Layout() {
  const { pathname } = useLocation();

  // Hide navbar on landing page (/) for full-screen hero
  const showNav = pathname !== '/';

  return (
    <>
      {/* Animated background clouds */}
      <Clouds />

      {/* Conditional navigation bar */}
      {showNav && <NavBar />}

      {/* Main content area with z-index layering */}
      <div className="container-body" style={{ position: "relative", zIndex: 1 }}>
        <main role="main" className="page-body">
          {/* Key forces remount on route change for transitions */}
          <div key={pathname} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Site-wide footer */}
      <Footer />
    </>
  );
}
