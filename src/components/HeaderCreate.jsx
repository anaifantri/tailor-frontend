import BtnCancel from "@/components/BtnCancel";
import BtnSave from "@/components/BtnSave";

export default function HeaderCreate({ titleCreate, backUrl, getProcessing }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1 w-full border border-gray-200 shadow-lg rounded-lg p-3">
        <div className="flex w-full font-semibold text-lg">
          Menambahkan {titleCreate}
        </div>

        <div className="flex justify-end">
          <BtnSave p={getProcessing} />
          <BtnCancel backUrl={backUrl} />
        </div>
      </div>
    </>
  );
}
