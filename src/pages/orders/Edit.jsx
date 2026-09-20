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
      <div className="w-300">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pesanan"
            backUrl="/dashboard/transactions/orders"
            getProcessing={processing}
          />
          <div className="flex-all-center w-full border-3 border-stone-900 rounded-4xl h-28 mt-4">
            <div className="grid grid-cols-3 gap-4 w-full h-full p-4">
              <div className="flex col-span-2">
                <BlackLogo />
              </div>
              <div>
                <div className="flex-all-center">
                  <span className="border-b-2 border-stone-900 font-bold text-xl col-span-1">
                    NOTA PESANAN
                  </span>
                </div>
                <div className="flex-all-center">
                  <label className="w-20">NO. NOTA</label>
                  <label>:</label>
                  <label className="ml-2 font-bold text-lg">
                    {order.number}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="col-span-2 border border-stone-900 rounded-lg p-2">
              <div className="flex items-center">
                <label className="w-40">Nama Pelanggan</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-sm w-100">
                  {customer ? customer.name : "-"}
                </label>
              </div>
              <div className="flex items-start mt-2">
                <label className="w-40">Alamat</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-sm w-100 h-14">
                  {customer ? customer.address : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40">No. Handphone</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-sm">
                  {customer ? customer.phone : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40">Email</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-sm">
                  {customer ? customer.email : "-"}
                </label>
              </div>
            </div>
            <div className="border border-stone-900 rounded-xl p-2 texl-lg col-span-1">
              <div className="flex items-center">
                <label className="w-28">Tgl. Pesan</label>
                <label>:</label>
                <label className="font-semibold ml-2 text-teal-900">
                  {FormattedDateLong(order.order_date)}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-28">Tgl. Fitting</label>
                <label>:</label>
                <input
                  defaultValue={order.fitting_date}
                  name="fitting_date"
                  onChange={handleChange}
                  className="ml-2 outline-none px-2"
                  type="date"
                />
              </div>
              <div className="flex items-center mt-2">
                <label className="w-28">Tgl. Selesai</label>
                <label>:</label>
                <input
                  defaultValue={order.due_date}
                  name="due_date"
                  onChange={handleChange}
                  className="ml-2 outline-none px-2"
                  type="date"
                />
              </div>
            </div>
          </div>
          <div className="flex-all-center border-b-2 w-full mt-2"></div>
          <div className="flex-all-center w-full mt-1">
            <table className="table-auto w-full">
              <thead>
                <tr className="h-10 bg-stone-200">
                  <th className="th-center text-xs w-10">No.</th>
                  <th className="th-center text-sm">Jenis Pesanan</th>
                  <th className="th-center text-sm w-36">Ukuran</th>
                  <th className="th-center text-sm w-72">No. Kain</th>
                  <th className="th-center text-sm w-16">Qty</th>
                  <th className="th-center text-sm w-36">Harga</th>
                  <th className="th-center text-sm w-40">Total</th>
                  <th className="th-center text-sm w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="bg-white">
                    <td className="td-center">{index + 1}</td>
                    <td className="td-left">
                      <Select
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
                              "flex-all-center button-primary cursor-pointer"
                            }
                            onClick={() => handleBtnShowMeasurement(index)}
                          >
                            <span className="mx-1">Lihat Ukuran</span>
                            <Svg title="Menu" c={"w-5 fill-current mx-1"}>
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
                                "flex-all-center button-success cursor-pointer"
                              }
                              onClick={() =>
                                handleBtnMeasurement(row.value, customer, index)
                              }
                            >
                              <span className="mx-1">Input Ukuran</span>
                              <Svg title="Menu" c={"w-5 fill-current mx-1"}>
                                <InputSvg />
                              </Svg>
                            </button>
                          </div>
                        )
                      )}
                    </td>
                    <td className="td-left">
                      {row.value && (
                        <Select
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
                          // isDisabled={row.value ? false : true}
                        />
                      )}
                    </td>
                    <td className="td-center">
                      <div className="flex w-full justify-center">
                        <input
                          className="w-14 text-center"
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
                          className="px-2 w-32 text-right spinner-disabled"
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
                        className={row.value ? "flex w-full" : "hidden w-full"}
                      >
                        <label className="w-3">Rp.</label>
                        <label className="w-32 ml-2 text-right">
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
                            className="flex-all-center p-1 m-1 rounded-md text-white bg-red-700 hover:bg-red-500 cursor-pointer"
                          >
                            <Svg title="Delete" c={"w-5 fill-current"}>
                              <DeleteSvg />
                            </Svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="h-10">
                  <td
                    className="td-center align-top text-sm"
                    colSpan={5}
                    rowSpan={3}
                  >
                    <OrderNotes />
                  </td>
                  <td className="td-right text-sm font-semibold">Total</td>
                  <td className="td-right text-sm font-semibold">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-32 ml-2 text-right">
                        {Number(subTotal).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center bg-slate-200"></td>
                </tr>
                <tr className="h-10">
                  <td className="td-right text-sm font-semibold">Uang Muka</td>
                  <td className="td-right text-sm font-semibold">
                    <div className="flex w-full">
                      <label className="w-5 flex">Rp.</label>
                      <input
                        className="flex ml-2 px-1 w-full text-right spinner-disabled"
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
                  <td className="td-center bg-slate-200"></td>
                </tr>
                <tr className="h-10">
                  <td className="td-right text-sm font-semibold">Sisa</td>
                  <td className="td-right text-sm font-semibold">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-32 ml-2 text-right">
                        {Number(balance).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center bg-slate-200"></td>
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
            <div className="p-4 border border-gray-200 shadow-lg rounded-xl w-full mt-4">
              <div className="flex items-center">
                <label className="w-44">Nama Pelanggan</label>
                <label>:</label>
                <label className="ml-2">{customer?.name}</label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-44">Jenis Pakaian</label>
                <label>:</label>
                <label className="ml-2">
                  {rows[orderDetailIndex]?.clothing_type}
                </label>
              </div>
              <div className="mt-4">
                <div className="flex items-center border-b p-1 w-96">
                  <label className="w-44">Bagian yang di ukur</label>
                </div>
                {JSON.parse(orderDetails[orderDetailIndex].measurements).map(
                  (measurement, index) => {
                    return (
                      measurement.name != "" && (
                        <div
                          key={index}
                          className="flex items-center border-b p-1 w-96"
                        >
                          <label className="w-6">{index + 1}. </label>
                          <label className="w-56">{measurement.name}</label>
                          <label className="ml-4">{measurement.value}</label>
                          <label className="flex w-6 ml-2">cm</label>
                        </div>
                      )
                    );
                  },
                )}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowMeasurementModalOpen(false);
                }}
                className="flex-all-center button-danger px-2 cursor-pointer"
              >
                <Svg title="Close" c={"w-5 fill-current"}>
                  <DeleteSvg />
                </Svg>
                <span className="ml-1">Close</span>
              </button>
              {/* <button
                type="button"
                onClick={() => {
                  setMeasurementModalOpen(true);
                  setShowMeasurementModalOpen(false);
                }}
                className="flex-all-center button-success px-2 cursor-pointer ml-2"
              >
                <Svg title="Close" c={"w-5 fill-current"}>
                  <ReloadSvg />
                </Svg>
                <span className="ml-1">Rubah Ukuran</span>
              </button> */}
            </div>
          </div>
        )}
      </ShowMeasurementModal>

      <MeasurementModal
        title={"Silahkan Masukkan Ukuran Baru atau Pilih ukuran lama"}
        isOpen={measurementModalOpen}
        onClose={() => setMeasurementModalOpen(false)}
      >
        <div className="flex items-center">
          <input
            name="measurmentOptions"
            value={"choose"}
            type="radio"
            defaultChecked="true"
            onClick={() => setShowInputMeasurements(false)}
          />
          <span className="flex ml-2">Pilih ukuran lama</span>
          <input
            className="ml-4"
            name="measurmentOptions"
            value={"input"}
            type="radio"
            onClick={() => setShowInputMeasurements(true)}
          />
          <span className="flex ml-2">Masukkan ukuran baru</span>
        </div>
        {!showInputMeasurements ? (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4">
              <table className="table-auto w-full divide-y divide-gray-200 bg-white text-left  text-gray-500">
                <thead className="bg-gray-100 font-semibold text-gray-700  text-sm">
                  <tr>
                    <th className="px-6 py-3 text-center">No.</th>
                    <th className="px-6 py-3 text-center">Jenis Pakaian</th>
                    <th className="px-6 py-3 text-center">Tanggal Ukur</th>
                    <th className="px-6 py-3 text-center">Diukur Oleh</th>
                    <th className="px-6 py-3">Detail Ukuran</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {measurementHistories &&
                    measurementHistories.map((measurement, index) => {
                      const isShow = showDetail.includes(index);
                      const measurementDetails = JSON.parse(
                        measurement.measurement_details,
                      );
                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors text-sm"
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
                                  <div className="w-full border-b py-1">
                                    Detail Ukuran
                                  </div>
                                  <div className="mt-2">
                                    {measurementDetails.map(
                                      (itemDetail, indexDetail) => {
                                        return (
                                          itemDetail.name != "" && (
                                            <div
                                              key={indexDetail}
                                              className="flex items-start"
                                            >
                                              <label className="w-6">
                                                {indexDetail + 1}.{" "}
                                              </label>
                                              <label className="w-36">
                                                {itemDetail.name}
                                              </label>
                                              <label>=</label>
                                              <label className="ml-2">
                                                {itemDetail.value}
                                              </label>
                                              <label className="flex w-6 ml-2">
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
                                <div className="w-72">
                                  Tampilkan Detail Ukuran
                                </div>
                              )}

                              <button
                                type="button"
                                className="flex justify-center items-center w-4 mx-auto hover:text-stone-900 cursor-pointer"
                                onClick={() => handleBtnDetail(index)}
                              >
                                <Svg
                                  title="Arrow"
                                  c={
                                    isShow
                                      ? "nav-svg w-5 fill-current rotate-180"
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
                                value={measurement.hashed_id}
                                onClick={() =>
                                  handleMeasurementHistory(
                                    measurementDetails,
                                    orderDetailIndex,
                                  )
                                }
                              />
                              <label className="ml-1">Pilih</label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {!measurementHistories ||
                (measurementHistories.length == 0 && (
                  <div className="w-full flex-all-center text-red-700 p-2">
                    Belum ada ukuran untuk pelanggan dan jenis pakaian yang
                    dipilih...!! silahkan input data pengukuran terlebih dahulu.
                  </div>
                ))}
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  if (measurements == null) {
                    alert("Silahkan pilih ukuran terlebih dahulu..!!");
                  } else {
                    setMeasurementModalOpen(false);
                  }
                }}
                className="flex-all-center button-success px-2 cursor-pointer"
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
        <div className="flex justify-end gap-2 mt-2">
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
            className="flex-all-center button-danger mx-1 cursor-pointer"
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
            className="flex-all-center button-success px-2 cursor-pointer"
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
