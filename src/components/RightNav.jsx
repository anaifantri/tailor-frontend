import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";

import LogoutSvg from "@/assets/Svg/LogoutSvg";

export default function RightNav() {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    <div className="flex items-center shrink-0">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 transition-all duration-200 border border-rose-500/20 shadow-sm cursor-pointer"
        title="Logout"
      >
        <Svg title="Logout" c="w-4 h-4 fill-current">
          <LogoutSvg />
        </Svg>
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}
