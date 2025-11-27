import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Clouds from "./Clouds";

type LayoutProps = { title?: string };

export default function Layout({ title }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (title) document.title = `${title} - Quizzy Pop`;
  }, [title]);

  const showNav = pathname !== '/';

  return (
    <>
      <Clouds />

      {showNav && <NavBar />}

      <div className="container-body" style={{ position: "relative", zIndex: 1 }}>
        <main role="main" className="page-body">
          <div key={pathname} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
