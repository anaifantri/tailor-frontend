import Svg from "@/components/Svg";
import BtnBack from "@/components/BtnBack";
// import BtnPdf from "@/components/BtnPdf";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";

export default function HeaderShow({ titleShow, url, getId, token }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1 w-full border-b">
        <div className="flex w-full font-semibold p-1 text-lg">
          Detail {titleShow}
        </div>
        <div className="flex justify-end w-full mx-1 p-1">
          <BtnBack backUrl={`/dashboard${url}`} />
          <BtnEdit editUrl={`/dashboard${url}/edit/${getId}`} />
          <BtnDelete
            deleteUrl={`/api${url}/delete/`}
            deleteId={getId}
            getToken={token}
            returnUrl={`/dashboard${url}`}
          />
        </div>
      </div>
    </>
  );
}
