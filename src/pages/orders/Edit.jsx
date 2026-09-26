import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";

import api from "@/apiService";
import LoadingData from "@/Components/LoadingData";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import MeasurementModal from "@/components/Modal";
import ShowMeasurementModal from "@/components/Modal";
import PaymentModal from "@/components/Modal";
import PaymentForm from "@/components/PaymentForm";
import OrderNotes from "@/components/OrderNotes";
import NewMeasurementHistory from "@/components/NewMeasurementHistory";

import Svg from "@/components/Svg";
import MenuSvg from "@/Assets/Svg/MenuSvg";
import HeaderEdit from "@/components/HeaderEdit";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";
import BlackLogo from "@/components/BlackLogo";
import CheckSvg from "@/Assets/Svg/CheckSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import InputSvg from "@/Assets/Svg/InputSvg";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  const errorRef = useRef();
  const [subTotal, setSubTotal] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [balance, setBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);

  const [isSelected, setIsSelected] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [rows, setRows] = useState([]);

  const [customer, setCustomer] = useState();
  const [order, setOrder] = useState();
  const [clothingTypeOptions, setClothingTypeOptions] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  const [orderDetails, setOrderDetails] = useState([]);
  const [showMeasurementModalOpen, setShowMeasurementModalOpen] =
    useState(false);
  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);
  const [downPaymentModalOpen, setDownPaymentModalOpen] = useState(false);
  const [showInputMeasurements, setShowInputMeasurements] = useState(false);
  const [measurementHistoryId, setMeasurementHistoryId] = useState(null);
  const [measurementHistories, setMeasurementHistories] = useState(null);
  const [orderDetailIndex, setOrderDetailIndex] = useState(null);
  const [showDetail, setShowDetail] = useState([]);
  const [measurements, setMeasurements] = useState(null);

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1e293b",
      borderColor: "#475569",
      color: "#f8fafc",
      minHeight: "2rem",
      height: "2rem",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#f8fafc",
    }),
    input: (base) => ({
      ...base,
      color: "#f8fafc",
    }),
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

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  const handleMeasurementHistoryId = (e, detailIndex) => {
    setMeasurementHistoryId(e.target.value);
    const updateOrderDetails = [...orderDetails];
    updateOrderDetails[detailIndex].measurement_history_id = e.target.value;
    setOrderDetails(updateOrderDetails);
  };

  const handleBtnMeasurement = (
    clothingTypeId,
    customerData,
    orderDetailIndex,
  ) => {
    if (customerData == null) {
      alert("Silahkan pilih pelanggan terlebih dahulu..!!");
    } else {
      const clothingTypeindex = clothingTypes.findIndex(
        (type) => type.hashed_id === clothingTypeId,
      );
      const formattedMeasurements = clothingTypes[
        clothingTypeindex
      ].measurement_details.map((item) => ({
        name: item.measurement,
        value: 0,
      }));

      formattedMeasurements.push({ name: "", value: 0 });

      if (orderDetails[orderDetailIndex].measurement_history_id) {
        setMeasurements(orderDetails[orderDetailIndex].measurements);
      } else {
        setMeasurements(formattedMeasurements);
      }
      setOrderDetailIndex(orderDetailIndex);
      const customerId = customerData.hashed_id;
      const fetchData = async () => {
        try {
          const response = await api.get("/api/getbycustomerandclothing", {
            params: { customerId, clothingTypeId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (measurementHistories != response.data.measurement_histories) {
            setMeasurementHistories(response.data.measurement_histories);
          }
        } catch (err) {
          if (!err?.response) {
            setError("No Server Response..!!");
          } else if (err.response?.status === 401) {
            setError("Unauthorized..!!");
          } else {
            setError(err.response.data.message);
            console.log(err.response.data.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      setMeasurementModalOpen(true);
    }
  };

  const handleSelectMaterialChange = (selectedOption, index) => {
    rows[index].material_number = selectedOption.number;
    orderDetails[index].material_id = selectedOption.value;
    setOrder((prevOrder) => ({
      ...prevOrder,
      material_id: selectedOption.value,
    }));
  };

  const handleSelectTypeChange = (selectedOption, index) => {
    let rowIndex = index;
    const exists = rows.some((row) => row.value === selectedOption.value);
    const updatedRows = [...rows];
    if (exists) {
      const getIndex = rows.findIndex(
        (row) => row.value === selectedOption.value,
      );
      rowIndex = getIndex;
    } else {
      updatedRows[rowIndex].value = selectedOption.value;
      updatedRows[rowIndex].material_number = rows[index].material_number;
      updatedRows[rowIndex].clothing_type = selectedOption.type;
      updatedRows[rowIndex].qty = rows[index].qty;
      updatedRows[rowIndex].price = rows[index].price;
      updatedRows[rowIndex].total = rows[index].total;
    }
    setRows(updatedRows);
    setSelectedRowId(rowIndex);
    setIsSelected(true);

    if (rowIndex === rows.length - 1 && selectedOption) {
      const newOrderDetail = {
        clothing_type_id: selectedOption.value,
        measurement_history_id: null,
        material_id: null,
        quantity: 0,
        measurements: null,
        price: 0,
        fabric_consumed_meter: 0,
        notes: null,
      };
      setOrderDetails([...orderDetails, newOrderDetail]);
      setRows([
        ...updatedRows,
        {
          value: null,
          material_number: null,
          clothing_type: null,
          measurements: [],
          qty: 0,
          price: 0,
          total: 0,
        },
      ]);
    } else {
      const newOrderDetails = [...orderDetails];
      const newOrderDetail = {
        clothing_type_id: selectedOption.value,
        material_id: orderDetails[rowIndex].material_id,
        measurements: orderDetails[rowIndex].measurements,
        quantity: orderDetails[rowIndex].quantity,
        price: orderDetails[rowIndex].price,
        fabric_consumed_meter: 0,
      };
      newOrderDetails[rowIndex] = newOrderDetail;
      setOrderDetails(newOrderDetails);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handlePriceChange = (e, index) => {
    const newRows = [...rows];
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].price = Number(e.target.value);
    newRows[index].price = Number(e.target.value);
    newRows[index].total = newRows[index].price * newRows[index].qty;
    setRows(newRows);
    setOrderDetails(newOrderDetails);
    const getSubTotal = newRows.reduce(
      (acc, current) => acc + Number(current.total),
      0,
    );
    setSubTotal(getSubTotal);
    setBalance(getSubTotal - downPayment);
    setOrder((prevOrder) => ({
      ...prevOrder,
      total: getSubTotal,
    }));
  };

  const handleQtyChange = (e, index) => {
    const newRows = [...rows];
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].quantity = Number(e.target.value);
    newRows[index].qty = Number(e.target.value);
    newRows[index].total = newRows[index].price * newRows[index].qty;
    setRows(newRows);
    setOrderDetails(newOrderDetails);
    const getSubTotal = newRows.reduce(
      (acc, current) => acc + Number(current.total),
      0,
    );
    setSubTotal(getSubTotal);
    setBalance(getSubTotal - downPayment);
    setOrder((prevOrder) => ({
      ...prevOrder,
      total: getSubTotal,
    }));
  };

  const handleDepositChange = (e) => {
    setDownPayment(e.target.value);
    setBalance(Number(subTotal) - Number(e.target.value));
    setOrder((prevOrder) => ({
      ...prevOrder,
      amount_paid: e.target.value,
    }));
  };

  const removeRow = (indexToRemove) => {
    const updatedRows = rows.filter((_, index) => index !== indexToRemove);
    const updatedOrderDetails = orderDetails.filter(
      (_, index) => index !== indexToRemove,
    );
    setOrderDetails(updatedOrderDetails);
    setRows(updatedRows);
    const getSubTotal = updatedRows.reduce(
      (acc, current) => acc + Number(current.total),
      0,
    );
    setSubTotal(getSubTotal);
    setBalance(getSubTotal - downPayment);
    setOrder((prevOrder) => ({
      ...prevOrder,
      total: getSubTotal,
    }));
  };

  const handleBtnShowMeasurement = (orderDetailIndex) => {
    setOrderDetailIndex(orderDetailIndex);
    setShowMeasurementModalOpen(true);
  };

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "mulipart/form-data",
    };
    const requestOrder = api.get("/api/orders/" + id, {
      headers,
    });
    const requestMaterials = api.get("/api/materials", {
      headers,
    });
    const requestClothingTypes = api.get("/api/clothing-types", {
      headers,
    });

    const fetchMultipleData = async () => {
      try {
        setLoading(true);
        const [responseOrder, responseMaterials, responseClothingTypes] =
          await Promise.all([
            requestOrder,
            requestMaterials,
            requestClothingTypes,
          ]);

        const formattedClothingTypeOptions =
          responseClothingTypes.data.data.map((item) => ({
            value: item.hashed_id,
            label: item.type,
          }));

        const formattedMaterialOptions = responseMaterials.data.data.map(
          (item) => ({
            value: item.hashed_id,
            label: item.code + " | " + item.name,
            number: item.code,
          }),
        );

        setRows([]);
        responseOrder.data.order.order_details.map((item) => {
          const newFormatedRow = {
            value: item.clothing_type.hashed_id,
            material_number: item.material.code,
            clothing_type: item.clothing_type.type,
            measurements: JSON.parse(item.measurements),
            qty: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          };
          setRows((prevRows) => [...prevRows, newFormatedRow]);
        });
        const newFormatedRow = {
          value: null,
          material_number: null,
          clothing_type: null,
          measurements: null,
          qty: null,
          price: null,
          total: null,
        };
        setRows((prevRows) => [...prevRows, newFormatedRow]);
        const getDownPayment = responseOrder.data.order.payments.find(
          (downPayment) => downPayment.payment_status == "down_payment",
        );
        const getAmountPaid = getDownPayment ? getDownPayment.amount_paid : 0;
        setOrderDetails(responseOrder.data.order.order_details);
        setClothingTypeOptions(formattedClothingTypeOptions);
        setClothingTypes(responseClothingTypes.data.data);
        setMaterialOptions(formattedMaterialOptions);
        setCustomer(responseOrder.data.order.customer);
        setOrder(responseOrder.data.order);
        setSubTotal(responseOrder.data.order.total);
        setDownPayment(getAmountPaid);
        setBalance(responseOrder.data.order.total - getAmountPaid);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMultipleData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");
    const orderData = new FormData();
    orderData.append("user_id", user.hashed_id);
    orderData.append("customer_id", order.customer_id);
    orderData.append("order_date", order.order_date);
    orderData.append("fitting_date", order.fitting_date);
    orderData.append("due_date", order.due_date);
    orderData.append("tax", order.tax);
    orderData.append("total", order.total);
    orderData.append("amount_paid", order.amount_paid);
    orderData.append("payment_method", order.payment_method);
    orderData.append("payment_date", order.payment_date);
    orderData.append("notes", order.notes);
    orderDetails.map((orderDetail, index) => {
      orderData.append(
        `order_details[${index}][clothing_type_id]`,
        orderDetail.clothing_type_id,
      );
      orderData.append(
        `order_details[${index}][measurement_history_id]`,
        orderDetail.measurement_history_id,
      );
      orderData.append(
        `order_details[${index}][material_id]`,
        orderDetail.material_id,
      );
      orderData.append(`order_details[${index}][qty]`, orderDetail.quantity);
      orderData.append(`order_details[${index}][price]`, orderDetail.price);
      orderData.append(`order_details[${index}][notes]`, orderDetail.notes);
    });
    console.log(orderDetails);

    try {
      setProcessing(true);
      const response = await api.post(`/api/orders/${id}/edit`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/orders", {
        state: {
          message: "Edit data pesanan berhasil..!!",
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
        console.log(err.response);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingData />;
  }

  return (
    <>
      <div className="w-300 text-slate-100">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pesanan"
            backUrl="/dashboard/transactions/orders"
            getProcessing={processing}
          />
          <div className="flex-all-center w-full border-2 border-slate-700 bg-slate-800 rounded-3xl h-28 mt-4 shadow-lg">
            <div className="grid grid-cols-3 gap-4 w-full h-full p-4">
              <div className="flex col-span-2 items-center">
                <BlackLogo />
              </div>
              <div>
                <div className="flex-all-center">
                  <span className="border-b-2 border-indigo-500 font-bold text-xl col-span-1 text-indigo-400">
                    NOTA PESANAN
                  </span>
                </div>
                <div className="flex-all-center mt-3">
                  <label className="w-20 text-slate-300 text-sm">
                    NO. NOTA
                  </label>
                  <label className="text-slate-400">:</label>
                  <label className="ml-2 font-bold text-lg text-slate-100">
                    {order.number}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="col-span-2 border border-slate-700 bg-slate-800 rounded-xl p-3 text-slate-200">
              <div className="flex items-center">
                <label className="w-40 text-slate-300">Nama Pelanggan</label>
                <label className="text-slate-400">:</label>
                <label className="ml-2 font-semibold text-sm w-100 text-slate-100">
                  {customer ? customer.name : "-"}
                </label>
              </div>
              <div className="flex items-start mt-2">
                <label className="w-40 text-slate-300">Alamat</label>
                <label className="text-slate-400">:</label>
                <label className="ml-2 font-semibold text-sm w-100 h-14 text-slate-100">
                  {customer ? customer.address : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40 text-slate-300">No. Handphone</label>
                <label className="text-slate-400">:</label>
                <label className="ml-2 font-semibold text-sm text-slate-100">
                  {customer ? customer.phone : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40 text-slate-300">Email</label>
                <label className="text-slate-400">:</label>
                <label className="ml-2 font-semibold text-sm text-slate-100">
                  {customer ? customer.email : "-"}
                </label>
              </div>
            </div>
            <div className="border border-slate-700 bg-slate-800 rounded-xl p-3 text-slate-200 col-span-1">
              <div className="flex items-center">
                <label className="w-28 text-slate-300">Tgl. Pesan</label>
                <label className="text-slate-400">:</label>
                <label className="font-semibold ml-2 text-indigo-400">
                  {FormattedDateLong(order.order_date)}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-28 text-slate-300">Tgl. Fitting</label>
                <label className="text-slate-400">:</label>
                <input
                  defaultValue={order.fitting_date}
                  name="fitting_date"
                  onChange={handleChange}
                  className="ml-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500"
                  type="date"
                />
              </div>
              <div className="flex items-center mt-2">
                <label className="w-28 text-slate-300">Tgl. Selesai</label>
                <label className="text-slate-400">:</label>
                <input
                  defaultValue={order.due_date}
                  name="due_date"
                  onChange={handleChange}
                  className="ml-2 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-100 focus:outline-none focus:border-indigo-500"
                  type="date"
                />
              </div>
            </div>
          </div>
          <div className="flex-all-center border-b border-slate-700 w-full mt-4"></div>
          <div className="flex-all-center w-full mt-2">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="h-10 bg-slate-800 text-slate-300 border-b border-slate-700 text-xs uppercase tracking-wider">
                  <th className="th-center w-10">No.</th>
                  <th className="th-center">Jenis Pesanan</th>
                  <th className="th-center w-36">Ukuran</th>
                  <th className="th-center w-72">No. Kain</th>
                  <th className="th-center w-16">Qty</th>
                  <th className="th-center w-36">Harga</th>
                  <th className="th-center w-40">Total</th>
                  <th className="th-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.map((row, index) => (
                  <tr key={index} className="bg-slate-900 text-slate-200">
                    <td className="td-center">{index + 1}</td>
                    <td className="td-left p-1">
                      <Select
                        styles={customSelectStyles}
                        placeholder="Pilih jenis pakaian"
                        value={
                          row.value
                            ? clothingTypeOptions.find(
                                (opt) => opt.label == row.clothing_type,
                              )
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectTypeChange(selectedOption, index)
                        }
                        options={clothingTypeOptions}
                        required={rows.length === 1}
                      />
                    </td>
                    <td className="td-center">
                      {row.value && orderDetails[index].measurements ? (
                        <div className="flex-all-center w-full">
                          <button
                            type="button"
                            className={
                              "flex-all-center bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg cursor-pointer transition"
                            }
                            onClick={() => handleBtnShowMeasurement(index)}
                          >
                            <span className="mx-1 text-xs">Lihat Ukuran</span>
                            <Svg title="Menu" c={"w-4 fill-current mx-1"}>
                              <CheckSvg />
                            </Svg>
                          </button>
                        </div>
                      ) : (
                        row.value && (
                          <div className="flex-all-center w-full">
                            <button
                              type="button"
                              className={
                                "flex-all-center bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg cursor-pointer transition"
                              }
                              onClick={() =>
                                handleBtnMeasurement(row.value, customer, index)
                              }
                            >
                              <span className="mx-1 text-xs">Input Ukuran</span>
                              <Svg title="Menu" c={"w-4 fill-current mx-1"}>
                                <InputSvg />
                              </Svg>
                            </button>
                          </div>
                        )
                      )}
                    </td>
                    <td className="td-left p-1">
                      {row.value && (
                        <Select
                          styles={customSelectStyles}
                          value={
                            row.value
                              ? materialOptions.find(
                                  (opt) => opt.number == row.material_number,
                                )
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleSelectMaterialChange(selectedOption, index)
                          }
                          options={materialOptions}
                          required={row.value}
                        />
                      )}
                    </td>
                    <td className="td-center">
                      <div className="flex w-full justify-center">
                        <input
                          className="w-14 text-center bg-slate-800 border border-slate-700 rounded-md text-slate-100 py-1 focus:outline-none focus:border-indigo-500 text-xs"
                          type="number"
                          min={1}
                          defaultValue={row.qty ? row.qty : ""}
                          onChange={(event) => handleQtyChange(event, index)}
                          disabled={row.value ? false : true}
                          hidden={row.value ? false : true}
                          required={row.value}
                        />
                      </div>
                    </td>
                    <td className="td-center">
                      <div className="flex w-full justify-center">
                        <input
                          className="px-2 w-32 text-right spinner-disabled bg-slate-800 border border-slate-700 rounded-md text-slate-100 py-1 focus:outline-none focus:border-indigo-500 text-xs"
                          type="number"
                          min={0}
                          defaultValue={row.total ? Number(row.total) : ""}
                          onChange={(event) => handlePriceChange(event, index)}
                          disabled={row.value ? false : true}
                          hidden={row.value ? false : true}
                          required={row.value}
                        />
                      </div>
                    </td>
                    <td className="td-right">
                      <div
                        className={
                          row.value
                            ? "flex w-full text-slate-100 text-xs"
                            : "hidden w-full"
                        }
                      >
                        <label className="w-3">Rp.</label>
                        <label className="w-32 ml-2 text-right font-medium">
                          {Number(row.total).toLocaleString()}
                        </label>
                      </div>
                    </td>
                    <td className="td-center">
                      <div className="flex-all-center">
                        {rows.length > 1 && row.value !== null && (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="flex-all-center p-1.5 rounded-lg text-white bg-rose-600 hover:bg-rose-500 transition cursor-pointer"
                          >
                            <Svg title="Delete" c={"w-4 fill-current"}>
                              <DeleteSvg />
                            </Svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="h-10 border-t border-slate-700">
                  <td
                    className="td-center align-top text-xs p-2"
                    colSpan={5}
                    rowSpan={3}
                  >
                    <OrderNotes />
                  </td>
                  <td className="td-right text-xs font-semibold text-slate-300">
                    Total
                  </td>
                  <td className="td-right text-xs font-semibold text-slate-100">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-32 ml-2 text-right">
                        {Number(subTotal).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center bg-slate-800"></td>
                </tr>
                <tr className="h-10">
                  <td className="td-right text-xs font-semibold text-slate-300">
                    Uang Muka
                  </td>
                  <td className="td-right text-xs font-semibold text-slate-100">
                    <div className="flex w-full">
                      <label className="w-5 flex">Rp.</label>
                      <input
                        className="flex ml-2 px-1 w-full text-right spinner-disabled bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                        title="Input uang muka"
                        type="number"
                        value={Number(downPayment)}
                        min={0}
                        onClick={() => {
                          setDownPaymentModalOpen(true);
                        }}
                      />
                    </div>
                  </td>
                  <td className="td-center bg-slate-800"></td>
                </tr>
                <tr className="h-10">
                  <td className="td-right text-xs font-semibold text-slate-300">
                    Sisa
                  </td>
                  <td className="td-right text-xs font-semibold text-indigo-400">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-32 ml-2 text-right font-bold">
                        {Number(balance).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center bg-slate-800"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div>

      <ShowMeasurementModal
        title={"Detail Ukuran"}
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
                <label className="w-44 text-slate-400">Jenis Pakaian</label>
                <label className="text-slate-500">:</label>
                <label className="ml-2 font-medium text-slate-100">
                  {rows[orderDetailIndex]?.clothing_type}
                </label>
              </div>
              <div className="mt-4">
                <div className="flex items-center border-b border-slate-700 p-2 w-96 font-semibold text-indigo-400">
                  <label className="w-44">Bagian yang di ukur</label>
                </div>
                {JSON.parse(orderDetails[orderDetailIndex].measurements).map(
                  (measurement, index) => {
                    return (
                      measurement.name != "" && (
                        <div
                          key={index}
                          className="flex items-center border-b border-slate-700/60 p-2 w-96 hover:bg-slate-700/40 text-slate-300"
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
                      )
                    );
                  },
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowMeasurementModalOpen(false);
                }}
                className="flex-all-center bg-rose-600 hover:bg-rose-500 text-white font-medium px-3 py-1.5 rounded-lg cursor-pointer transition shadow"
              >
                <Svg title="Close" c={"w-5 fill-current"}>
                  <DeleteSvg />
                </Svg>
                <span className="ml-1">Close</span>
              </button>
            </div>
          </div>
        )}
      </ShowMeasurementModal>

      <MeasurementModal
        title={"Silahkan Masukkan Ukuran Baru atau Pilih ukuran lama"}
        isOpen={measurementModalOpen}
        onClose={() => setMeasurementModalOpen(false)}
      >
        <div className="flex items-center text-slate-200">
          <input
            name="measurmentOptions"
            value={"choose"}
            type="radio"
            defaultChecked="true"
            onClick={() => setShowInputMeasurements(false)}
            className="accent-indigo-500"
          />
          <span className="flex ml-2">Pilih ukuran lama</span>
          <input
            className="ml-4 accent-indigo-500"
            name="measurmentOptions"
            value={"input"}
            type="radio"
            onClick={() => setShowInputMeasurements(true)}
          />
          <span className="flex ml-2">Masukkan ukuran baru</span>
        </div>
        {!showInputMeasurements ? (
          <>
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
                  {measurementHistories &&
                    measurementHistories.map((measurement, index) => {
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
                            {measurement.clothing_type.type}
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
                                      (itemDetail, indexDetail) => {
                                        return (
                                          itemDetail.name != "" && (
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
                                          )
                                        );
                                      },
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
                              <label className="ml-1 text-slate-200">
                                Pilih
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {!measurementHistories ||
                (measurementHistories.length == 0 && (
                  <div className="w-full flex-all-center text-rose-400 p-3 bg-slate-800 text-sm">
                    Belum ada ukuran untuk pelanggan dan jenis pakaian yang
                    dipilih...!! silahkan input data pengukuran terlebih dahulu.
                  </div>
                ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  if (measurements == null) {
                    alert("Silahkan pilih ukuran terlebih dahulu..!!");
                  } else {
                    setMeasurementModalOpen(false);
                  }
                }}
                className="flex-all-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition shadow"
              >
                <Svg title="Close" c={"w-5 fill-current"}>
                  <CheckSvg />
                </Svg>
                <span className="ml-1">Submit</span>
              </button>
            </div>
          </>
        ) : (
          <NewMeasurementHistory
            measurements={measurements}
            setOrderDetails={setOrderDetails}
            orderDetails={orderDetails}
            setMeasurements={setMeasurements}
            customer={customer}
            indexOrderDetail={orderDetailIndex}
            clothingTypeId={orderDetails[orderDetailIndex]?.clothing_type_id}
            clothingType={rows[orderDetailIndex]?.clothing_type}
            today={today}
            setMeasurementModalOpen={setMeasurementModalOpen}
          ></NewMeasurementHistory>
        )}
      </MeasurementModal>

      <PaymentModal
        title={"Input Pembayaran"}
        isOpen={downPaymentModalOpen}
        onClose={() => setDownPaymentModalOpen(false)}
      >
        <PaymentForm data={order} action={handleChange} />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => {
              setDownPaymentModalOpen(false);
              setOrder((prevData) => ({
                ...prevData,
                ["amount_paid"]: 0,
                ["payment_method"]: "",
                ["payment_notes"]: "",
              }));
            }}
            className="flex-all-center bg-rose-600 hover:bg-rose-500 text-white font-medium px-3 py-1.5 rounded-lg mx-1 cursor-pointer transition shadow"
          >
            <Svg title="Cancel" c={"w-5 fill-current mx-1"}>
              <DeleteSvg />
            </Svg>
            <span className="mx-1">Cancel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDownPaymentModalOpen(false);
              setDownPayment(order.amount_paid);
              setBalance(Number(subTotal) - Number(order.amount_paid));
            }}
            className="flex-all-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg cursor-pointer transition shadow"
          >
            <Svg title="Close" c={"w-5 fill-current"}>
              <CheckSvg />
            </Svg>
            <span className="ml-1">Submit</span>
          </button>
        </div>
      </PaymentModal>
    </>
  );
}
