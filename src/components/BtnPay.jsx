import Svg from "@/components/Svg";
import PaySvg from "@/Assets/Svg/PaySvg";

export default function BtnPay({ action }) {
  return (
    <button
      type="button"
      className={"flex-all-center button-success cursor-pointer"}
      onClick={action}
    >
      <Svg title="Save" c={"w-4 fill-current mx-1"}>
        <PaySvg />
      </Svg>
      <span className="mx-1">Bayar</span>
    </button>
  );
}
