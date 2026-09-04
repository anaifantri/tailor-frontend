import { Link } from "react-router-dom";
import Svg from "@/components/Svg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";

export default function BtnCancel({ backUrl }) {
  return (
    <Link to={backUrl} className="flex-all-center button-danger mx-1">
      <Svg title="Back" c={"w-5 fill-current mx-1"}>
        <DeleteSvg />
      </Svg>
      <span className="mx-1">Cancel</span>
    </Link>
  );
}
