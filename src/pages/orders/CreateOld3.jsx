import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";

import api from "@/apiService";
import LoadingData from "@/components/LoadingData";
import FormattedDateShort from "@/Utils/FormattedDateShort";
import Modal from "@/components/Modal";
import OrderNotes from "@/components/OrderNotes";
import PaymentForm from "@/components/PaymentForm";
import CustomerForm from "@/components/CustomerForm";
import HeaderOrder from "@/components/HeaderOrder";
import NewMeasurementHistory from "@/components/NewMeasurementHistory";
import HeaderCreate from "@/components/HeaderCreate";

import Svg from "@/components/Svg";
import EditSvg from "@/Assets/Svg/EditSvg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";
import CheckSvg from "@/Assets/Svg/CheckSvg";
import ShowSvg from "@/Assets/Svg/ShowSvg";
import ReloadSvg from "@/Assets/Svg/ReloadSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import AddSvg from "@/assets/Svg/AddSvg";

const BASIC_MEASUREMENTS = [
  {
    name: "rok",
    measurements: ["Panjang Rok", "Lingkar Pinggang", "Lingkar Pinggul"],
  },
  {
    name: "celana",
    measurements: [
      "Panjang Celana",
      "Lingkar Pinggang",
      "Lingkar Pinggul",
      "Pesak",
      "Paha",
      "Lutut",
      "Kaki",
    ],
  },
  {
    name: "baju",
    measurements: [
      "Panjang Badan",
      "Lebar Bahu",
      "Panjang Tangan",
      "Lingkar Lengan",
      "Manset",
      "Lingkar Badan",
      "Lingkar Perut",
      "Lingkar Pinggul",
      "Lebar Dada",
      "Lebar Punggung",
      "Lingkar Leher",
    ],
  },
];

const CUSTOM_SELECT_STYLES = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1e293b",
    borderColor: "#475569",
    color: "#f8fafc",
    minHeight: "2rem",
    height: "2rem",
  }),
  singleValue: (base) => ({ ...base, color: "#f8fafc" }),
  input: (base) => ({ ...base, color: "#f8fafc" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1e293b",
    borderColor: "#475569",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#334155" : "#1e293b",
    color: "#f8fafc",
    cursor: "pointer",
  }),
};

const INITIAL_ORDER_DETAIL = {
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

  //Service
  service_code: "",
  service_name: "",
  service_category: "",
};

export default function Create() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  const errorRef = useRef();
  const customerRef = useRef(null);
  const materialRef = useRef(null);
  const serviceRef = useRef(null);
  const qtyRef = useRef(null);
  const priceRef = useRef(null);
  const fittingDateRef = useRef(null);
  const dueDateRef = useRef(null);
  const amountPaidRef = useRef(null);

  const [subTotal, setSubTotal] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [balance, setBalance] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [showDetail, setShowDetail] = useState([]);
  const [measurementHistories, setMeasurementHistories] = useState(null);
  const [orderDetailIndex, setOrderDetailIndex] = useState(null);
  const [measurements, setMeasurements] = useState(null);

  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);
  const [showMeasurementModalOpen, setShowMeasurementModalOpen] =
    useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [showInputMeasurements, setShowInputMeasurements] = useState(false);
  const [downPaymentModalOpen, setDownPaymentModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);

  const [isSelected, setIsSelected] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [measurementsLength, setMeasurementsLength] = useState(null);
  const [orderDetails, setOrderDetails] = useState([
    { ...INITIAL_ORDER_DETAIL },
  ]);

  const [findBaju, setFindBaju] = useState([]);
  const [findCelana, setFindCelana] = useState([]);
  const [findRok, setFindRok] = useState([]);

  const [customer, setCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  const [formData, setFormData] = useState({
    customer_ulid: "",
    user_ulid: "",
    number: "",
    order_date: today,
    fitting_date: "",
    due_date: "",
    sub_total: 0,
    discount: 0,
    tax: 0,
    grand_total: 0,
    amount_paid: 0,
    payment_method: "",
    payment_notes: "",
    payment_date: today,
  });

  const handleBtnDetail = (index) => {
    setShowDetail((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleMeasurementHistory = (measurementDetails, detailIndex) => {
    setMeasurements(measurementDetails);
    setOrderDetails((prev) => {
      const updated = [...prev];
      updated[detailIndex].measurements = measurementDetails;
      return updated;
    });
  };

  const handleSelectCustomerChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, customer_id: selectedOption.value }));
    const customerData = {
      hashed_id: selectedOption.value,
      code: selectedOption.code,
      name: selectedOption.name,
      address: selectedOption.address,
      phone: selectedOption.phone,
      email: selectedOption.email,
    };
    setCustomer(customerData);
    setSelectedCustomer({
      ...customerData,
      value: selectedOption.value,
      label: selectedOption.name,
    });
    fittingDateRef.current?.focus();
  };

  const handleBtnMeasurement = (
    clothingTypeId,
    customerData,
    orderDetailIdx,
  ) => {
    if (!customerData) {
      alert("Silahkan pilih pelanggan terlebih dahulu..!!");
      return;
    }

    const clothingTypeindex = services.findIndex(
      (type) => type.hashed_id === clothingTypeId,
    );
    const getBasicMeasurements = BASIC_MEASUREMENTS.find(
      (m) => m.name === services[clothingTypeindex]?.category,
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
    const customerId = customerData.hashed_id;

    const fetchData = async () => {
      try {
        const response = await api.get("/api/getbycustomerandclothing", {
          params: { customerId, clothingTypeId },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (measurementHistories !== response.data.measurement_histories) {
          setMeasurementHistories(response.data.measurement_histories);
        }
      } catch (err) {
        if (!err?.response) setError("No Server Response..!!");
        else if (err.response?.status === 401) setError("Unauthorized..!!");
        else {
          setError(err.response.data.message);
          console.log(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setMeasurementModalOpen(true);
  };

  const handleBtnShowMeasurement = (index) => {
    setOrderDetailIndex(index);
    setShowMeasurementModalOpen(true);
  };

  const handleSelectMaterialChange = (selectedOption, index) => {
    setOrderDetails((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], material_id: selectedOption.value };
      return updated;
    });
    setFormData((prev) => ({ ...prev, material_id: selectedOption.value }));
    qtyRef.current?.focus();
  };

  const handleSelectServiceChange = (selectedOption, index) => {
    console.log(selectedOption);
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
        // material_ulid: null,
        // item_type,
        // quantity: 0,
        // unit: "",
        // price: 0,
        // total: 0,
        // measurements: null,
        // fabric_consumed_meter: 0,
        // notes: null,

        //Service
        service_code: selectedOption.code,
        service_name: selectedOption.label,
        service_category: selectedOption.category,
      };
      newDetails.push({ ...INITIAL_ORDER_DETAIL });
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
    materialRef.current?.focus();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "fitting_date") dueDateRef.current?.focus();
    else if (name === "due_date") serviceRef.current?.focus();
  };

  const updateCalculations = (details) => {
    const calculatedSubTotal = details.reduce(
      (acc, current) => acc + Number(current.total || 0),
      0,
    );
    setSubTotal(calculatedSubTotal);
    setBalance(calculatedSubTotal - downPayment);
    setFormData((prev) => ({ ...prev, total: calculatedSubTotal }));
  };

  const handlePriceChange = (e, index) => {
    const value = Number(e.target.value);
    const newDetails = [...orderDetails];

    newDetails[index].price = value;
    newDetails[index].total = value * (newDetails[index].qty || 0);

    setOrderDetails(newDetails);
    updateCalculations(newDetails);
  };

  const handleQtyChange = (e, index) => {
    const value = Number(e.target.value);
    const newDetails = [...orderDetails];

    newDetails[index].qty = value;
    newDetails[index].total = (newDetails[index].price || 0) * value;

    setOrderDetails(newDetails);
    updateCalculations(newDetails);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    setDiscount(value);
    setBalance(Number(subTotal) - Number(downPayment) - Number(value));
    setFormData((prev) => ({ ...prev, discount: value }));
  };

  const removeRow = (indexToRemove) => {
    const updatedDetails = orderDetails.filter(
      (_, index) => index !== indexToRemove,
    );
    setOrderDetails(updatedDetails);
    updateCalculations(updatedDetails);
  };

  useEffect(() => {
    customerRef.current?.focus();
  }, []);

  useEffect(() => {
    setFindBaju(
      orderDetails.some((item) => item.category === "baju")
        ? BASIC_MEASUREMENTS.find((opt) => opt.name === "baju").measurements
        : [],
    );
    setFindCelana(
      orderDetails.some((item) => item.category === "celana")
        ? BASIC_MEASUREMENTS.find((opt) => opt.name === "celana").measurements
        : [],
    );
    setFindRok(
      orderDetails.some((item) => item.category === "rok")
        ? BASIC_MEASUREMENTS.find((opt) => opt.name === "rok").measurements
        : [],
    );
  }, [orderDetails]);

  useEffect(() => {
    if (isSelected && qtyRef.current) {
      qtyRef.current.focus();
      qtyRef.current.value = null;
    }
    setIsSelected(false);
  }, [isSelected]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "mulipart/form-data",
    };

    const fetchMultipleData = async () => {
      try {
        setLoading(true);
        const [resCustomers, resMaterials, resServices] = await Promise.all([
          api.get("/api/customers", { headers }),
          api.get("/api/materials", { headers }),
          api.get("/api/services", { headers }),
        ]);

        setServices(resServices.data.data);
        setCustomerOptions(
          resCustomers.data.data.map((item) => ({
            value: item.ulid,
            label: item.name,
            code: item.code,
            name: item.name,
            address: item.address,
            phone: item.phone,
            email: item.email,
          })),
        );
        setServiceOptions(
          resServices.data.data.map((item) => ({
            value: item.ulid,
            label: item.name,
            category: item.category,
            code: item.code,
          })),
        );
        setMaterialOptions(
          resMaterials.data.data.map((item) => ({
            value: item.ulid,
            label: `${item.code} | ${item.name}`,
          })),
        );
      } catch (err) {
        if (!err?.response) setError("No Server Response..!!");
        else if (err.response?.status === 401) setError("Unauthorized..!!");
        else setError(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMultipleData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");
    console.log(formData);

    const order = new FormData();
    order.append("user_id", user.hashed_id);
    order.append("number", formData.number);
    order.append("customer_id", formData.customer_id);
    order.append("order_date", formData.order_date);
    order.append("fitting_date", formData.fitting_date);
    order.append("due_date", formData.due_date);
    order.append("discount", formData.discount);
    order.append("tax", formData.tax);
    order.append("total", formData.total);
    order.append("amount_paid", formData.amount_paid);
    order.append("payment_method", formData.payment_method);
    order.append("payment_date", formData.payment_date);

    orderDetails.forEach((orderDetail, index) => {
      order.append(
        `order_details[${index}][service_id]`,
        orderDetail.service_id,
      );
      order.append(
        `order_details[${index}][measurements]`,
        JSON.stringify(orderDetail.measurements),
      );
      order.append(
        `order_details[${index}][material_id]`,
        orderDetail.material_id,
      );
      order.append(`order_details[${index}][quantity]`, orderDetail.qty);
      order.append(`order_details[${index}][price]`, orderDetail.price);
      order.append(
        `order_details[${index}][fabric_consumed_meter]`,
        orderDetail.fabric_consumed_meter,
      );
      order.append(`order_details[${index}][notes]`, orderDetail.notes);
    });
    console.log(orderDetails);

    try {
      setProcessing(true);
      await api.post("/api/orders", order, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/transactions/orders", {
        state: { message: "Penambahan data pesanan berhasil..!!" },
      });
    } catch (err) {
      if (!err?.response) setErrorMessage("No Server Response..!!");
      else if (err.response?.status === 401)
        setErrorMessage("Unauthorized..!!");
      else {
        setGetErrors(err.response.data.errors);
        console.log(err.response);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingData />;

  return (
    <div className="flex w-full justify-center">
      <div className="w-300 text-slate-100">
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data pesanan"
            backUrl="/dashboard/orders"
            getProcessing={processing}
          />

          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            <div className="col-span-2 border border-slate-700 bg-slate-800 rounded-xl p-3 text-slate-200">
              <div className="flex items-center">
                <label className="w-40 text-slate-300">Nama Pelanggan</label>
                <label className="text-slate-400">:</label>
                <div className="w-80 ml-2">
                  <Select
                    styles={CUSTOM_SELECT_STYLES}
                    placeholder="Pilih nama pelanggan"
                    value={selectedCustomer}
                    onChange={handleSelectCustomerChange}
                    options={customerOptions}
                    ref={customerRef}
                    required
                  />
                </div>
                <button
                  onClick={() => setCustomerModalOpen(true)}
                  type="button"
                  className="flex-all-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg ml-4 cursor-pointer transition shadow-sm"
                >
                  <Svg title="Add" c="w-5 fill-current">
                    <AddSvg />
                  </Svg>
                  <span className="mx-1">Pelanggan Baru</span>
                </button>
              </div>
              {getErrors?.customer_id && (
                <span
                  ref={errorRef}
                  className="flex w-full text-red-400 text-xs items-center mt-1"
                >
                  {getErrors.customer_id}
                </span>
              )}
              <div className="flex items-start mt-2">
                <label className="w-40 text-slate-300">Alamat</label>
                <label className="text-slate-400">:</label>
                <label className="ml-4 font-semibold text-slate-100 w-100 h-12">
                  {customer?.address || "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40 text-slate-300">No. Handphone</label>
                <label className="text-slate-400">:</label>
                <label className="ml-4 font-semibold text-slate-100">
                  {customer?.phone || "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40 text-slate-300">Email</label>
                <label className="text-slate-400">:</label>
                <label className="ml-4 font-semibold text-slate-100">
                  {customer?.email || "-"}
                </label>
              </div>
            </div>

            <div className="border border-slate-700 bg-slate-800 rounded-xl p-3 space-y-2 text-slate-200 col-span-1">
              <div className="grid grid-cols-3 items-center">
                <label className="w-28 text-slate-300 col-span-1">
                  Nomor Nota
                </label>
                <input
                  type="text"
                  name="number"
                  onChange={handleChange}
                  className="col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500"
                  placeholder="Masukkan nomor nota"
                  required
                />
              </div>
              {getErrors?.number && (
                <span
                  ref={errorRef}
                  className="flex w-full text-red-400 text-xs items-center"
                >
                  {getErrors.number}
                </span>
              )}
              <div className="grid grid-cols-3 items-center">
                <label className="w-28 text-slate-300 col-span-1">
                  Tgl. Pesan
                </label>
                <input
                  ref={fittingDateRef}
                  name="order_date"
                  value={today}
                  onChange={handleChange}
                  className="col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 [&::-webkit-calendar-picker-indicator]:invert-[0.75]"
                  type="date"
                />
              </div>
              {getErrors?.order_date && (
                <span
                  ref={errorRef}
                  className="flex w-full text-red-400 text-xs items-center mt-1"
                >
                  {getErrors.order_date}
                </span>
              )}
              <div className="grid grid-cols-3 items-center">
                <label className="w-28 text-slate-300 col-span-1">
                  Tgl. Fitting
                </label>
                <input
                  ref={fittingDateRef}
                  name="fitting_date"
                  onChange={handleChange}
                  className="col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 [&::-webkit-calendar-picker-indicator]:invert-[0.75]"
                  type="date"
                />
              </div>
              {getErrors?.fitting_date && (
                <span
                  ref={errorRef}
                  className="flex w-full text-red-400 text-xs items-center mt-1"
                >
                  {getErrors.fitting_date}
                </span>
              )}
              <div className="grid grid-cols-3 items-center">
                <label className="w-28 text-slate-300 col-span-1">
                  Tgl. Selesai
                </label>
                <input
                  ref={dueDateRef}
                  name="due_date"
                  onChange={handleChange}
                  className="col-span-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500 [&::-webkit-calendar-picker-indicator]:invert-[0.75]"
                  type="date"
                />
              </div>
              {getErrors?.due_date && (
                <span
                  ref={errorRef}
                  className="flex w-full text-red-400 text-xs items-center mt-1"
                >
                  {getErrors.due_date}
                </span>
              )}
            </div>
          </div>

          <div className="flex-all-center border-b border-slate-700 w-full mt-4" />

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl mt-6">
            <table className="table-auto w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-2 py-3.5 text-center">No.</th>
                  <th className="px-4 py-3.5 text-center">Jenis Pesanan</th>
                  <th className="px-2 py-3.5 text-center">Ukuran</th>
                  <th className="px-4 py-3.5 text-center">
                    Nomor Kain | Jenis Kain
                  </th>
                  <th className="px-4 py-3.5 text-center">Qty</th>
                  <th className="px-4 py-3.5 text-center">Harga</th>
                  <th className="py-3.5 text-center">Total</th>
                  <th className="py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {orderDetails.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-2 py-2 border text-center border-slate-700">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 border border-slate-700 p-1">
                      <Select
                        styles={CUSTOM_SELECT_STYLES}
                        placeholder="Pilih jenis pesanan"
                        value={
                          row.service_ulid
                            ? serviceOptions.find(
                                (opt) => opt.value === row.service_ulid,
                              )
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectServiceChange(selectedOption, index)
                        }
                        options={serviceOptions}
                        required={orderDetails.length === 1}
                        ref={serviceRef}
                      />
                    </td>
                    <td className="px-2 py-2 border border-slate-700 text-center">
                      {row.service_ulid && row.measurements ? (
                        <button
                          type="button"
                          title="Lihat ukuran"
                          className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg cursor-pointer transition"
                          onClick={() => handleBtnShowMeasurement(index)}
                        >
                          <Svg title="Menu" c="w-5 fill-current mx-1">
                            <ShowSvg />
                          </Svg>
                        </button>
                      ) : (
                        row.service_ulid && (
                          <button
                            title="Input Ukuran"
                            type="button"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg cursor-pointer transition"
                            onClick={() =>
                              handleBtnMeasurement(
                                row.service_ulid,
                                customer,
                                index,
                              )
                            }
                          >
                            <Svg title="Menu" c="w-5 fill-current mx-1">
                              <EditSvg />
                            </Svg>
                          </button>
                        )
                      )}
                    </td>
                    <td className="px-3 py-2 border border-slate-700 p-1">
                      {row.service_ulid && (
                        <Select
                          styles={CUSTOM_SELECT_STYLES}
                          placeholder="Pilih jenis kain"
                          onChange={(selectedOption) =>
                            handleSelectMaterialChange(selectedOption, index)
                          }
                          ref={materialRef}
                          options={materialOptions}
                          required={!!row.service_ulid}
                          isDisabled={!row.service_ulid}
                        />
                      )}
                    </td>
                    <td className="px-3 py-2 border border-slate-700 text-center">
                      <input
                        ref={selectedRowId === index ? qtyRef : null}
                        className="w-14 text-center text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100 py-1 focus:outline-none focus:border-indigo-500"
                        type="number"
                        min={1}
                        value={row.qty || ""}
                        onChange={(event) => handleQtyChange(event, index)}
                        disabled={!row.service_ulid}
                        hidden={!row.service_ulid}
                        required={!!row.service_ulid}
                      />
                    </td>
                    <td className="py-2 border text-center border-slate-700">
                      <input
                        ref={priceRef}
                        className="px-2 w-24 text-right text-xs spinner-disabled bg-slate-800 border border-slate-700 rounded-md text-slate-100 py-1 focus:outline-none focus:border-indigo-500"
                        type="number"
                        min={0}
                        value={row.price || ""}
                        onChange={(event) => handlePriceChange(event, index)}
                        disabled={!row.service_ulid}
                        hidden={!row.service_ulid}
                        required={!!row.service_ulid}
                      />
                    </td>
                    <td className="px-2 py-2 border border-slate-700 text-right">
                      {Number(row.total || 0).toLocaleString()}
                    </td>
                    <td className="py-2 border border-slate-700">
                      <div className="flex-all-center">
                        {orderDetails.length > 1 &&
                          row.service_ulid !== null && (
                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              className="flex-all-center p-1.5 rounded-lg text-white bg-rose-600 hover:bg-rose-500 transition cursor-pointer"
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
                <tr className="border border-slate-700">
                  <td
                    className="px-3 py-2 border border-slate-700 align-top p-2"
                    colSpan={5}
                    rowSpan={4}
                  >
                    <OrderNotes />
                  </td>
                  <td className="px-2 py-2 text-right border border-slate-700 font-semibold text-slate-300">
                    Total
                  </td>
                  <td className="px-2 py-2 text-right border border-slate-700 font-semibold text-slate-100">
                    {Number(subTotal).toLocaleString()}
                  </td>
                  <td className="py-2 text-right border border-slate-700 bg-slate-800" />
                </tr>
                <tr className="h-6">
                  <td className="px-2 py-2 text-right border border-slate-700 font-semibold text-slate-300">
                    Uang Muka
                  </td>
                  <td className="px-2 py-2 text-right border border-slate-700 font-semibold text-slate-100">
                    <input
                      className="px-1 text-right w-24 text-xs spinner-disabled bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none"
                      type="number"
                      readOnly
                      disabled={subTotal <= 0}
                      min={0}
                      value={downPayment}
                      onClick={() => {
                        setDownPaymentModalOpen(true);
                        amountPaidRef.current?.focus();
                      }}
                    />
                  </td>
                  <td className="py-2 text-right border border-slate-700 bg-slate-800" />
                </tr>
                <tr>
                  <td className="px-3 py-2 text-right border border-slate-700 font-semibold text-slate-300">
                    Diskon
                  </td>
                  <td className="px-2 py-2 text-right border border-slate-700 font-semibold text-slate-100">
                    <input
                      className="px-1 text-right w-24 spinner-disabled text-xs bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-indigo-500"
                      type="number"
                      min={0}
                      disabled={subTotal <= 0}
                      defaultValue={discount}
                      onChange={handleDiscountChange}
                    />
                  </td>
                  <td className="py-2 text-right border border-slate-700 bg-slate-800" />
                </tr>
                <tr>
                  <td className="px-2 py-2 text-right border border-slate-700 font-semibold text-slate-300">
                    Sisa
                  </td>
                  <td className="px-2 py-2 text-right border border-slate-700 font-semibold text-slate-100">
                    {Number(balance).toLocaleString()}
                  </td>
                  <td className="py-2 text-right border border-slate-700 bg-slate-800" />
                </tr>
              </tbody>
            </table>
          </div>
          {getErrors?.order_details && (
            <span
              ref={errorRef}
              className="flex w-full text-red-400 text-xs items-center mt-1"
            >
              {getErrors.order_details}
            </span>
          )}
        </form>

        <div className="grid grid-cols-2 gap-4 w-full h-175 mt-6 text-xs">
          {orderDetails?.map((itemDetail, index) => {
            return (
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
                        <label className="w-24 text-slate-400">
                          Tgl. Pesan
                        </label>
                        <label>:</label>
                        <label className="ml-2 w-24 text-slate-100">
                          {formData.order_date
                            ? FormattedDateShort(formData.order_date)
                            : "-"}
                        </label>
                      </div>
                      <div className="flex py-1 justify-end">
                        <label className="w-24 text-slate-400">
                          Tgl. Fitting
                        </label>
                        <label>:</label>
                        <label className="ml-2 w-24 text-slate-100">
                          {formData.fitting_date
                            ? FormattedDateShort(formData.fitting_date)
                            : "-"}
                        </label>
                      </div>
                      <div className="flex py-1 justify-end">
                        <label className="w-24 text-slate-400">
                          Tgl. Selesai
                        </label>
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
                      <div className="flex justify-center items-center font-semibold w-full p-2 bg-slate-900 rounded-lg border border-slate-700 text-indigo-300 shadow-sm">
                        <label>Detail ukuran {itemDetail.service_name}</label>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {Array.from({ length: 12 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-3 gap-2 py-1 px-2 bg-slate-900 rounded-lg border border-slate-700 text-indigo-300 shadow-sm"
                          >
                            <div className="col-span-2">Lebar Dada</div>
                            <div className="col-span-1 text-center">
                              = 56 cm
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 p-1">
                        <label className="flex">Catatan</label>
                        <textarea
                          className="border rounded-sm w-full mt-2"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-center font-semibold w-full h-full p-2 bg-slate-900 rounded-lg border border-slate-700 text-indigo-300 shadow-sm">
                      <div className="w-full h-full">
                        <label className="flex w-full justify-center">
                          Gambar Model {itemDetail.service_name}
                        </label>
                        <div className="grid grid-cols-2 gap-2 w-full h-64 p-1 mt-2">
                          <img className="w-full h-full" alt="" />
                          <img className="w-full h-full" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>

      <Modal
        title="Silahkan Masukkan Ukuran Baru atau Pilih ukuran lama"
        isOpen={measurementModalOpen}
        onClose={() => setMeasurementModalOpen(false)}
      >
        <div className="flex items-center text-slate-200">
          <input
            name="measurmentOptions"
            value="choose"
            type="radio"
            defaultChecked
            onClick={() => setShowInputMeasurements(false)}
            className="accent-indigo-500"
          />
          <span className="flex ml-2">Pilih ukuran lama</span>
          <input
            className="ml-4 accent-indigo-500"
            name="measurmentOptions"
            value="input"
            type="radio"
            onClick={() => setShowInputMeasurements(true)}
          />
          <span className="flex ml-2">Masukkan ukuran baru</span>
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
                  {measurementHistories?.map((measurement, index) => {
                    const isShow = showDetail.includes(index);
                    const measurementDetails = JSON.parse(
                      measurement.measurement_details,
                    );
                    return (
                      <tr
                        key={index}
                        className="hover:bg-slate-700/50 transition-colors text-sm text-slate-200"
                      >
                        <td className="px-3 py-1 text-center">{index + 1}</td>
                        <td className="px-3 py-1 text-center">
                          {measurement.service.type}
                        </td>
                        <td className="px-3 py-1 text-center">
                          {FormattedDateShort(measurement.measured_at)}
                        </td>
                        <td className="px-3 py-1 text-center">
                          {measurement.measured_by}
                        </td>
                        <td className="px-3 py-1">
                          <div className="flex w-full">
                            {isShow ? (
                              <div className="w-72">
                                <div className="w-full border-b border-slate-700 py-1 text-indigo-400 font-medium">
                                  Detail Ukuran
                                </div>
                                <div className="mt-2 space-y-1">
                                  {measurementDetails.map(
                                    (itemDetail, indexDetail) =>
                                      itemDetail.name !== "" && (
                                        <div
                                          key={indexDetail}
                                          className="flex items-start text-slate-300"
                                        >
                                          <label className="w-6">
                                            {indexDetail + 1}.{" "}
                                          </label>
                                          <label className="w-36">
                                            {itemDetail.name}
                                          </label>
                                          <label>=</label>
                                          <label className="ml-2 text-slate-100 font-medium">
                                            {itemDetail.value}
                                          </label>
                                          <label className="flex w-6 ml-2 text-slate-400">
                                            cm
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
                              className="flex justify-center items-center w-4 mx-auto text-slate-400 hover:text-indigo-400 cursor-pointer transition"
                              onClick={() => handleBtnDetail(index)}
                            >
                              <Svg
                                title="Arrow"
                                c={
                                  isShow
                                    ? "nav-svg w-5 fill-current rotate-180 text-indigo-400"
                                    : "nav-svg w-5 fill-current"
                                }
                              >
                                <ArrowSvg />
                              </Svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-1 text-center">
                          <div className="w-full flex-all-center p-1 my-1">
                            <input
                              name="measurement_history_id"
                              type="radio"
                              className="accent-indigo-500"
                              value={measurement.hashed_id}
                              onClick={() =>
                                handleMeasurementHistory(
                                  measurementDetails,
                                  orderDetailIndex,
                                )
                              }
                            />
                            <label className="ml-1 text-slate-200">Pilih</label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(!measurementHistories || measurementHistories.length === 0) && (
                <div className="w-full flex-all-center text-rose-400 p-3 bg-slate-800 text-sm">
                  Belum ada ukuran untuk pelanggan dan jenis pakaian yang
                  dipilih...!! silahkan input data pengukuran terlebih dahulu.
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  if (measurements == null)
                    alert("Silahkan pilih ukuran terlebih dahulu..!!");
                  else setMeasurementModalOpen(false);
                }}
                className="flex-all-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition shadow"
              >
                <Svg title="Close" c="w-5 fill-current">
                  <CheckSvg />
                </Svg>
                <span className="ml-1">Submit</span>
              </button>
            </div>
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

      <Modal
        title="Detail Ukuran"
        isOpen={showMeasurementModalOpen}
        onClose={() => setShowMeasurementModalOpen(false)}
      >
        {showMeasurementModalOpen && (
          <div>
            <div className="p-4 border border-slate-700 bg-slate-800 shadow-lg rounded-xl w-full mt-4 text-slate-200">
              <div className="flex items-center">
                <label className="w-44 text-slate-400">Nama Pelanggan</label>
                <label className="text-slate-500">:</label>
                <label className="ml-2 font-medium text-slate-100">
                  {customer?.name}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-44 text-slate-400">Katagori Pakaian</label>
                <label className="text-slate-500">:</label>
                <label className="ml-2 font-medium text-slate-100">
                  {orderDetails[orderDetailIndex]?.category === "baju"
                    ? "Baju / Atasan"
                    : orderDetails[orderDetailIndex]?.category}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-44 text-slate-400">Jenis Pakaian</label>
                <label className="text-slate-500">:</label>
                <label className="ml-2 font-medium text-slate-100">
                  {orderDetails[orderDetailIndex]?.service}
                </label>
              </div>
              <div className="divide-y divide-slate-700 mt-4">
                <div className="flex justify-center items-center rounded-md bg-slate-900 p-2 w-96 font-semibold text-indigo-400">
                  <label className="flex">Detail ukuran</label>
                </div>
                {orderDetails[orderDetailIndex]?.measurements?.map(
                  (measurement, index) =>
                    measurement.name !== "" && (
                      <div
                        key={index}
                        className="flex items-center p-2 w-96 hover:bg-slate-700/40 text-slate-300"
                      >
                        <label className="w-6">{index + 1}. </label>
                        <label className="w-56">{measurement.name}</label>
                        <label className="ml-4 text-indigo-300 font-medium">
                          {measurement.value}
                        </label>
                        <label className="flex w-6 ml-2 text-slate-400 text-xs">
                          cm
                        </label>
                      </div>
                    ),
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowMeasurementModalOpen(false)}
                className="flex-all-center bg-rose-600 hover:bg-rose-500 text-white font-medium px-3 py-1.5 rounded-lg cursor-pointer transition shadow"
              >
                <Svg title="Close" c="w-5 fill-current">
                  <DeleteSvg />
                </Svg>
                <span className="ml-1">Close</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeasurementModalOpen(true);
                  setShowMeasurementModalOpen(false);
                }}
                className="flex-all-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg cursor-pointer ml-2 transition shadow"
              >
                <Svg title="Close" c="w-5 fill-current">
                  <ReloadSvg />
                </Svg>
                <span className="ml-1">Rubah Ukuran</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

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
              setFormData((prev) => ({
                ...prev,
                amount_paid: 0,
                payment_method: "",
                payment_notes: "",
              }));
            }}
            className="flex-all-center bg-rose-600 hover:bg-rose-500 text-white font-medium px-3 py-1.5 rounded-lg mx-1 cursor-pointer transition shadow"
          >
            <Svg title="Cancel" c="w-5 fill-current mx-1">
              <DeleteSvg />
            </Svg>
            <span className="mx-1">Cancel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDownPaymentModalOpen(false);
              setDownPayment(formData.amount_paid);
              setBalance(Number(subTotal) - Number(formData.amount_paid));
            }}
            className="flex-all-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg cursor-pointer transition shadow"
          >
            <Svg title="Close" c="w-5 fill-current">
              <CheckSvg />
            </Svg>
            <span className="ml-1">Submit</span>
          </button>
        </div>
      </Modal>
    </div>
  );
}
