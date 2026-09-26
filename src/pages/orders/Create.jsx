import React, { useState } from "react";
import LoadingData from "@/components/LoadingData";
import HeaderCreate from "@/components/HeaderCreate";
import Modal from "@/components/Modal";
import CustomerForm from "@/components/CustomerForm";
import PaymentForm from "@/components/PaymentForm";
import NewMeasurementHistory from "@/components/NewMeasurementHistory";

import Svg from "@/components/Svg";
import CheckSvg from "@/Assets/Svg/CheckSvg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";
import ReloadSvg from "@/Assets/Svg/ReloadSvg";
import ShowSvg from "@/Assets/Svg/ShowSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";

import FormattedDateShort from "@/Utils/FormattedDateShort";
import api from "@/apiService";

import { useOrderForm } from "./hooks/useOrderForm";
import { BASIC_MEASUREMENTS } from "./components/constants";
import OrderInfoForm from "./components/OrderInfoForm";
import OrderDetailsTable from "./components/OrderDetailsTable";
import OrderPreviewCards from "./components/OrderPreviewCards";

export default function Create() {
  const {
    today,
    token,
    loading,
    processing,
    error,
    getErrors,
    formData,
    customer,
    selectedCustomer,
    customerOptions,
    serviceOptions,
    materialOptions,
    orderDetails,
    subTotal,
    downPayment,
    balance,
    discount,
    measurements,
    measurementsLength,
    measurementHistories,
    orderDetailIndex,
    selectedRowId,
    setOrderDetails,
    setMeasurements,
    setMeasurementsLength,
    setMeasurementHistories,
    setOrderDetailIndex,
    setSelectedRowId,
    setIsSelected,
    setCustomerOptions,
    setSelectedCustomer,
    setCustomer,
    setFormData,
    setDownPayment,
    setBalance,
    handleChange,
    handlePriceChange,
    handleQtyChange,
    handleDiscountChange,
    removeRow,
    handleSubmit,
    refs,
  } = useOrderForm();

  // Modals Visibility State
  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);
  const [showMeasurementModalOpen, setShowMeasurementModalOpen] =
    useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [showInputMeasurements, setShowInputMeasurements] = useState(false);
  const [downPaymentModalOpen, setDownPaymentModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState([]);

  if (loading) return <LoadingData />;

  // Handler Internal Modal Pengukuran Pemesanan
  const handleBtnMeasurement = async (clothingTypeId, orderDetailIdx) => {
    if (!customer) {
      alert("Silahkan pilih pelanggan terlebih dahulu..!!");
      return;
    }

    const currentService = serviceOptions.find(
      (type) => type.value === clothingTypeId,
    );
    const getBasicMeasurements = BASIC_MEASUREMENTS.find(
      (m) => m.name === currentService?.category,
    );
    const formattedMeasurements =
      getBasicMeasurements?.measurements.map((item) => ({
        name: item,
        value: "",
      })) || [];
    formattedMeasurements.push({ name: "", value: 0 });

    const targetOrderDetail = orderDetails[orderDetailIdx];
    if (targetOrderDetail.measurement_history_id) {
      setMeasurements(targetOrderDetail.measurements);
      setMeasurementsLength(targetOrderDetail.measurements.length - 1);
    } else {
      setMeasurements(formattedMeasurements);
      setMeasurementsLength(formattedMeasurements.length - 1);
    }

    setOrderDetailIndex(orderDetailIdx);

    try {
      const response = await api.get("/api/getbycustomerandclothing", {
        params: { customerId: customer.hashed_id, clothingTypeId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeasurementHistories(response.data.measurement_histories);
    } catch (err) {
      console.error(err);
    }
    setMeasurementModalOpen(true);
  };

  const handleSelectServiceChange = (selectedOption, index) => {
    let targetIndex = index;
    const exists = orderDetails.some(
      (detail) => detail.service_ulid === selectedOption.value,
    );
    const newDetails = [...orderDetails];

    if (exists) {
      targetIndex = orderDetails.findIndex(
        (detail) => detail.service_ulid === selectedOption.value,
      );
    }

    setSelectedRowId(targetIndex);
    setIsSelected(true);

    if (targetIndex === orderDetails.length - 1 && selectedOption) {
      newDetails[targetIndex] = {
        ...newDetails[targetIndex],
        service_ulid: selectedOption.value,
        service_code: selectedOption.code,
        service_name: selectedOption.label,
        service_category: selectedOption.category,
      };
      newDetails.push({
        service_ulid: null,
        material_ulid: null,
        item_type: null,
        quantity: 0,
        unit: "",
        price: 0,
        total: 0,
        measurements: null,
        fabric_consumed_meter: 0,
        notes: null,
        service_code: "",
        service_name: "",
        service_category: "",
      });
    } else {
      newDetails[targetIndex] = {
        ...newDetails[targetIndex],
        service_ulid: selectedOption.value,
        service_code: selectedOption.code,
        service_name: selectedOption.label,
        service_category: selectedOption.category,
      };
    }
    setOrderDetails(newDetails);
    refs.materialRef.current?.focus();
  };

  return (
    <div className="flex w-full justify-center text-brand-accent">
      <div className="w-300">
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data pesanan"
            backUrl="/dashboard/orders"
            getProcessing={processing}
          />

          <OrderInfoForm
            formData={formData}
            customer={customer}
            selectedCustomer={selectedCustomer}
            customerOptions={customerOptions}
            getErrors={getErrors}
            refs={refs}
            today={today}
            onSelectCustomerChange={(opt) => {
              setFormData((prev) => ({ ...prev, customer_ulid: opt.value }));
              const customerData = {
                ulid: opt.value,
                code: opt.code,
                name: opt.name,
                address: opt.address,
                phone: opt.phone,
                email: opt.email,
              };
              setCustomer(customerData);
              setSelectedCustomer({
                ...customerData,
                value: opt.value,
                label: opt.name,
              });
              refs.numberRef.current?.focus();
            }}
            onOpenCustomerModal={() => setCustomerModalOpen(true)}
            onInputChange={handleChange}
          />

          <div className="flex border-b border-slate-700 w-full mt-4" />

          <OrderDetailsTable
            orderDetails={orderDetails}
            serviceOptions={serviceOptions}
            materialOptions={materialOptions}
            subTotal={subTotal}
            downPayment={downPayment}
            discount={discount}
            balance={balance}
            selectedRowId={selectedRowId}
            refs={refs}
            onSelectServiceChange={handleSelectServiceChange}
            onSelectMaterialChange={(opt, idx) => {
              setOrderDetails((prev) => {
                const u = [...prev];
                u[idx].material_ulid = opt.value;
                u[idx].unit = opt.unit;
                return u;
              });
              setFormData((prev) => ({ ...prev, material_ulid: opt.value }));
              refs.qtyRef.current?.focus();
            }}
            onQtyChange={handleQtyChange}
            onPriceChange={handlePriceChange}
            onDiscountChange={handleDiscountChange}
            onRemoveRow={removeRow}
            onBtnShowMeasurement={(idx) => {
              setOrderDetailIndex(idx);
              setShowMeasurementModalOpen(true);
            }}
            onBtnMeasurement={handleBtnMeasurement}
            onOpenDownPaymentModal={() => {
              setDownPaymentModalOpen(true);
              refs.amountPaidRef.current?.focus();
            }}
          />
        </form>

        <OrderPreviewCards
          orderDetails={orderDetails}
          formData={formData}
          customer={customer}
        />
      </div>

      {/* Modal 1: Pemilihan/Penginputan Ukuran */}
      <Modal
        title="Silahkan Masukkan Ukuran Baru atau Pilih ukuran lama"
        isOpen={measurementModalOpen}
        onClose={() => setMeasurementModalOpen(false)}
      >
        <div className="flex items-center text-slate-200">
          <input
            name="measurmentOptions"
            type="radio"
            defaultChecked
            onClick={() => setShowInputMeasurements(false)}
            className="accent-indigo-500"
          />
          <span className="ml-2 mr-4">Pilih ukuran lama</span>
          <input
            name="measurmentOptions"
            type="radio"
            onClick={() => setShowInputMeasurements(true)}
            className="accent-indigo-500"
          />
          <span className="ml-2">Masukkan ukuran baru</span>
        </div>
        {!showInputMeasurements ? (
          <div>
            <div className="overflow-hidden rounded-xl border border-slate-700 shadow-sm mt-4 bg-slate-800">
              <table className="table-auto w-full divide-y divide-slate-700 text-left text-slate-300">
                <thead className="bg-slate-900 font-semibold text-slate-200 text-sm">
                  <tr>
                    <th className="px-6 py-3 text-center">No.</th>
                    <th className="px-6 py-3 text-center">Jenis Pakaian</th>
                    <th className="px-6 py-3 text-center">Tanggal Ukur</th>
                    <th className="px-6 py-3 text-center">Diukur Oleh</th>
                    <th className="px-6 py-3">Detail Ukuran</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 bg-slate-800">
                  {measurementHistories?.map((m, index) => {
                    const isShow = showDetail.includes(index);
                    const details = JSON.parse(m.measurement_details);
                    return (
                      <tr
                        key={index}
                        className="hover:bg-slate-700/50 text-sm text-slate-200"
                      >
                        <td className="px-3 py-1 text-center">{index + 1}</td>
                        <td className="px-3 py-1 text-center">
                          {m.service.type}
                        </td>
                        <td className="px-3 py-1 text-center">
                          {FormattedDateShort(m.measured_at)}
                        </td>
                        <td className="px-3 py-1 text-center">
                          {m.measured_by}
                        </td>
                        <td className="px-3 py-1">
                          <div className="flex w-full">
                            {isShow ? (
                              <div className="w-72">
                                <div className="w-full border-b border-slate-700 py-1 text-indigo-400 font-medium">
                                  Detail Ukuran
                                </div>
                                <div className="mt-2 space-y-1">
                                  {details.map(
                                    (d, dIdx) =>
                                      d.name && (
                                        <div
                                          key={dIdx}
                                          className="flex text-slate-300"
                                        >
                                          <label className="w-6">
                                            {dIdx + 1}.{" "}
                                          </label>
                                          <label className="w-36">
                                            {d.name}
                                          </label>
                                          <label>=</label>
                                          <label className="ml-2 text-slate-100 font-medium">
                                            {d.value} cm
                                          </label>
                                        </div>
                                      ),
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="w-72 text-slate-400">
                                Tampilkan Detail Ukuran
                              </div>
                            )}
                            <button
                              type="button"
                              className="mx-auto text-slate-400"
                              onClick={() =>
                                setShowDetail((prev) =>
                                  prev.includes(index)
                                    ? prev.filter((i) => i !== index)
                                    : [...prev, index],
                                )
                              }
                            >
                              <Svg
                                title="Arrow"
                                c={isShow ? "w-5 rotate-180" : "w-5"}
                              >
                                <ArrowSvg />
                              </Svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-1 text-center">
                          <input
                            name="measurement_history_id"
                            type="radio"
                            className="accent-indigo-500"
                            onClick={() => {
                              setMeasurements(details);
                              setOrderDetails((prev) => {
                                const u = [...prev];
                                u[orderDetailIndex].measurements = details;
                                return u;
                              });
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() =>
                !measurements
                  ? alert("Pilih ukuran!")
                  : setMeasurementModalOpen(false)
              }
              className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center float-right"
            >
              <CheckSvg />
              <span className="ml-2">Submit</span>
            </button>
          </div>
        ) : (
          <NewMeasurementHistory
            measurements={measurements}
            measurementsLength={measurementsLength}
            setOrderDetails={setOrderDetails}
            orderDetails={orderDetails}
            setMeasurements={setMeasurements}
            customer={customer}
            indexOrderDetail={orderDetailIndex}
            clothingTypeId={orderDetails[orderDetailIndex]?.service_id}
            clothingType={orderDetails[orderDetailIndex]?.service}
            category={orderDetails[orderDetailIndex]?.category}
            today={today}
            setMeasurementModalOpen={setMeasurementModalOpen}
          />
        )}
      </Modal>

      {/* MODAL 2: Menampilkan Pratinjau Data Ukuran Terpilih */}
      <Modal
        title="Detail Ukuran"
        isOpen={showMeasurementModalOpen}
        onClose={() => setShowMeasurementModalOpen(false)}
      >
        <div className="p-4 border border-slate-700 bg-slate-800 shadow-lg rounded-xl text-slate-200 mt-4">
          <p>Nama Pelanggan: {customer?.name}</p>
          <div className="divide-y divide-slate-700 mt-4">
            {orderDetails[orderDetailIndex]?.measurements?.map(
              (m, idx) =>
                m.name && (
                  <div key={idx} className="flex p-2 hover:bg-slate-700/40">
                    <span className="w-6">{idx + 1}.</span>
                    <span className="w-56">{m.name}</span>
                    <span className="ml-4 text-indigo-300 font-medium">
                      {m.value} cm
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowMeasurementModalOpen(false)}
            className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <DeleteSvg />
            <span className="ml-2">Close</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMeasurementModalOpen(true);
              setShowMeasurementModalOpen(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <ReloadSvg />
            <span className="ml-2">Ubah</span>
          </button>
        </div>
      </Modal>

      {/* MODAL 3: Form Pendaftaran Member Pelanggan Baru */}
      <Modal
        title="Tambah Pelanggan Baru"
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      >
        <CustomerForm
          setCustomerOptions={setCustomerOptions}
          setSelectedCustomer={setSelectedCustomer}
          setCustomer={setCustomer}
          setCustomerModalOpen={setCustomerModalOpen}
        />
      </Modal>

      {/* MODAL 4: Menginput Jumlah Transaksi Uang Muka */}
      <Modal
        title="Input Pembayaran"
        isOpen={downPaymentModalOpen}
        onClose={() => setDownPaymentModalOpen(false)}
      >
        <PaymentForm data={formData} action={handleChange} />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => {
              setDownPaymentModalOpen(false);
              setFormData((p) => ({ ...p, amount_paid: 0 }));
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <DeleteSvg />
            <span className="ml-2">Cancel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDownPaymentModalOpen(false);
              setDownPayment(formData.amount_paid);
              setBalance(subTotal - formData.amount_paid - discount);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <CheckSvg />
            <span className="ml-2">Submit</span>
          </button>
        </div>
      </Modal>
    </div>
  );
}
