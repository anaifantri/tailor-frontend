import { Link } from "react-router-dom";
import Svg from "@/Components/Svg";
import BackSvg from "@/Assets/Svg/BackSvg";

export default function BtnBack({ backUrl }) {
  return (
    <Link to={backUrl} className="flex-all-center button-primary mx-1">
      <Svg title="Back" c={"w-5 fill-current mx-1"}>
        <BackSvg />
      </Svg>
      <span className="mx-1">Back</span>
    </Link>
  );
}
