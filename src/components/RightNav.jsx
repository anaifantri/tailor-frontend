import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UlNavLink from "@/components/UlNavLink";
import LiNavLink from "@/components/LiNavLink";

import Svg from "@/components/Svg";

import LogoutSvg from "@/assets/Svg/LogoutSvg";
import ShutdownSvg from "@/assets/Svg/ShutdownSvg";
import ProfileSvg from "@/assets/Svg/ProfileSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";

export default function RightNav() {
  const { token, user, logout, processing } = useAuth();

  return (
    <div className="flex justify-end items-center col-span-3 w-full">
      <div className="flex justify-end text-stone-50 hover:text-stone-300 cursor-pointer">
        {user && user.photo ? (
          <img
            src={user.photo}
            alt=""
            className="flex rounded-full w-6 h-6 mx-1"
          />
        ) : (
          <Svg title="Profile" c={"w-6 fill-current mx-1"}>
            <ProfileSvg />
          </Svg>
        )}
        <nav className="nav-link group">
          <UlNavLink title={user.name} c="nav-link group"></UlNavLink>
          <div className="hidden group-hover:block absolute top-7 pt-5">
            <div className="w-max border-t-2 border-t-stone-900 rounded-b-lg border border-stone-700 bg-stone-50 px-2">
              <LiNavLink
                title="Ganti Password"
                c="li-nav-link"
                url={`/dashboard/settings/users/change-password`}
              >
                <Svg title="Arrow" c={"nav-svg w-5 fill-current"}>
                  <ProfileSvg />
                </Svg>
              </LiNavLink>
              <button
                onClick={logout}
                className="flex justify-start w-full text-stone-700 hover:text-stone-500 cursor-pointer"
              >
                <Svg title="Arrow" c={"flex nav-svg w-5 fill-current"}>
                  <LogoutSvg />
                </Svg>
                <span className="flex ml-2">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-all-center w-10">
        <button
          title="Exit"
          onClick={logout}
          disabled={processing}
          className={
            processing
              ? "flex-all-center text-slate-500 cursor-pointer mx-2"
              : "flex-all-center w-6 h-6 bg-red-500 rounded-full text-white hover:bg-red-700 cursor-pointer p-1"
          }
        >
          <Svg title="Arrow" c={"flex nav-svg w-3 fill-current ml-1"}>
            <LogoutSvg />
          </Svg>
        </button>
      </div>
    </div>
  );
}
