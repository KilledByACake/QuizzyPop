import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

type LayoutProps = { title?: string };

export default function Layout({ title }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (title) document.title = `${title} - Quizzy Pop`;
  }, [title]);

  const showNav = pathname !== "/";

  return (
    <>
      <div className="clouds" aria-hidden="true">
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
        <div className="cloud" />
      </div>

      {showNav && <NavBar />}

      <div className="container-body">
        <main role="main" className="page-body">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
