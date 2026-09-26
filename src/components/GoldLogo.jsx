import GoldLogo from "@/assets/Images/gold-logo.png";
import GoldText from "@/assets/Images/gold-text.png";

export default function BtnBack({ backUrl }) {
  return (
    <>
      <img className="h-16" src={GoldLogo} alt="" />
      <div>
        <div className="flex-all-center">
          <img className="h-6" src={GoldText} alt="" />
        </div>
        <div className="flex-all-center mt-1">
          <span className="flex text-xs">
            Jl. Teuku Umar No. 65 E - Denpasar, Bali
          </span>
        </div>
        <div className="flex-all-center">
          <span className="flex text-xs">
            www.rioritailor.com | Email : info@rioritailor.com
          </span>
        </div>
        <div className="flex-all-center">
          <span className="flex text-xs">WA +62 851 0144 2323</span>
        </div>
      </div>
    </>
  );
}
