import HeaderLogo from "@/components/HeaderLogo";
import NavBar from "@/components/Navbar";
import RightNav from "@/components/RightNav";

export default function HeaderLayout() {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md items-center w-full">
      <div className="grid grid-cols-2 sm:grid-cols-16 w-full bg-linear-to-b from-stone-900/80 via-stone-700/80 to-stone-900/80 backdrop-blur-md h-16 shadow-xl border-b border-white/10">
        <HeaderLogo />
        <NavBar />
        <RightNav />
      </div>
    </header>
  );
}
