import { Link, useNavigate } from "react-router-dom";
import Svg from "@/components/Svg";

import AddSvg from "@/assets/Svg/AddSvg";

export default function HeaderIndex({ title, addTitle, addUrl }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-1 w-full border border-gray-200 shadow-lg rounded-lg p-2">
      <div className="flex w-full font-semibold text-lg">{title}</div>
      <div className="flex justify-end">
        <Link to={addUrl} className="flex-all-center button-primary">
          <Svg title="Add" c={"w-6 fill-current"}>
            <AddSvg />
          </Svg>
          <span className="mx-1">{addTitle}</span>
        </Link>
      </div>
    </div>
  );
}
