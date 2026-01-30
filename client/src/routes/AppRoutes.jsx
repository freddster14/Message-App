import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "/:name", Component: Dashboard }
    ]
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
])

export default router;