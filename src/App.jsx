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
import ChangePassword from "@/pages/users/ChangePassword";

import Tailors from "@/pages/tailors/Index";
import TailorCreate from "@/pages/tailors/Create";
import TailorShow from "@/pages/tailors/Show";
import TailorEdit from "@/pages/tailors/Edit";

import Customers from "@/pages/customers/Index";
import CustomerCreate from "@/pages/customers/Create";
import CustomerShow from "@/pages/customers/Show";
import CustomerEdit from "@/pages/customers/Edit";

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
import PaymentCreate from "@/pages/payments/Create";
import PaymentShow from "@/pages/payments/Show";
import PaymentEdit from "@/pages/payments/Edit";

import MeasurementCreate from "@/pages/measurement-histories/Create";
import MeasurementShow from "@/pages/measurement-histories/Show";
import MeasurementEdit from "@/pages/measurement-histories/Edit";

import NotFound from "@/components/NotFound";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";

const router = createBrowserRouter([
  // 🌐 Public Routes (Anyone can see)
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
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
    path: "/verify-email/:id/:hash",
    element: <VerifyEmail />,
  },
  {
    element: <GuestRoute />,
    children: [{ path: "/", element: <Login /> }],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },

          { path: "settings/users", element: <Users /> },
          { path: "settings/users/create", element: <UserCreate /> },
          { path: "settings/users/:id", element: <UserShow /> },
          { path: "settings/users/edit/:id", element: <UserEdit /> },
          {
            path: "settings/users/change-password",
            element: <ChangePassword />,
          },

          { path: "tailors/tailors", element: <Tailors /> },
          { path: "tailors/tailors/create", element: <TailorCreate /> },
          { path: "tailors/tailors/:id", element: <TailorShow /> },
          { path: "tailors/tailors/edit/:id", element: <TailorEdit /> },

          { path: "customers", element: <Customers /> },
          { path: "customers/create", element: <CustomerCreate /> },
          { path: "customers/:id", element: <CustomerShow /> },
          { path: "customers/edit/:id", element: <CustomerEdit /> },

          { path: "settings/materials", element: <Materials /> },
          { path: "settings/materials/create", element: <MaterialCreate /> },
          { path: "settings/materials/:id", element: <MaterialShow /> },
          { path: "settings/materials/edit/:id", element: <MaterialEdit /> },

          { path: "transactions/orders", element: <Orders /> },
          { path: "transactions/orders/create", element: <OrderCreate /> },
          { path: "transactions/orders/:id", element: <OrderShow /> },
          { path: "transactions/orders/edit/:id", element: <OrderEdit /> },

          { path: "settings/clothing-types", element: <ClothingTypes /> },
          {
            path: "settings/clothing-types/create",
            element: <ClothingTypeCreate />,
          },
          {
            path: "settings/clothing-types/:id",
            element: <ClothingTypeShow />,
          },
          {
            path: "settings/clothing-types/edit/:id",
            element: <ClothingTypeEdit />,
          },

          { path: "transactions/payments", element: <Payments /> },
          { path: "transactions/payments/:id", element: <PaymentShow /> },
          { path: "transactions/payments/create", element: <PaymentCreate /> },
          { path: "transactions/payments/edit/:id", element: <PaymentEdit /> },

          {
            path: "measurement-histories/create/:id",
            element: <MeasurementCreate />,
          },
          { path: "measurement-histories/:id", element: <MeasurementShow /> },
          {
            path: "measurement-histories/edit/:id",
            element: <MeasurementEdit />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
