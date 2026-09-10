import { Link } from "react-router-dom";
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
  return (
    <div className="flex-all-center mx-2 col-span-11 px-16">
      <div className="grid grid-cols-5 gap-2 w-full">
        <Link
          className="flex justify-center items-center w-full text-stone-50 relative hover:text-stone-300 text-base"
          to={"/dashboard"}
        >
          <Svg title="Request" c={"nav-svg"}>
            <HomeSvg />
          </Svg>
          <span className="text-base ml-2">Dashboard</span>
        </Link>
        <NavLink title="Transaksi" c="nav-link group" navSvg={<OrderSvg />}>
          <LiNavLink
            title="Daftar Pesanan"
            c="li-nav-link"
            url="/dashboard/orders"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Pembayaran Pesanan"
            c="li-nav-link"
            url="/dashboard/payments"
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
          className="flex justify-center items-center w-full text-stone-50 relative hover:text-stone-300 text-base"
          to={"/dashboard/customers"}
        >
          <Svg title="Request" c={"nav-svg"}>
            <CustomerSvg />
          </Svg>
          <span className="text-base ml-2">Data Pelanggan</span>
        </Link>
        <NavLink
          title="Data Tukang"
          c="nav-link group"
          navSvg={<EmployeeSvg />}
        >
          <LiNavLink
            title="Daftar Nama Tukang"
            c="li-nav-link"
            url="/dashboard/tailors"
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
        <NavLink title="Pengaturan" c="nav-link group" navSvg={<SettingSvg />}>
          <LiNavLink
            title="Data Pengguna"
            c="li-nav-link"
            url="/dashboard/users"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Data Kain"
            c="li-nav-link"
            url="/dashboard/materials"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Jenis Pakaian"
            c="li-nav-link"
            url="/dashboard/clothing-types"
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
