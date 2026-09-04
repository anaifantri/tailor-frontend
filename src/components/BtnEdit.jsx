import { Link, useNavigate } from "react-router-dom";
import Svg from "@/Components/Svg";
import EditSvg from "@/Assets/Svg/EditSvg";

export default function BtnEdit({ editUrl }) {
  return (
    <Link to={editUrl} className="flex-all-center button-warning mx-1">
      <Svg title="Edit" c={"w-5 fill-current mx-1"}>
        <EditSvg />
      </Svg>
      <span className="mx-1">Edit</span>
    </Link>
  );
}
