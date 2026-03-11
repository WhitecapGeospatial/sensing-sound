import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/about",
    Component: About,
  },
], {
  basename: import.meta.env.BASE_URL,
});
