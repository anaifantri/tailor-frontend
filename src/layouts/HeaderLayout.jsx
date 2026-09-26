import HeaderLogo from "@/components/HeaderLogo";
import NavBar from "@/components/Navbar";
import RightNav from "@/components/RightNav";

export default function HeaderLayout() {
  return (
    <header className="h-16 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 gap-4 shrink-0">
      <HeaderLogo />
      <NavBar />
      <RightNav />
    </header>
  );
}
