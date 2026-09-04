import { Link, useNavigate } from "react-router-dom";
import Svg from "@/components/Svg";

import AddSvg from "@/assets/Svg/AddSvg";

export default function HeaderIndex({ title, addTitle, addUrl }) {
  const navigate = useNavigate();
  return (
    <div className="flex border-b w-full">
      <label className="flex font-semibold p-1 text-lg w-96">{title}</label>
      <div className="flex justify-end items-center w-full">
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
