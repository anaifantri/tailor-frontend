import Svg from "@/components/Svg";
import SaveSvg from "@/assets/Svg/SaveSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function CustomerForm({
  actionForm,
  actionChange,
  processing,
  getErrors,
}) {
  return (
    <form onSubmit={actionForm}>
      <div className="border border-slate-200 shadow-xl rounded-xl p-4 mt-4 w-120">
        <label>Nama Pelanggan</label>
        <input
          type="text"
          name="name"
          className="flex p-2 h-8 w-full mt-1"
          placeholder="Masukkan Nama Pelanggan"
          autoComplete="off"
          onChange={actionChange}
          required
        />
        {getErrors?.name && (
          <span
            ref={errorRef}
            className={
              getErrors
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.name}
          </span>
        )}
        <label className="flex mt-4">Alamat</label>
        <textarea
          name="address"
          className="flex p-1 w-full mt-1"
          placeholder="Masukkan Alamat"
          rows={3}
          onChange={actionChange}
        />
        {getErrors?.address && (
          <span
            ref={errorRef}
            className={
              errorMessage
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.address}
          </span>
        )}
        <label className="flex mt-4">Nomor Hp.</label>
        <input
          type="text"
          name="phone"
          className="flex p-2 h-8 w-full mt-1"
          placeholder="Masukkan Nomor Hp."
          autoComplete="off"
          onChange={actionChange}
          required
        />
        {getErrors?.phone && (
          <span
            ref={errorRef}
            className={
              getErrors
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.phone}
          </span>
        )}
        <label className="flex mt-4">Email</label>
        <input
          type="email"
          name="email"
          className="flex p-2 h-8 w-full mt-1"
          placeholder="Masukkan email"
          autoComplete="off"
          onChange={actionChange}
        />
        {getErrors?.email && (
          <span
            ref={errorRef}
            className={
              getErrors
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.email}
          </span>
        )}
      </div>
      <div className="flex w-full justify-end mt-2 px-2">
        <button
          type="submit"
          disabled={processing}
          className={
            processing
              ? "flex-all-center button-disabled"
              : "flex-all-center button-success cursor-pointer"
          }
        >
          {processing ? (
            <Svg title="Spin" c={"w-4 fill-current mx-1 animate-spin"}>
              <SpinSvg />
            </Svg>
          ) : (
            <Svg title="Save" c={"w-4 fill-current mx-1"}>
              <SaveSvg />
            </Svg>
          )}
          <span className="mx-1">
            {processing ? "Menyimpan data..." : "Simpan"}
          </span>
        </button>
      </div>
    </form>
  );
}
