import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import RegisterLayout from "./pages/layouts/RegisterLayout";
import DashBoard from "./pages/dashboard/DashBoard";
import SignInForm from "./pages/auth/SignInForm";
import Documents from "./pages/docpage/Documents";
import CampusRoute from "./pages/mapping/CampusRoute";
import ResendPasswordForm from "./pages/auth/ResendPasswordForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/documents",
        element: <Documents />,
      },
      {
        path: "/virtual-tour",
        element: <CampusRoute />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: (
      <RegisterLayout>
        <SignInForm />
      </RegisterLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <RegisterLayout>
        <ResendPasswordForm />
      </RegisterLayout>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
