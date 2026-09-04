import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "@/App.css";

import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ResendEmailVerification from "@/pages/auth/ResendEmailVerification";
import VerifyEmail from "@/pages/auth/VerifyEmail";

import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";

import Users from "@/pages/users/Index";
import UserCreate from "@/pages/users/Create";
import UserShow from "@/pages/users/Show";
import UserEdit from "@/pages/users/Edit";

import Tailors from "@/pages/tailors/Index";
import TailorCreate from "@/pages/tailors/Create";
import TailorShow from "@/pages/tailors/Show";
import TailorEdit from "@/pages/tailors/Edit";

import Clients from "@/pages/clients/Index";
import ClientCreate from "@/pages/clients/Create";
import ClientShow from "@/pages/clients/Show";
import ClientEdit from "@/pages/clients/Edit";

import Materials from "@/pages/materials/Index";
import MaterialCreate from "@/pages/materials/Create";
import MaterialShow from "@/pages/materials/Show";
import MaterialEdit from "@/pages/materials/Edit";

import Orders from "@/pages/orders/Index";
import OrderCreate from "@/pages/orders/Create";
import OrderShow from "@/pages/orders/Show";
import OrderEdit from "@/pages/orders/Edit";

import ClothingTypes from "@/pages/clothing-types/Index";
import ClothingTypeCreate from "@/pages/clothing-types/Create";
import ClothingTypeShow from "@/pages/clothing-types/Show";
import ClothingTypeEdit from "@/pages/clothing-types/Edit";

import Payments from "@/pages/payments/Index";
import PaymentShow from "@/pages/payments/Show";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";

const router = createBrowserRouter([
  // 🌐 Public Routes (Anyone can see)
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/resend-email-verification",
    element: <ResendEmailVerification />,
  },
  {
    path: "/email-verify/:id/:hash",
    element: <VerifyEmail />,
  },
  // 🔓 Guest Only Routes (Redirects to /dashboard if logged in)
  {
    element: <GuestRoute />,
    children: [{ path: "/", element: <Login /> }],
  },
  // 🔒 Protected Routes (Redirects to /login if logged out)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },

          { path: "users", element: <Users /> },
          { path: "users/create", element: <UserCreate /> },
          { path: "users/:id", element: <UserShow /> },
          { path: "users/edit/:id", element: <UserEdit /> },

          { path: "tailors", element: <Tailors /> },
          { path: "tailors/create", element: <TailorCreate /> },
          { path: "tailors/:id", element: <TailorShow /> },
          { path: "tailors/edit/:id", element: <TailorEdit /> },

          { path: "clients", element: <Clients /> },
          { path: "clients/create", element: <ClientCreate /> },
          { path: "clients/:id", element: <ClientShow /> },
          { path: "clients/edit/:id", element: <ClientEdit /> },

          { path: "materials", element: <Materials /> },
          { path: "materials/create", element: <MaterialCreate /> },
          { path: "materials/:id", element: <MaterialShow /> },
          { path: "materials/edit/:id", element: <MaterialEdit /> },

          { path: "orders", element: <Orders /> },
          { path: "orders/create", element: <OrderCreate /> },
          { path: "orders/:id", element: <OrderShow /> },
          { path: "orders/edit/:id", element: <OrderEdit /> },

          { path: "clothing-types", element: <ClothingTypes /> },
          { path: "clothing-types/create", element: <ClothingTypeCreate /> },
          { path: "clothing-types/:id", element: <ClothingTypeShow /> },
          { path: "clothing-types/edit/:id", element: <ClothingTypeEdit /> },

          { path: "payments", element: <Payments /> },
          { path: "payments/:id", element: <PaymentShow /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
