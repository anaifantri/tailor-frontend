import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";

import api from "@/apiService";
import LoadingData from "@/Components/LoadingData";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import FormattedDateShort from "@/Utils/FormattedDateShort";
import MeasurementModal from "@/components/Modal";
import CustomerModal from "@/components/Modal";
import ShowMeasurementModal from "@/components/Modal";
import PaymentModal from "@/components/Modal";
import OrderNotes from "@/components/OrderNotes";
import PaymentForm from "@/components/PaymentForm";
import CustomerForm from "@/components/CustomerForm";
import NewMeasurementHistory from "@/components/NewMeasurementHistory";

import Svg from "@/components/Svg";
import BtnPay from "@/components/BtnPay";
import EditSvg from "@/Assets/Svg/EditSvg";
import HeaderCreate from "@/components/HeaderCreate";
import BlackLogo from "@/components/BlackLogo";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";
import CheckSvg from "@/Assets/Svg/CheckSvg";
import ShowSvg from "@/Assets/Svg/ShowSvg";
import ReloadSvg from "@/Assets/Svg/ReloadSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import AddSvg from "@/assets/Svg/AddSvg";

export default function Create() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  const errorRef = useRef();
  const customerRef = useRef(null);
  const materialRef = useRef(null);
  const clothingTypeRef = useRef(null);
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

  const basicMeasurements = [
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
  const [measurementsLength, setMeasurementsLength] = useState(null);
  const [rows, setRows] = useState([
    {
      value: null,
      material_number: null,
      clothing_type: null,
      code: null,
      category: null,
      qty: null,
      price: null,
      total: null,
    },
  ]);
  const [findBaju, setFindBaju] = useState([]);
  const [findCelana, setFindCelana] = useState([]);
  const [findRok, setFindRok] = useState([]);

  const [newCustomer, setNewCustomer] = useState({
    code: "",
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [customer, setCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [clothingTypeOptions, setClothingTypeOptions] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  const [orderDetails, setOrderDetails] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    number: "",
    order_date: today,
    fitting_date: "",
    due_date: "",
    discount: 0,
    tax: 0,
    total: 0,
    amount_paid: 0,
    payment_method: "",
    payment_notes: "",
    payment_date: today,
  });

  const handleCustomerChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setNewCustomer((prevNewCustomer) => ({
      ...prevNewCustomer,
      [name]: value,
    }));
  };

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  const handleMeasurementHistory = (measurementDetails, detailIndex) => {
    setMeasurements(measurementDetails);
    const updateOrderDetails = [...orderDetails];
    updateOrderDetails[detailIndex].measurements = measurementDetails;
    setOrderDetails(updateOrderDetails);
  };

  const handleSelectCustomerChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      customer_id: selectedOption.value,
    }));
    const newCustomerOption = {
      value: selectedOption.value,
      label: selectedOption.name,
      hashed_id: selectedOption.value,
      code: selectedOption.code,
      name: selectedOption.name,
      address: selectedOption.address,
      phone: selectedOption.phone,
      email: selectedOption.email,
    };
    setCustomer({
      hashed_id: selectedOption.value,
      code: selectedOption.code,
      name: selectedOption.name,
      address: selectedOption.address,
      phone: selectedOption.phone,
      email: selectedOption.email,
    });
    setSelectedCustomer(newCustomerOption);
    if (fittingDateRef.current) {
      fittingDateRef.current.focus();
    }
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

      const getBasicMeasurements = basicMeasurements.find(
        (measurement) =>
          measurement.name === clothingTypes[clothingTypeindex].category,
      );
      const formattedMeasurements = getBasicMeasurements?.measurements.map(
        (item) => ({
          name: item,
          value: "",
        }),
      );

      formattedMeasurements.push({ name: "", value: 0 });

      if (orderDetails[orderDetailIndex].measurement_history_id) {
        setMeasurements(orderDetails[orderDetailIndex].measurements);
        setMeasurementsLength(
          orderDetails[orderDetailIndex].measurements.length - 1,
        );
      } else {
        setMeasurements(formattedMeasurements);
        setMeasurementsLength(formattedMeasurements.length - 1);
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

  const handleBtnShowMeasurement = (orderDetailIndex) => {
    setOrderDetailIndex(orderDetailIndex);
    setShowMeasurementModalOpen(true);
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
      updatedRows[rowIndex].clothing_type = selectedOption.label;
      updatedRows[rowIndex].category = selectedOption.category;
      updatedRows[rowIndex].code = selectedOption.code;
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
        measurements: null,
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
          category: null,
          code: null,
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
    } else if (name == "amount_paid") {
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

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
    setBalance(Number(subTotal) - Number(downPayment) - Number(e.target.value));
    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: e.target.value,
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
    if (customerRef.current) {
      customerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setFindBaju([]);
    setFindCelana([]);
    setFindRok([]);
    const isBajuExist = rows.some((row) => row.category === "baju");
    const isCelanaExist = rows.some((row) => row.category === "celana");
    const isRokExist = rows.some((row) => row.category === "rok");
    if (isBajuExist) {
      const getBaju = basicMeasurements.find((opt) => opt.name === "baju");
      setFindBaju(getBaju.measurements);
    }
    if (isCelanaExist) {
      const getCelana = basicMeasurements.find((opt) => opt.name === "celana");
      setFindCelana(getCelana.measurements);
    }
    if (isRokExist) {
      const getRok = basicMeasurements.find((opt) => opt.name === "rok");
      setFindRok(getRok.measurements);
    }
  }, [rows]);

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
    const requestCustomers = api.get("/api/customers", {
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
        const [responseCustomers, responseMaterials, responseClothingTypes] =
          await Promise.all([
            requestCustomers,
            requestMaterials,
            requestClothingTypes,
          ]);

        const formattedcustomerOptions = responseCustomers.data.data.map(
          (item) => ({
            value: item.hashed_id,
            label: item.name,
            code: item.code,
            name: item.name,
            address: item.address,
            phone: item.phone,
            email: item.email,
          }),
        );

        const formattedClothingTypeOptions =
          responseClothingTypes.data.data.map((item) => ({
            value: item.hashed_id,
            label: item.type,
            category: item.category,
            code: item.code,
          }));

        const formattedMaterialOptions = responseMaterials.data.data.map(
          (item) => ({
            value: item.hashed_id,
            label: item.code + " | " + item.name,
          }),
        );
        setClothingTypes(responseClothingTypes.data.data);
        setCustomerOptions(formattedcustomerOptions);
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

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const dataCustomer = new FormData();
    dataCustomer.append("code", newCustomer.code);
    dataCustomer.append("name", newCustomer.name);
    dataCustomer.append("email", newCustomer.email);
    dataCustomer.append("phone", newCustomer.phone);
    dataCustomer.append("address", newCustomer.address);

    try {
      setProcessing(true);
      const response = await api.post("/api/customers", dataCustomer, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      const newCustomerOption = {
        value: response.data.customer.hashed_id,
        label: response.data.customer.name,
        code: response.data.customer.code,
        name: response.data.customer.name,
        address: response.data.customer.address,
        phone: response.data.customer.phone,
        email: response.data.customer.email,
      };
      const newCustomer = {
        hashed_id: response.data.customer.hashed_id,
        code: response.data.customer.code,
        name: response.data.customer.name,
        address: response.data.customer.address,
        phone: response.data.customer.phone,
        email: response.data.customer.email,
      };
      setCustomerOptions((customerOptions) => [
        newCustomerOption,
        ...customerOptions,
      ]);
      setSelectedCustomer(newCustomerOption);
      setCustomer(newCustomer);
      alert(response.data.message);
      setCustomerModalOpen(false);
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
      }
    } finally {
      setProcessing(false);
    }
  };

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
    orderDetails.map((orderDetail, index) => {
      order.append(
        `order_details[${index}][clothing_type_id]`,
        orderDetail.clothing_type_id,
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
      const response = await api.post("/api/orders", order, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/transactions/orders", {
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
                <div className="flex-all-center mt-4">
                  <label className="w-24">NOMOR NOTA</label>
                  <label>:</label>
                  <input
                    type="text"
                    name="number"
                    onChange={handleChange}
                    className="ml-2 w-60 px-2 py-1 font-semibold text-lg text-center"
                    placeholder="Masukkan nomor nota"
                    required
                  />
                </div>
                {getErrors?.number && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors?.number}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="col-span-2 border border-stone-900 rounded-lg p-2">
              <div className="flex items-center">
                <label className="w-40">Nama Pelanggan</label>
                <label>:</label>
                <Select
                  classNames={{
                    control: () =>
                      "!h-8 !min-h-8 bg-white border border-gray-300 rounded-md ml-2",
                    valueContainer: () => "!h-8 flex items-center",
                    indicatorsContainer: () => "!h-8",
                  }}
                  placeholder="Pilih nama pelanggan"
                  value={selectedCustomer}
                  onChange={(selectedOption) =>
                    handleSelectCustomerChange(selectedOption)
                  }
                  options={customerOptions}
                  ref={customerRef}
                  required
                />
                <button
                  onClick={() => setCustomerModalOpen(true)}
                  type="button"
                  className="flex-all-center button-primary ml-4 cursor-pointer"
                >
                  <Svg title="Add" c={"w-6 fill-current"}>
                    <AddSvg />
                  </Svg>
                  <span className="mx-1">Pelanggan Baru</span>
                </button>
              </div>
              {getErrors?.customer_id && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.customer_id}
                </span>
              )}
              <div className="flex items-start mt-2">
                <label className="w-40">Alamat</label>
                <label>:</label>
                <label className="ml-4 font-semibold  w-100 h-12">
                  {customer ? customer.address : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40">No. Handphone</label>
                <label>:</label>
                <label className="ml-4 font-semibold ">
                  {customer ? customer.phone : "-"}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-40">Email</label>
                <label>:</label>
                <label className="ml-4 font-semibold ">
                  {customer ? customer.email : "-"}
                </label>
              </div>
            </div>
            <div className="border border-stone-900 rounded-xl p-2 texl-lg col-span-1">
              <div className="flex items-center">
                <label className="w-28">Tgl. Pesan</label>
                <label>:</label>
                <label className="font-semibold ml-2">
                  {FormattedDateLong(today)}
                </label>
              </div>
              {getErrors?.order_date && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.order_date}
                </span>
              )}
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
              {getErrors?.fitting_date && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.fitting_date}
                </span>
              )}
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
              {getErrors?.due_date && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.due_date}
                </span>
              )}
            </div>
          </div>
          <div className="flex-all-center border-b-2 w-full mt-2"></div>
          <div className="flex-all-center w-full mt-1">
            <table className="table-auto w-full">
              <thead>
                <tr className="h-10 bg-stone-200">
                  <th className="th-center w-10">No.</th>
                  <th className="th-center w-60">Jenis Pesanan</th>
                  <th className="th-center w-20">Ukuran</th>
                  <th className="th-center w-96">Nomor Kain | Jenis Kain</th>
                  <th className="th-center w-16">Qty</th>
                  <th className="th-center w-36">Harga</th>
                  <th className="th-center w-40">Total</th>
                  <th className="th-center w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="bg-white">
                    <td className="td-center">{index + 1}</td>
                    <td className="td-center">
                      <Select
                        classNames={{
                          control: () =>
                            "!h-8 !min-h-8 bg-white border border-gray-300 rounded-md text-left",
                          valueContainer: () => "!h-8 flex items-center",
                          indicatorsContainer: () => "!h-8",
                        }}
                        placeholder="Pilih jenis pesanan"
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
                      {row.value && orderDetails[index].measurements ? (
                        <div className="flex-all-center w-full">
                          <button
                            type="button"
                            title="Lihat ukuran"
                            className={
                              "flex-all-center button-primary cursor-pointer"
                            }
                            onClick={() => handleBtnShowMeasurement(index)}
                          >
                            {/* <span className="mx-1">Lihat Ukuran</span> */}
                            <Svg title="Menu" c={"w-5 fill-current mx-1"}>
                              <ShowSvg />
                            </Svg>
                          </button>
                        </div>
                      ) : (
                        row.value && (
                          <div className="flex-all-center w-full">
                            <button
                              title="Input Ukuran"
                              type="button"
                              className={
                                "flex-all-center button-success cursor-pointer"
                              }
                              onClick={() =>
                                handleBtnMeasurement(row.value, customer, index)
                              }
                            >
                              {/* <span className="mx-1">Input Ukuran</span> */}
                              <Svg title="Menu" c={"w-5 fill-current mx-1"}>
                                <EditSvg />
                              </Svg>
                            </button>
                          </div>
                        )
                      )}
                    </td>
                    <td className="td-center">
                      {row.value && (
                        <Select
                          classNames={{
                            control: () =>
                              "!h-8 !min-h-8 bg-white border border-gray-300 rounded-md text-left",
                            valueContainer: () => "!h-8 flex items-center",
                            indicatorsContainer: () => "!h-8",
                          }}
                          placeholder="Pilih jenis kain"
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
                <tr className="h-8">
                  <td className="td-center align-top " colSpan={5} rowSpan={4}>
                    {/* <div>
                        <label className="flex font-semibold">
                          Keterangan tambahan
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg py-1 px-2"
                          rows={5}
                        ></textarea>
                      </div> */}
                    <OrderNotes />
                  </td>
                  <td className="td-right  font-semibold">Total</td>
                  <td className="td-right  font-semibold">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-32 ml-2 text-right">
                        {Number(subTotal).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center bg-slate-200"></td>
                </tr>
                <tr className="h-8">
                  <td className="td-right  font-semibold">Uang Muka</td>
                  <td className="td-right  font-semibold">
                    {subTotal > 0 && downPayment <= 0 ? (
                      <div className="flex w-full justify-end">
                        <BtnPay action={() => setDownPaymentModalOpen(true)} />
                      </div>
                    ) : (
                      <div className="flex w-full">
                        <label className="w-5 flex">Rp.</label>
                        <input
                          className="flex ml-2 px-1 w-full text-right spinner-disabled text-sm"
                          type="number"
                          readOnly
                          disabled={subTotal <= 0}
                          min={0}
                          value={downPayment}
                          onClick={() => {
                            setDownPaymentModalOpen(true);
                            if (amountPaidRef.current) {
                              amountPaidRef.current.focus();
                            }
                          }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="td-center bg-slate-200"></td>
                </tr>
                <tr className="h-8">
                  <td className="td-right  font-semibold">Diskon</td>
                  <td className="td-right  font-semibold">
                    <div className="flex w-full">
                      <label className="w-5 flex">Rp.</label>
                      <input
                        className="flex ml-2 px-1 w-full text-right spinner-disabled text-sm"
                        type="number"
                        min={0}
                        disabled={subTotal <= 0}
                        defaultValue={discount}
                        onChange={handleDiscountChange}
                      />
                    </div>
                  </td>
                  <td className="td-center bg-slate-200"></td>
                </tr>
                <tr className="h-8">
                  <td className="td-right  font-semibold">Sisa</td>
                  <td className="td-right  font-semibold">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-32 ml-2 text-right">
                        {Number(balance).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center bg-slate-200"></td>
                </tr>
                {/* <tr>
                    <td colSpan={8}>
                      <OrderNotes />
                    </td>
                  </tr> */}
              </tbody>
            </table>
          </div>
          {getErrors?.order_details && (
            <span
              ref={errorRef}
              className={
                getErrors
                  ? "flex w-full text-red-500 text-xs items-center"
                  : "hidden"
              }
            >
              {getErrors?.order_details}
            </span>
          )}
        </form>

        <div className="grid grid-cols-2 gap-2 w-full h-175 mt-4">
          <div className="border border-stone-900 rounded-xl p-2">
            <div className="grid grid-cols-3 gap-4 border-b">
              <div className="col-span-2">
                <div className="flex py-1">
                  <label className="w-32">No. Nota</label>
                  <label>:</label>
                  <label className="ml-2">
                    {formData.number ? formData.number : "-"}
                  </label>
                </div>
                <div className="flex py-1">
                  <label className="w-32">Nama Pelanggan</label>
                  <label>:</label>
                  <label className="ml-2">
                    {customer?.name ? customer?.name : "-"}
                  </label>
                </div>
                <div className="flex py-1">
                  <label className="w-32">No. Hp.</label>
                  <label>:</label>
                  <label className="ml-2">
                    {customer?.phone ? customer?.phone : "-"}
                  </label>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Pesan</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {formData.order_date
                      ? FormattedDateShort(formData.order_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Fitting</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {formData.fitting_date
                      ? FormattedDateShort(formData.fitting_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Selesai</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {formData.due_date
                      ? FormattedDateShort(formData.due_date)
                      : "-"}
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-2 mt-2 h-150">
              <div className="p-1">
                <div className="flex justify-center items-center font-semibold w-full p-1 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                  <label>Gambar dan catatan untuk atasan</label>
                </div>
              </div>
              <div className="p-1">
                <div className="flex justify-center items-center font-semibold w-full p-1 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                  <label>Detail ukuran untuk atasan</label>
                </div>
                {findBaju.length > 0 && (
                  <>
                    <div className="flex">
                      <div>
                        <div className="flex justify-center items-center border w-40 mt-1 font-semibold">
                          Bagian Yang di ukur
                        </div>
                        {findBaju.map((measurement, index) => {
                          return (
                            <div
                              key={index}
                              className="flex items-start border-x border-b px-2 w-40"
                            >
                              <label className="w-6">{index + 1}. </label>
                              <label>{measurement}</label>
                            </div>
                          );
                        })}
                      </div>
                      {rows.map((rowItem, index) => {
                        if (
                          rowItem.value &&
                          rowItem.category == "baju" &&
                          orderDetails[index].measurements
                        ) {
                          return (
                            <div key={index}>
                              <div className="flex justify-center items-center border-y border-r mt-1 font-semibold px-2">
                                {rowItem.code}
                              </div>
                              {orderDetails[index].measurements.map(
                                (measurement, index) => {
                                  if (measurement.name != "") {
                                    return (
                                      <div
                                        key={index}
                                        className="flex items-center justify-center border-r border-b px-2"
                                      >
                                        <label>{measurement.value}</label>
                                      </div>
                                    );
                                  }
                                },
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="border border-stone-900 rounded-xl p-2">
            <div className="grid grid-cols-3 gap-4 border-b">
              <div className="col-span-2">
                <div className="flex py-1">
                  <label className="w-32">No. Nota</label>
                  <label>:</label>
                  <label className="ml-2">
                    {formData.number ? formData.number : "-"}
                  </label>
                </div>
                <div className="flex py-1">
                  <label className="w-32">Nama Pelanggan</label>
                  <label>:</label>
                  <label className="ml-2">
                    {customer?.name ? customer?.name : "-"}
                  </label>
                </div>
                <div className="flex py-1">
                  <label className="w-32">No. Hp.</label>
                  <label>:</label>
                  <label className="ml-2">
                    {customer?.phone ? customer?.phone : "-"}
                  </label>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Pesan</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {formData.order_date
                      ? FormattedDateShort(formData.order_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Fitting</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {formData.fitting_date
                      ? FormattedDateShort(formData.fitting_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Selesai</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {formData.due_date
                      ? FormattedDateShort(formData.due_date)
                      : "-"}
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-2 mt-2 h-150">
              <div className="p-1">
                <div className="flex justify-center items-center font-semibold w-full p-1 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                  <label>Gambar dan catatan untuk bawahan</label>
                </div>
              </div>
              <div className="p-1">
                <div className="flex justify-center items-center font-semibold w-full p-1 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                  <label>Detail ukuran untuk bawahan</label>
                </div>
                <div className="flex">
                  {findCelana.length > 0 && (
                    <>
                      <div className="flex">
                        <div>
                          <div className="flex justify-center items-center border w-40 mt-1 font-semibold">
                            Bagian Yang di ukur
                          </div>
                          {findCelana.map((measurement, index) => {
                            return (
                              <div
                                key={index}
                                className="flex items-start border-x border-b px-2 w-40"
                              >
                                <label className="w-6">{index + 1}. </label>
                                <label>{measurement}</label>
                              </div>
                            );
                          })}
                        </div>
                        {rows.map((rowItem, index) => {
                          if (
                            rowItem.value &&
                            rowItem.category == "celana" &&
                            orderDetails[index].measurements
                          ) {
                            return (
                              <div key={index}>
                                <div className="flex justify-center items-center border-y border-r mt-1 font-semibold px-2">
                                  {rowItem.code}
                                </div>
                                {orderDetails[index].measurements.map(
                                  (measurement, index) => {
                                    if (measurement.name != "") {
                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center justify-center border-r border-b px-2"
                                        >
                                          <label>{measurement.value}</label>
                                        </div>
                                      );
                                    }
                                  },
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </>
                  )}
                  {findRok.length > 0 && (
                    <>
                      <div className="flex ml-10">
                        <div>
                          <div className="flex justify-center items-center border w-40 mt-1 font-semibold">
                            Bagian Yang di ukur
                          </div>
                          {findRok.map((measurement, index) => {
                            return (
                              <div
                                key={index}
                                className="flex items-start border-x border-b px-2 w-40"
                              >
                                <label className="w-6">{index + 1}. </label>
                                <label>{measurement}</label>
                              </div>
                            );
                          })}
                        </div>
                        {rows.map((rowItem, index) => {
                          if (
                            rowItem.value &&
                            rowItem.category == "rok" &&
                            orderDetails[index].measurements
                          ) {
                            return (
                              <div key={index}>
                                <div className="flex justify-center items-center border-y border-r mt-1 font-semibold px-2">
                                  {rowItem.code}
                                </div>
                                {orderDetails[index].measurements.map(
                                  (measurement, index) => {
                                    if (measurement.name != "") {
                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center justify-center border-r border-b px-2"
                                        >
                                          <label>{measurement.value}</label>
                                        </div>
                                      );
                                    }
                                  },
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            measurementsLength={measurementsLength}
            setOrderDetails={setOrderDetails}
            orderDetails={orderDetails}
            setMeasurements={setMeasurements}
            customer={customer}
            indexOrderDetail={orderDetailIndex}
            clothingTypeId={orderDetails[orderDetailIndex]?.clothing_type_id}
            clothingType={rows[orderDetailIndex]?.clothing_type}
            category={rows[orderDetailIndex]?.category}
            today={today}
            setMeasurementModalOpen={setMeasurementModalOpen}
          ></NewMeasurementHistory>
        )}
      </MeasurementModal>

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
                <label className="w-44">Katagori Pakaian</label>
                <label>:</label>
                <label className="ml-2">
                  {rows[orderDetailIndex]?.category == "baju"
                    ? "Baju / Atasan"
                    : rows[orderDetailIndex]?.category}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-44">Jenis Pakaian</label>
                <label>:</label>
                <label className="ml-2">
                  {rows[orderDetailIndex]?.clothing_type}
                </label>
              </div>
              <div className="divide-y divide-gray-200 mt-4">
                <div className="flex justify-center items-center rounded-md bg-stone-200 p-1 w-96">
                  <label className="flex">Detail ukuran</label>
                </div>
                {orderDetails[orderDetailIndex].measurements.map(
                  (measurement, index) => {
                    return (
                      measurement.name != "" && (
                        <div
                          key={index}
                          className="flex items-center p-1 w-96 hover:bg-stone-100"
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
              <button
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
              </button>
            </div>
          </div>
        )}
      </ShowMeasurementModal>

      <CustomerModal
        title={"Tambah Customer Baru"}
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      >
        <CustomerForm
          actionForm={handleCustomerSubmit}
          actionChange={handleCustomerChange}
          getErrors={getErrors}
          processing={processing}
        />
      </CustomerModal>

      <PaymentModal
        title={"Input Pembayaran"}
        isOpen={downPaymentModalOpen}
        onClose={() => setDownPaymentModalOpen(false)}
      >
        <PaymentForm data={formData} action={handleChange} />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              setDownPaymentModalOpen(false);
              setFormData((prevData) => ({
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
              setDownPayment(formData.amount_paid);
              setBalance(Number(subTotal) - Number(formData.amount_paid));
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
