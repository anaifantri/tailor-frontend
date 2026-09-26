import Logo from "@/assets/Images/gold-logo.png";
import TextLogo from "@/assets/Images/gold-text.png";

export default function HeaderLogo() {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <img className="h-9 w-auto" src={Logo} alt="Logo" />
      <img
        className="h-9 w-auto hidden sm:block"
        src={TextLogo}
        alt="Text Logo"
      />
    </div>
  );
}
