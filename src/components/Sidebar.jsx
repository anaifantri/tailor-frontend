import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HomeSvg from "@/assets/Svg/HomeSvg";
import OrderSvg from "@/assets/Svg/OrderSvg";
import CustomerSvg from "@/assets/Svg/CustomerSvg";
import EmployeeSvg from "@/assets/Svg/EmployeeSvg";
import SettingSvg from "@/assets/Svg/SettingSvg";
import LogoutSvg from "@/assets/Svg/LogoutSvg";
import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Array konfigurasi struktur menu & submenu
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <HomeSvg />,
      exact: true,
    },
    {
      key: "transactions",
      title: "Transaksi",
      icon: <OrderSvg />,
      submenus: [
        { title: "Daftar Pesanan", path: "/dashboard/transactions/orders" },
        {
          title: "Pembayaran Pesanan",
          path: "/dashboard/transactions/payments",
        },
        {
          title: "Pengambilan Pesanan",
          path: "/dashboard/transactions/pickup",
        },
      ],
    },
    {
      title: "Data Pelanggan",
      path: "/dashboard/customers",
      icon: <CustomerSvg />,
    },
    {
      key: "tailors",
      title: "Data Tukang",
      icon: <EmployeeSvg />,
      submenus: [
        { title: "Daftar Nama Tukang", path: "/dashboard/tailors/tailors" },
        { title: "Pekerjaan Tukang", path: "/dashboard/tailors/tasks" },
        { title: "Pembayaran Tukang", path: "/dashboard/tailors/payments" },
      ],
    },
    {
      key: "settings",
      title: "Pengaturan",
      icon: <SettingSvg />,
      submenus: [
        { title: "Data Pengguna", path: "/dashboard/settings/users" },
        { title: "Data Bahan", path: "/dashboard/settings/materials" },
        { title: "Jenis Layanan", path: "/dashboard/settings/services" },
      ],
    },
  ];

  const toggleSubmenu = (menuKey) => {
    if (!sidebarOpen) setSidebarOpen(true);
    setOpenSubmenu(openSubmenu === menuKey ? null : menuKey);
  };

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return (
    <div>
      <aside
        className={`bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-[calc(100vh-4rem)] ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header Sidebar (Menu Utama & Toggle Hamburger/X) */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-slate-800/80 shrink-0">
            {sidebarOpen && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 truncate">
                Menu Utama
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors mr-1"
              title={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    sidebarOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Area Navigasi Dinamis */}
          <nav className="p-2 space-y-1.5 overflow-y-auto flex-1">
            {menuItems.map((item, index) => {
              // Menu Biasa (Tanpa Submenu)
              if (!item.submenus) {
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                      } ${!sidebarOpen ? "justify-center" : ""}`
                    }
                    title={!sidebarOpen ? item.title : undefined}
                  >
                    <Svg title={item.title} c="w-5 h-5 fill-current shrink-0">
                      {item.icon}
                    </Svg>
                    {sidebarOpen && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </NavLink>
                );
              }

              // Menu dengan Submenu
              const isSubmenuOpen = openSubmenu === item.key;
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all duration-200 ${
                      !sidebarOpen ? "justify-center" : ""
                    }`}
                    title={!sidebarOpen ? item.title : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Svg title={item.title} c="w-5 h-5 fill-current shrink-0">
                        {item.icon}
                      </Svg>
                      {sidebarOpen && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSubmenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Rendering Submenu List */}
                  {sidebarOpen && isSubmenuOpen && (
                    <div className="ml-8 mt-1 space-y-1 border-l border-slate-800 pl-3">
                      {item.submenus.map((sub, subIdx) => (
                        <NavLink
                          key={subIdx}
                          to={sub.path}
                          className="block py-2 px-3 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40"
                        >
                          {sub.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Profile & Logout Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0 space-y-3">
          <div className="flex items-center gap-3">
            {user && user.photo ? (
              <img
                src={user.photo}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/50 shadow-md shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center ring-2 ring-indigo-500/30 shrink-0">
                <Svg title="Profile" c="w-5 h-5 fill-current">
                  <ProfileSvg />
                </Svg>
              </div>
            )}
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || "Pengguna"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-1 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 transition-all duration-200 border border-rose-500/20 shadow-sm"
          >
            <Svg title="Logout" c="w-4 h-4 fill-current">
              <LogoutSvg />
            </Svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </div>
  );
}
