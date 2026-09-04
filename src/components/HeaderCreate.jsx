import BtnCancel from "@/components/BtnCancel";
import BtnSave from "@/components/BtnSave";

export default function HeaderCreate({ titleCreate, backUrl, getProcessing }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1 w-full border-b mt-4">
        <div className="flex w-full font-semibold p-1 text-lg">
          Menambahkan {titleCreate}
        </div>

        <div className="flex justify-end p-1">
          <BtnSave p={getProcessing} />
          <BtnCancel backUrl={backUrl} />
        </div>
      </div>
    </>
  );
}
