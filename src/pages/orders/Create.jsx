import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";

import api from "@/apiService";
import LoadingData from "@/Components/LoadingData";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import MeasurementModal from "@/components/Modal";

import Svg from "@/components/Svg";
import MenuSvg from "@/Assets/Svg/MenuSvg";
import HeaderCreate from "@/components/HeaderCreate";
import BlackLogo from "@/components/BlackLogo";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";
import CheckSvg from "@/Assets/Svg/CheckSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";

export default function Create() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  const errorRef = useRef();
  const clientRef = useRef(null);
  const materialRef = useRef(null);
  const clothingTypeRef = useRef(null);
  const qtyRef = useRef(null);
  const priceRef = useRef(null);
  const fittingDateRef = useRef(null);
  const dueDateRef = useRef(null);

  const [subTotal, setSubTotal] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [balance, setBalance] = useState(0);
  const [showDetail, setShowDetail] = useState([]);
  const [measurementHistories, setMeasurementHistories] = useState(null);
  const [orderDetailIndex, setOrderDetailIndex] = useState(null);
  const [showMeasurementModalOpen, setShowMeasurementModalOpen] =
    useState(false);
  const [measurementHistoryId, setMeasurementHistoryId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);

  const [isSelected, setIsSelected] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [rows, setRows] = useState([
    {
      value: null,
      material_number: null,
      clothing_type: null,
      qty: null,
      price: null,
      total: null,
    },
  ]);

  const [client, setClient] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);
  const [clothingTypeOptions, setClothingTypeOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  const [orderDetails, setOrderDetails] = useState([]);

  const [formData, setFormData] = useState({
    client_id: "",
    order_date: today,
    fitting_date: "",
    due_date: "",
    tax: 0,
    total: 0,
    amount_paid: 0,
    payment_method: "",
    payment_date: today,
    notes: "",
  });

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  const handleMeasurementHistoryId = (measurementHistoryId, detailIndex) => {
    setMeasurementHistoryId(measurementHistoryId);
    const updateOrderDetails = [...orderDetails];
    updateOrderDetails[detailIndex].measurement_history_id =
      measurementHistoryId;
    setOrderDetails(updateOrderDetails);
  };

  const handleSelectClientChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      client_id: selectedOption.value,
    }));
    setClient({
      hashed_id: selectedOption.value,
      code: selectedOption.code,
      name: selectedOption.name,
      address: selectedOption.address,
      phone: selectedOption.phone,
      email: selectedOption.email,
    });
    if (fittingDateRef.current) {
      fittingDateRef.current.focus();
    }
  };

  const handleBtnMeasurement = (
    clothingTypeId,
    clientData,
    orderDetailIndex,
  ) => {
    if (clientData == null) {
      alert("Silahkan pilih pelanggan terlebih dahulu..!!");
    } else {
      setOrderDetailIndex(orderDetailIndex);
      setMeasurementHistoryId(
        orderDetails[orderDetailIndex].measurement_history_id,
      );
      const clientId = clientData.hashed_id;
      const fetchData = async () => {
        try {
          const response = await api.get("/api/getbyclientandclothing", {
            params: { clientId, clothingTypeId },
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
      setShowMeasurementModalOpen(true);
    }
  };

  const handleSelectMaterialChange = (selectedOption, index) => {
    rows[index].material_id = selectedOption.value;
    orderDetails[index].material_id = selectedOption.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      material_id: selectedOption.value,
    }));
    if (qtyRef.current) {
      qtyRef.current.focus();
    }
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
        material_id: null,
        measurement_history_id: null,
        qty: 0,
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
        measurement_history_id: orderDetails[rowIndex].measurement_history_id,
        qty: orderDetails[rowIndex].qty,
        price: orderDetails[rowIndex].price,
        fabric_consumed_meter: 0,
      };
      newOrderDetails[rowIndex] = newOrderDetail;
      setOrderDetails(newOrderDetails);
    }
    if (materialRef.current) {
      materialRef.current.focus();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "fitting_date") {
      if (dueDateRef.current) {
        dueDateRef.current.focus();
      }
    } else if (name == "due_date") {
      if (clothingTypeRef.current) {
        clothingTypeRef.current.focus();
      }
    }
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      total: getSubTotal,
    }));
  };

  const handleQtyChange = (e, index) => {
    const newRows = [...rows];
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].qty = Number(e.target.value);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      total: getSubTotal,
    }));
  };

  const handleDepositChange = (e) => {
    setDownPayment(e.target.value);
    setBalance(Number(subTotal) - Number(e.target.value));
    setFormData((prevFormData) => ({
      ...prevFormData,
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      total: getSubTotal,
    }));
  };

  useEffect(() => {
    if (clientRef.current) {
      clientRef.current.focus();
    }
  }, []);

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
    const requestClients = api.get("/api/clients", {
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
        const [responseClients, responseMaterials, responseClothingTypes] =
          await Promise.all([
            requestClients,
            requestMaterials,
            requestClothingTypes,
          ]);

        const formattedClientOptions = responseClients.data.map((item) => ({
          value: item.hashed_id,
          label: item.name,
          code: item.code,
          name: item.name,
          address: item.address,
          phone: item.phone,
          email: item.email,
        }));

        const formattedClothingTypeOptions = responseClothingTypes.data.map(
          (item) => ({
            value: item.hashed_id,
            label: item.type,
          }),
        );

        const formattedMaterialOptions = responseMaterials.data.map((item) => ({
          value: item.hashed_id,
          label: item.code + " | " + item.name,
        }));
        setClientOptions(formattedClientOptions);
        setClothingTypeOptions(formattedClothingTypeOptions);
        setMaterialOptions(formattedMaterialOptions);
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
    const order = new FormData();
    order.append("user_id", user.hashed_id);
    order.append("client_id", formData.client_id);
    order.append("order_date", formData.order_date);
    order.append("fitting_date", formData.fitting_date);
    order.append("due_date", formData.due_date);
    order.append("tax", formData.tax);
    order.append("total", formData.total);
    order.append("amount_paid", formData.amount_paid);
    order.append("payment_method", formData.payment_method);
    order.append("payment_date", formData.payment_date);
    order.append("notes", formData.notes);
    orderDetails.map((orderDetail, index) => {
      order.append(
        `order_details[${index}][clothing_type_id]`,
        orderDetail.clothing_type_id,
      );
      order.append(
        `order_details[${index}][measurement_history_id]`,
        orderDetail.measurement_history_id,
      );
      order.append(
        `order_details[${index}][material_id]`,
        orderDetail.material_id,
      );
      order.append(`order_details[${index}][qty]`, orderDetail.qty);
      order.append(`order_details[${index}][price]`, orderDetail.price);
      order.append(`order_details[${index}][notes]`, orderDetail.notes);
    });

    try {
      setProcessing(true);
      const response = await api.post("/api/orders", order, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/orders", {
        state: {
          message: "Penambahan data pesanan berhasil..!!",
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
          <HeaderCreate
            titleCreate="Data pesanan"
            backUrl="/dashboard/orders"
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
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="col-span-2 border border-stone-900 rounded-lg p-2">
              <div className="flex items-center">
                <label className="w-40">Nama Pelanggan</label>
                <label>:</label>
                <Select
                  className="w-60 ml-2 outline-none"
                  onChange={(selectedOption) =>
                    handleSelectClientChange(selectedOption)
                  }
                  options={clientOptions}
                  ref={clientRef}
                  required
                />
              </div>
              <div className="flex items-start mt-2">
                <label className="w-40">Alamat</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-sm w-100 h-14">
                  {client ? client.address : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40">No. Handphone</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-sm">
                  {client ? client.phone : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40">Email</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-sm">
                  {client ? client.email : "-"}
                </label>
              </div>
            </div>
            <div className="border border-stone-900 rounded-xl p-2 texl-lg col-span-1">
              <div className="flex items-center">
                <label className="w-28">Tgl. Pesan</label>
                <label>:</label>
                <label className="font-semibold ml-2 text-teal-900">
                  {FormattedDateLong(today)}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-28">Tgl. Fitting</label>
                <label>:</label>
                <input
                  ref={fittingDateRef}
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
                  ref={dueDateRef}
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
                  <th className="th-center text-sm w-24">Ukuran</th>
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
                        value={
                          row.value
                            ? clothingTypeOptions.find(
                                (opt) => opt.value === row.value,
                              )
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectTypeChange(selectedOption, index)
                        }
                        options={clothingTypeOptions}
                        required={rows.length === 1}
                        ref={clothingTypeRef}
                      />
                    </td>
                    <td className="td-center">
                      {row.value &&
                      orderDetails[index].measurement_history_id ? (
                        <div className="flex-all-center w-full">
                          <button
                            type="button"
                            className={
                              "flex-all-center text-green-700 cursor-pointer"
                            }
                            onClick={() =>
                              handleBtnMeasurement(row.value, client, index)
                            }
                          >
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
                                handleBtnMeasurement(row.value, client, index)
                              }
                            >
                              <span className="mx-1">Pilih</span>
                              <Svg title="Menu" c={"w-5 fill-current mx-1"}>
                                <MenuSvg />
                              </Svg>
                            </button>
                          </div>
                        )
                      )}
                    </td>
                    <td className="td-left">
                      {row.value && (
                        <Select
                          onChange={(selectedOption) =>
                            handleSelectMaterialChange(selectedOption, index)
                          }
                          ref={materialRef}
                          options={materialOptions}
                          required={row.value}
                          isDisabled={row.value ? false : true}
                        />
                      )}
                    </td>
                    <td className="td-center">
                      <div className="flex w-full justify-center">
                        <input
                          ref={selectedRowId === index ? qtyRef : null}
                          className="w-14 text-center"
                          type="number"
                          min={1}
                          value={row.qty ? row.qty : ""}
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
                          ref={priceRef}
                          className="px-2 w-32 text-right spinner-disabled"
                          type="number"
                          min={0}
                          value={row.price ? row.price : ""}
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
                    <div>
                      <span className="flex mt-2 font-semibold">Catatan :</span>
                      <div className="flex">
                        <span className="flex w-2">1.</span>
                        <span className="flex text-left ml-2 w-150">
                          Lebih dari 2 bulan barang tidak diambil, segala
                          kehilangan / kerusakan dan lain-lain diluar tanggung
                          jawab kami
                        </span>
                      </div>
                      <div className="flex">
                        <span className="flex w-2">2.</span>
                        <span className="flex ml-2 w-150">
                          Dengan nota tersebut barang bisa diterima
                        </span>
                      </div>
                      <div className="flex">
                        <span className="flex w-2">3.</span>
                        <span className="flex ml-2 w-150">
                          Kehilangan nota pengambilan bukan tanggung jawab kami
                        </span>
                      </div>
                    </div>
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
                        type="number"
                        min={0}
                        onChange={handleDepositChange}
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

      <MeasurementModal
        title={"Pilih Ukuran"}
        isOpen={showMeasurementModalOpen}
        onClose={() => setShowMeasurementModalOpen(false)}
      >
        <div>
          <table className="table-auto mt-2 w-full">
            <thead>
              <tr className="h-10 bg-stone-200">
                <th className="th-center w-10">No.</th>
                <th className="th-center w-32">Jenis Pakaian</th>
                <th className="th-center w-28">Tanggal Ukur</th>
                <th className="th-center w-60">Diukur Oleh</th>
                <th className="th-center w-72">Detail Ukuran</th>
                <th className="th-center w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {measurementHistories &&
                measurementHistories.map((measurement, index) => {
                  const isShow = showDetail.includes(index);
                  const measurementDetails = JSON.parse(
                    measurement.measurement_details,
                  );
                  return (
                    <tr className="bg-white" key={index}>
                      <td className="td-center">{index + 1}</td>
                      <td className="td-center">
                        {measurement.clothing_type.type}
                      </td>
                      <td className="td-center">{measurement.measured_at}</td>
                      <td className="td-left"></td>
                      <td className="td-left">
                        <div className="flex w-full">
                          {isShow ? (
                            <div className="w-72">
                              <div className="w-full border-b py-1">
                                Detail Ukuran
                              </div>
                              <div className="mt-2">
                                {measurementDetails.map(
                                  (itemDetail, indexDetail) => (
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
                                  ),
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="w-72">Tampilkan Detail Ukuran</div>
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
                      <td className="td-center">
                        <div className="w-full flex-all-center p-1 my-1">
                          <input
                            name="measurement_history_id"
                            type="radio"
                            value={measurement.hashed_id}
                            defaultChecked={
                              measurementHistoryId == measurement.hashed_id
                                ? true
                                : false
                            }
                            onClick={() =>
                              handleMeasurementHistoryId(
                                measurement.hashed_id,
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
              if (measurementHistoryId == null) {
                alert("Silahkan pilih ukuran terlebih dahulu..!!");
              } else {
                setShowMeasurementModalOpen(false);
              }
            }}
            className="flex-all-center button-success mx-1 cursor-pointer"
          >
            <Svg title="Close" c={"w-5 fill-current mx-1"}>
              <CheckSvg />
            </Svg>
            <span className="mx-1">Submit</span>
          </button>
        </div>
      </MeasurementModal>
    </>
  );
}
