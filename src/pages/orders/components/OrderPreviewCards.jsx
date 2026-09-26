import React from "react";
import FormattedDateShort from "@/Utils/FormattedDateShort";

export default function OrderPreviewCards({
  orderDetails,
  formData,
  customer,
}) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full h-175 mt-6 text-xs">
      {orderDetails?.map(
        (itemDetail, index) =>
          itemDetail.service_ulid && (
            <div
              key={index}
              className="border border-slate-700 bg-slate-800 rounded-2xl p-4 shadow-lg"
            >
              <div className="grid grid-cols-3 gap-4 border-b border-slate-700 pb-3">
                <div className="col-span-2 space-y-1 text-slate-300">
                  <div className="flex py-1">
                    <label className="w-32 text-slate-400">No. Nota</label>
                    <label>:</label>
                    <label className="ml-2 font-medium text-slate-100">
                      {formData.number || "-"}
                    </label>
                  </div>
                  <div className="flex py-1">
                    <label className="w-32 text-slate-400">
                      Nama Pelanggan
                    </label>
                    <label>:</label>
                    <label className="ml-2 font-medium text-slate-100">
                      {customer?.name || "-"}
                    </label>
                  </div>
                  <div className="flex py-1">
                    <label className="w-32 text-slate-400">No. Hp.</label>
                    <label>:</label>
                    <label className="ml-2 font-medium text-slate-100">
                      {customer?.phone || "-"}
                    </label>
                  </div>
                </div>
                <div className="col-span-1 space-y-1 text-slate-300">
                  <div className="flex py-1 justify-end">
                    <label className="w-24 text-slate-400">Tgl. Pesan</label>
                    <label>:</label>
                    <label className="ml-2 w-24 text-slate-100">
                      {formData.order_date
                        ? FormattedDateShort(formData.order_date)
                        : "-"}
                    </label>
                  </div>
                  <div className="flex py-1 justify-end">
                    <label className="w-24 text-slate-400">Tgl. Fitting</label>
                    <label>:</label>
                    <label className="ml-2 w-24 text-slate-100">
                      {formData.fitting_date
                        ? FormattedDateShort(formData.fitting_date)
                        : "-"}
                    </label>
                  </div>
                  <div className="flex py-1 justify-end">
                    <label className="w-24 text-slate-400">Tgl. Selesai</label>
                    <label>:</label>
                    <label className="ml-2 w-24 text-slate-100">
                      {formData.due_date
                        ? FormattedDateShort(formData.due_date)
                        : "-"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-rows-2 gap-2 h-150">
                <div className="p-1">
                  <div className="flex justify-center items-center font-semibold w-full p-2 bg-slate-900 rounded-lg border border-slate-700 text-gray-200 shadow-sm">
                    <label>Detail ukuran {itemDetail.service_name}</label>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 gap-2 py-1 px-2 bg-slate-900 rounded-lg border border-slate-700 text-gray-200 shadow-sm"
                      >
                        <div className="col-span-2">Lebar Dada</div>
                        <div className="col-span-1 text-center">= 56 cm</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 p-1">
                    <label className="flex">Catatan</label>
                    <textarea
                      className="border rounded-sm w-full mt-2 p-2 bg-slate-900 border-slate-700 text-gray-200 shadow-sm"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-center font-semibold w-full h-full p-2 bg-slate-900 rounded-lg border border-slate-700 text-gray-200 shadow-sm">
                  <div className="w-full h-full">
                    <label className="flex w-full justify-center">
                      Gambar Model {itemDetail.service_name}
                    </label>
                    <div className="grid grid-cols-2 gap-2 w-full h-64 p-1 mt-2">
                      <img className="w-full h-full bg-slate-800" alt="" />
                      <img className="w-full h-full bg-slate-800" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
      )}
    </div>
  );
}
