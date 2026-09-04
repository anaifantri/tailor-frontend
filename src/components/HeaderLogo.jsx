import Logo from "@/assets/Images/logo-riori-tailor-02.png";
import TextLogo from "@/assets/Images/text-riori-tailor.png";

export default function HeaderLogo() {
  return (
    <div className="flex px-4 items-center sm:col-span-2 text-white">
      <img className="h-8" src={Logo} alt="" />
      <img className="h-7 ml-2" src={TextLogo} alt="" />
    </div>
  );
}
