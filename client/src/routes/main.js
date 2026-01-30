import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
  },
  { path: "/sign-in", Component: SignIn },
  { path: "/sign-up", Component: SignUp },
])