import { Link, useLocation } from "react-router-dom";
import NavLink from "@/components/NavLink";
import LiNavLink from "@/components/LiNavLink";
import Svg from "@/components/Svg";

import SettingSvg from "@/assets/Svg/SettingSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import HomeSvg from "@/assets/Svg/HomeSvg";
import CustomerSvg from "@/assets/Svg/CustomerSvg";
import OrderSvg from "@/assets/Svg/OrderSvg";
import EmployeeSvg from "@/assets/Svg/EmployeeSvg";

export default function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="flex-all-center mx-2 col-span-11 px-16">
      <div className="grid grid-cols-5 gap-2 w-full">
        <Link
          className={currentPath === "/dashboard" ? "link-active" : "link"}
          to={"/dashboard"}
        >
          <Svg title="Request" c={"nav-svg"}>
            <HomeSvg />
          </Svg>
          <span className="text-base ml-2">Dashboard</span>
        </Link>
        <NavLink
          title="Transaksi"
          c={
            currentPath.startsWith("/dashboard/transactions")
              ? "nav-link-active group"
              : "nav-link group"
          }
          navSvg={<OrderSvg />}
        >
          <LiNavLink
            title="Daftar Pesanan"
            c={
              currentPath.startsWith("/dashboard/transactions/orders")
                ? "li-nav-link-active"
                : "li-nav-link"
            }
            url="/dashboard/transactions/orders"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Pembayaran Pesanan"
            c={
              currentPath.startsWith("/dashboard/transactions/payments")
                ? "li-nav-link-active"
                : "li-nav-link"
            }
            url="/dashboard/transactions/payments"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink title="Pengambilan Pesanan" c="li-nav-link" url="#">
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
        </NavLink>
        <Link
          className={
            currentPath.startsWith("/dashboard/customers")
              ? "link-active"
              : "link"
          }
          to={"/dashboard/customers"}
        >
          <Svg title="Request" c={"nav-svg"}>
            <CustomerSvg />
          </Svg>
          <span className="text-base ml-2">Data Pelanggan</span>
        </Link>
        <NavLink
          title="Data Tukang"
          c={
            currentPath.startsWith("/dashboard/tailors")
              ? "nav-link-active group"
              : "nav-link group"
          }
          navSvg={<EmployeeSvg />}
        >
          <LiNavLink
            title="Daftar Nama Tukang"
            c={
              currentPath.startsWith("/dashboard/tailors/tailors")
                ? "li-nav-link-active"
                : "li-nav-link"
            }
            url="/dashboard/tailors/tailors"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink title="Pekerjaan Tukang" c="li-nav-link" url="#">
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink title="Pembayaran Tukang" c="li-nav-link" url="#">
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
        </NavLink>
        <NavLink
          title="Pengaturan"
          c={
            currentPath.startsWith("/dashboard/settings")
              ? "nav-link-active group"
              : "nav-link group"
          }
          navSvg={<SettingSvg />}
        >
          <LiNavLink
            title="Data Pengguna"
            c={
              currentPath.startsWith("/dashboard/settings/users")
                ? "li-nav-link-active"
                : "li-nav-link"
            }
            url="/dashboard/settings/users"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Data Kain"
            c={
              currentPath.startsWith("/dashboard/settings/materials")
                ? "li-nav-link-active"
                : "li-nav-link"
            }
            url="/dashboard/settings/materials"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Jenis Pakaian"
            c={
              currentPath.startsWith("/dashboard/settings/clothing-types")
                ? "li-nav-link-active"
                : "li-nav-link"
            }
            url="/dashboard/settings/clothing-types"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
        </NavLink>
      </div>
    </div>
  );
}
