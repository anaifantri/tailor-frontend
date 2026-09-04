import LogoBlack from "@/assets/Images/logo-riori-black.png";
import TextBlack from "@/assets/Images/text-riori-black.png";

export default function BtnBack({ backUrl }) {
  return (
    <>
      <img className="h-20" src={LogoBlack} alt="" />
      <div>
        <div className="flex-all-center w-72">
          <img className="h-9" src={TextBlack} alt="" />
        </div>
        <div className="flex-all-center mt-1 w-72">
          <span className="flex text-xs">
            Jl. Teuku Umar No. 65 E - Denpasar, Bali
          </span>
        </div>
        <div className="flex-all-center w-72">
          <span className="flex text-xs">
            www.rioritailor.com | Email : info@rioritailor.com
          </span>
        </div>
        <div className="flex-all-center w-72">
          <span className="flex text-xs">WA +62 851 0144 2323</span>
        </div>
      </div>
    </>
  );
}
