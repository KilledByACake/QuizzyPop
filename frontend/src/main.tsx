import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./views/Quiz/Index";
import Details from "./views/Quiz/Details";
import Create from "./views/Quiz/Create";
import Edit from "./views/Quiz/Edit";
import Login from "./views/Account/Login";

const router = createBrowserRouter([
  { path: "/quizzes", element: <Index /> },
  { path: "/quizzes/:id", element: <Details /> },
  { path: "/admin/quizzes/new", element: <Create /> },
  { path: "/admin/quizzes/:id/edit", element: <Edit /> },
  { path: "/login", element: <Login /> },
]);

export default function Root() {
  return <RouterProvider router={router} />;
}