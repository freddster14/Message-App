import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import ErrorBoundary from "../pages/Error";
import ProtectedRoute from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true, Component: Home },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
    ]
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
])

export default router;