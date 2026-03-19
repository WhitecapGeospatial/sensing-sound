import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: About,
  },
  {
    path: "/app",
    Component: Home,
  },
], {
  basename: import.meta.env.BASE_URL,
});
