import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import InputSearch from "@/components/InputSearch";
import OrderChart from "@/components/OrderChart";

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Lacak Pesanan Pelanggan", component: <InputSearch /> },
    { id: 1, label: "Performa Pesanan Bulanan", component: <OrderChart /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner Ringkasan */}
      <div className="relative overflow-hidden bg-linear-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Overview Sistem
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Selamat Datang, {user?.name || "Pengguna"}!
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Kelola transaksi tailoring, lacak pesanan pelanggan, dan analisa
            statistik penjualan Anda dalam satu tempat.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Pesanan</p>
            <p className="text-2xl font-bold text-white mt-1">1,248</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Dalam Proses</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">42</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Pesanan Selesai
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">310</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tab Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 w-full sm:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-2xl p-4 md:p-6 border border-slate-800/60">
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
