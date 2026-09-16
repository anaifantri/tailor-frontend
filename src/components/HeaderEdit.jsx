import BtnCancel from "@/Components/BtnCancel";
import BtnSave from "@/Components/BtnSave";

export default function HeaderEdit({ titleEdit, backUrl, getProcessing }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1 w-full border border-gray-200 shadow-lg rounded-lg p-2">
        <div className="flex w-full font-semibold text-lg">
          Edit {titleEdit}
        </div>

        <div className="flex justify-end">
          <BtnSave p={getProcessing} />
          <BtnCancel backUrl={backUrl} />
        </div>
      </div>
    </>
  );
}
