import React from "react";
import Select from "react-select";
import OrderNotes from "@/components/OrderNotes";
import Svg from "@/components/Svg";
import EditSvg from "@/Assets/Svg/EditSvg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";
import ShowSvg from "@/Assets/Svg/ShowSvg";
import { CUSTOM_SELECT_STYLES } from "./constants";

export default function OrderDetailsTable({
  orderDetails,
  serviceOptions,
  materialOptions,
  subTotal,
  downPayment,
  discount,
  balance,
  selectedRowId,
  refs,
  onSelectServiceChange,
  onSelectMaterialChange,
  onQtyChange,
  onPriceChange,
  onDiscountChange,
  onRemoveRow,
  onBtnShowMeasurement,
  onBtnMeasurement,
  onOpenDownPaymentModal,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl mt-6">
      <table className="table-auto w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-2 py-3.5 text-center">No.</th>
            <th className="px-4 py-3.5 text-center">Jenis Pesanan</th>
            <th className="px-2 py-3.5 text-center">Ukuran</th>
            <th className="px-4 py-3.5 text-center">Jenis Kain / Bahan</th>
            <th className="px-4 py-3.5 text-center">Satuan</th>
            <th className="px-4 py-3.5 text-center">Jumlah</th>
            <th className="px-4 py-3.5 text-center">Harga</th>
            <th className="py-3.5 text-center">Total</th>
            <th className="py-3.5 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {orderDetails.map((row, index) => (
            <tr key={index} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-2 py-2 border text-center border-slate-700">
                {index + 1}
              </td>
              <td className="px-3 py-2 border border-slate-700 p-1">
                <Select
                  tabIndex={5}
                  styles={CUSTOM_SELECT_STYLES}
                  placeholder="Pilih jenis pesanan"
                  value={
                    row.service_ulid
                      ? serviceOptions.find(
                          (opt) => opt.value === row.service_ulid,
                        )
                      : null
                  }
                  onChange={(opt) => onSelectServiceChange(opt, index)}
                  options={serviceOptions}
                  required={orderDetails.length === 1}
                  ref={refs.serviceRef}
                />
              </td>
              <td className="px-2 py-2 border border-slate-700 text-center">
                {row.service_category == "tailoring" &&
                row.service_ulid &&
                row.measurements ? (
                  <button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg cursor-pointer transition"
                    onClick={() => onBtnShowMeasurement(index)}
                  >
                    <Svg title="Menu" c="w-5 fill-current mx-1">
                      <ShowSvg />
                    </Svg>
                  </button>
                ) : (
                  row.service_category == "tailoring" &&
                  row.service_ulid && (
                    <button
                      type="button"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg cursor-pointer transition"
                      onClick={() => onBtnMeasurement(row.service_ulid, index)}
                    >
                      <Svg title="Menu" c="w-5 fill-current mx-1">
                        <EditSvg />
                      </Svg>
                    </button>
                  )
                )}
              </td>
              <td className=" py-2 border border-slate-700 p-1">
                {row.service_ulid && (
                  <Select
                    tabIndex={6}
                    styles={CUSTOM_SELECT_STYLES}
                    placeholder="Pilih jenis kain"
                    onChange={(opt) => onSelectMaterialChange(opt, index)}
                    ref={refs.materialRef}
                    options={materialOptions}
                    required={!!row.service_ulid}
                    isDisabled={!row.service_ulid}
                  />
                )}
              </td>
              <td className="py-2 border border-slate-700 text-center uppercase">
                {row.unit}
              </td>
              <td className="py-2 border border-slate-700 text-center">
                <input
                  tabIndex={7}
                  ref={selectedRowId === index ? refs.qtyRef : null}
                  className="w-14 text-center text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100 py-1 focus:outline-none spinner-disabled"
                  type="number"
                  min={1}
                  value={row.quantity || ""}
                  onChange={(e) => onQtyChange(e, index)}
                  disabled={!row.service_ulid}
                  hidden={!row.service_ulid}
                  required={!!row.service_ulid}
                  onFocus={(e) => e.target.select()}
                />
              </td>
              <td className="py-2 border text-center border-slate-700">
                <input
                  tabIndex={4 + 4 + index}
                  ref={refs.priceRef}
                  className="px-2 w-24 text-right text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100 py-1 focus:outline-none spinner-disabled"
                  type="number"
                  min={0}
                  value={row.price || ""}
                  onChange={(e) => onPriceChange(e, index)}
                  disabled={!row.service_ulid}
                  hidden={!row.service_ulid}
                  required={!!row.service_ulid}
                  onFocus={(e) => e.target.select()}
                />
              </td>
              <td className="pr-2 py-2 border border-slate-700 text-right">
                {Number(row.total || 0).toLocaleString()}
              </td>
              <td className="py-2 border border-slate-700">
                <div className="flex justify-center">
                  {orderDetails.length > 1 && row.service_ulid !== null && (
                    <button
                      type="button"
                      onClick={() => onRemoveRow(index)}
                      className="p-1.5 rounded-lg text-white bg-rose-600 hover:bg-rose-500 transition cursor-pointer"
                    >
                      <Svg title="Delete" c="w-5 fill-current">
                        <DeleteSvg />
                      </Svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {/* Footer Total */}
          <tr className="border border-slate-700">
            <td
              className="px-3 py-2 border border-slate-700 align-top p-2"
              colSpan={6}
              rowSpan={4}
            >
              <OrderNotes />
            </td>
            <td className="pr-2 py-2 text-right border border-slate-700 font-semibold text-slate-300">
              Total
            </td>
            <td className="pr-2 py-2 text-right border border-slate-700 font-semibold text-slate-100">
              {Number(subTotal).toLocaleString()}
            </td>
            <td className="py-2 border border-slate-700 bg-slate-800" />
          </tr>
          <tr>
            <td className="pr-2 py-2 text-right border border-slate-700 font-semibold text-slate-300">
              Uang Muka
            </td>
            <td className="w-32 text-right border border-slate-700 font-semibold text-slate-100">
              <div className="flex justify-center w-32 px-1">
                <input
                  className="p-1 text-right w-full text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none spinner-disabled"
                  type="number"
                  readOnly
                  disabled={subTotal <= 0}
                  min={0}
                  value={downPayment}
                  onClick={onOpenDownPaymentModal}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </td>
            <td className="py-2 border border-slate-700 bg-slate-800" />
          </tr>
          <tr>
            <td className="pr-2 py-2 text-right border border-slate-700 font-semibold text-slate-300">
              Diskon
            </td>
            <td className="w-32 text-right border border-slate-700 font-semibold text-slate-100">
              <div className="flex justify-center w-32 px-1">
                <input
                  className="p-1 text-right w-full text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none spinner-disabled"
                  type="number"
                  min={0}
                  disabled={subTotal <= 0}
                  value={discount}
                  onChange={onDiscountChange}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </td>
            <td className="py-2 border border-slate-700 bg-slate-800" />
          </tr>
          <tr>
            <td className="pr-2 py-2 text-right border border-slate-700 font-semibold text-slate-300">
              Sisa
            </td>
            <td className="pr-2 py-2 text-right border border-slate-700 font-semibold text-slate-100">
              {Number(balance).toLocaleString()}
            </td>
            <td className="py-2 border border-slate-700 bg-slate-800" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
