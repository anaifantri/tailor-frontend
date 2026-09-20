import { Link } from "react-router-dom";
import Svg from "@/components/Svg";
import PrintSvg from "@/assets/Svg/PrintSvg";

export default function BtnPrint({ printUrl }) {
  return (
    <Link to={printUrl} className="flex-all-center button-primary mx-1">
      <Svg title="Pdf" c={"w-5 fill-current mx-1"}>
        <PrintSvg />
      </Svg>
      <span className="mx-1">Cetak</span>
    </Link>
  );
}
