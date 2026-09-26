import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Sidebar from "@/Components/Sidebar";
import VerificationCheck from "@/Components/VerificationCheck";
import HeaderLayout from "@/Layouts/HeaderLayout";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="h-screen bg-brand-bg selection:bg-brand-accent selection:text-brand-bg antialiased text-slate-100 flex flex-col font-sans">
      <HeaderLayout />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 justify-center p-4 md:p-8 overflow-y-auto">
          {user && !user.email_verified_at ? <VerificationCheck /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}
