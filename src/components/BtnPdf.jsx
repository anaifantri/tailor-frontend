import { Link } from "react-router-dom";
import Svg from "@/components/Svg";
import PdfSvg from "@/assets/Svg/PdfSvg";

export default function BtnPdf({ pdfUrl }) {
  return (
    <Link to={pdfUrl} className="flex-all-center button-success mx-1">
      <Svg title="Pdf" c={"w-5 fill-current mx-1"}>
        <PdfSvg />
      </Svg>
      <span className="mx-1">Simpan Pdf</span>
    </Link>
  );
}
