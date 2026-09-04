import HeaderLogo from "@/components/HeaderLogo";
import NavBar from "@/components/Navbar";
import RightNav from "@/components/RightNav";

export default function HeaderLayout() {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md items-center w-full">
      <div className="grid grid-cols-2 sm:grid-cols-16 w-full gap-0 bg-stone-900 p-2 text-sm">
        <HeaderLogo />
        <NavBar />
        <RightNav />
      </div>
    </header>
  );
}
