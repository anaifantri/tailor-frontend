import React from "react";
import Select from "react-select";
import Svg from "@/components/Svg";
import AddSvg from "@/assets/Svg/AddSvg";
import { CUSTOM_SELECT_STYLES } from "./constants";

export default function OrderInfoForm({
  formData,
  customer,
  selectedCustomer,
  customerOptions,
  getErrors,
  refs,
  onSelectCustomerChange,
  onOpenCustomerModal,
  onInputChange,
  today,
}) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
      <div className="col-span-2 border border-slate-700 bg-slate-800 rounded-xl p-3 text-slate-200">
        <div className="flex items-center">
          <label className="w-40 text-slate-200">Nama Pelanggan</label>
          <label className="text-slate-200">:</label>
          <div className="w-80 ml-2">
            <Select
              tabIndex={0}
              styles={CUSTOM_SELECT_STYLES}
              placeholder="Pilih nama pelanggan"
              value={selectedCustomer}
              onChange={onSelectCustomerChange}
              options={customerOptions}
              ref={refs.customerRef}
              required
            />
          </div>
          <button
            onClick={onOpenCustomerModal}
            type="button"
            className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg ml-4 cursor-pointer transition shadow-sm"
          >
            <Svg title="Add" c="w-5 fill-current">
              <AddSvg />
            </Svg>
            <span className="mx-1">Pelanggan Baru</span>
          </button>
        </div>
        {getErrors?.customer_id && (
          <span
            ref={refs.errorRef}
            className="flex w-full text-red-400 text-xs items-center mt-1"
          >
            {getErrors.customer_id}
          </span>
        )}
        <div className="flex items-start mt-2">
          <label className="w-40 text-slate-200">Alamat</label>
          <label className="text-slate-200">:</label>
          <label className="ml-4 font-semibold text-slate-200 w-100 h-12">
            {customer?.address || "-"}
          </label>
        </div>
        <div className="flex items-center mt-2">
          <label className="w-40 text-slate-200">No. Handphone</label>
          <label className="text-slate-200">:</label>
          <label className="ml-4 font-semibold text-slate-200">
            {customer?.phone || "-"}
          </label>
        </div>
        <div className="flex items-center mt-2">
          <label className="w-40 text-slate-200">Email</label>
          <label className="text-slate-200">:</label>
          <label className="ml-4 font-semibold text-slate-200">
            {customer?.email || "-"}
          </label>
        </div>
      </div>

      <div className="border border-slate-700 bg-slate-800 rounded-xl p-3 space-y-2 text-slate-200 col-span-1 text-sm">
        <div className="grid grid-cols-3 items-center">
          <label className="w-28 text-slate-200 col-span-1">Nomor Nota</label>
          <input
            tabIndex={1}
            type="text"
            name="number"
            ref={refs.numberRef}
            onChange={onInputChange}
            className="text-sm col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="Masukkan nomor nota"
            required
          />
        </div>
        {getErrors?.number && (
          <span
            ref={refs.errorRef}
            className="flex w-full text-red-400 text-xs items-center"
          >
            {getErrors.number}
          </span>
        )}
        <div className="grid grid-cols-3 items-center">
          <label className="w-28 text-slate-200 col-span-1">Tgl. Pesan</label>
          <input
            tabIndex={2}
            name="order_date"
            value={today}
            onChange={onInputChange}
            className="text-sm col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 [&::-webkit-calendar-picker-indicator]:invert-[0.75]"
            type="date"
          />
        </div>
        <div className="grid grid-cols-3 items-center">
          <label className="w-28 text-slate-200 col-span-1">Tgl. Fitting</label>
          <input
            tabIndex={3}
            ref={refs.fittingDateRef}
            name="fitting_date"
            onChange={onInputChange}
            className="text-sm col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 [&::-webkit-calendar-picker-indicator]:invert-[0.75]"
            type="date"
          />
        </div>
        <div className="grid grid-cols-3 items-center">
          <label className="w-28 text-slate-200 col-span-1">Tgl. Selesai</label>
          <input
            tabIndex={4}
            ref={refs.dueDateRef}
            name="due_date"
            onChange={onInputChange}
            className="text-sm col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 [&::-webkit-calendar-picker-indicator]:invert-[0.75]"
            type="date"
          />
        </div>
      </div>
    </div>
  );
}
