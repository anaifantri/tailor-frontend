import BtnCancel from "@/Components/BtnCancel";
import BtnSave from "@/Components/BtnSave";

export default function HeaderEdit({ titleEdit, backUrl, getProcessing }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1 w-full border-b">
        <div className="flex w-full font-semibold p-1 text-lg">
          Edit {titleEdit}
        </div>

        <div className="flex justify-end p-1">
          <BtnSave p={getProcessing} />
          <BtnCancel backUrl={backUrl} />
        </div>
      </div>
    </>
  );
}
