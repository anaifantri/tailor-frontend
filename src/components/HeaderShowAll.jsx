import Svg from "@/components/Svg";
import BtnBack from "@/components/BtnBack";
import BtnPdf from "@/components/BtnPdf";
import BtnPrint from "@/components/BtnPrint";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";

export default function HeaderShowAll({
  titleShow,
  url,
  deleteUrl,
  getId,
  token,
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1 w-full border border-gray-200 shadow-lg rounded-lg p-2">
        <div className="flex w-full font-semibold text-lg">
          Detail {titleShow}
        </div>
        <div className="flex justify-end w-full mx-1">
          <BtnBack backUrl={`/dashboard${url}`} />
          <BtnEdit editUrl={`/dashboard${url}/edit/${getId}`} />
          <BtnPdf pdfUrl={`/dashboard${url}/order-pdf/${getId}`} />
          <BtnPrint printUrl={`/dashboard${url}/order-print/${getId}`} />
          <BtnDelete
            deleteUrl={`/api${deleteUrl}/delete/`}
            deleteId={getId}
            getToken={token}
            returnUrl={`/dashboard${url}`}
          />
        </div>
      </div>
    </>
  );
}
