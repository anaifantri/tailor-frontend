import { NavLink } from "react-router-dom";

import Svg from "@/components/Svg";
import OrderSvg from "@/assets/Svg/OrderSvg";
import CustomerSvg from "@/assets/Svg/CustomerSvg";
import EmployeeSvg from "@/assets/Svg/EmployeeSvg";
import SettingSvg from "@/assets/Svg/SettingSvg";

export default function NavBar() {
  return (
    <nav className="hidden lg:flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 text-brand-accent">
      <NavLink
        to="/dashboard/transactions/orders"
        className={({ isActive }) =>
          `px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            isActive
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "hover:text-white hover:bg-slate-800/50"
          }`
        }
      >
        <Svg title="Pesanan" c="w-3.5 h-3.5 fill-current">
          <OrderSvg />
        </Svg>
        <span>Pesanan</span>
      </NavLink>

      <NavLink
        to="/dashboard/customers"
        className={({ isActive }) =>
          `px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            isActive
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "hover:text-white hover:bg-slate-800/50"
          }`
        }
      >
        <Svg title="Pelanggan" c="w-3.5 h-3.5 fill-current">
          <CustomerSvg />
        </Svg>
        <span>Pelanggan</span>
      </NavLink>

      <NavLink
        to="/dashboard/tailors/tailors"
        className={({ isActive }) =>
          `px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            isActive
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "hover:text-white hover:bg-slate-800/50"
          }`
        }
      >
        <Svg title="Penjahit" c="w-3.5 h-3.5 fill-current">
          <EmployeeSvg />
        </Svg>
        <span>Penjahit</span>
      </NavLink>

      <NavLink
        to="/dashboard/settings/materials"
        className={({ isActive }) =>
          `px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            isActive
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "hover:text-white hover:bg-slate-800/50"
          }`
        }
      >
        <Svg title="Pengaturan" c="w-3.5 h-3.5 fill-current">
          <SettingSvg />
        </Svg>
        <span>Data Bahan</span>
      </NavLink>
    </nav>
  );
}
