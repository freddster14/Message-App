import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import apiFetch from "../api/client";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "dashboard", Component: Dashboard, loader: async () => await apiFetch('/chat')   }
    ]
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
])

export default router;