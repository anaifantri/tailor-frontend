import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";
import { INITIAL_ORDER_DETAIL } from "../components/constants";

export function useOrderForm() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  // Refs
  const errorRef = useRef();
  const customerRef = useRef(null);
  const materialRef = useRef(null);
  const serviceRef = useRef(null);
  const qtyRef = useRef(null);
  const priceRef = useRef(null);
  const numberRef = useRef(null);
  const fittingDateRef = useRef(null);
  const dueDateRef = useRef(null);
  const amountPaidRef = useRef(null);

  // States Kalkulasi
  const [subTotal, setSubTotal] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [balance, setBalance] = useState(0);
  const [discount, setDiscount] = useState(0);

  // States Transaksi & Pengukuran
  const [orderDetails, setOrderDetails] = useState([
    { ...INITIAL_ORDER_DETAIL },
  ]);
  const [measurements, setMeasurements] = useState(null);
  const [measurementsLength, setMeasurementsLength] = useState(null);
  const [measurementHistories, setMeasurementHistories] = useState(null);
  const [orderDetailIndex, setOrderDetailIndex] = useState(null);

  // States Data Master Options
  const [customerOptions, setCustomerOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Status Aplikasi
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Form Data Utama
  const [formData, setFormData] = useState({
    customer_ulid: "",
    user_ulid: user.ulid,
    number: "",
    order_date: today,
    fitting_date: "",
    due_date: "",
    subtotal: 0,
    discount: 0,
    tax: 0,
    grand_total: 0,
    amount_paid: 0,
    payment_method: "",
    payment_notes: "",
    payment_date: today,
  });

  // Ambil Data Awal
  useEffect(() => {
    customerRef.current?.focus();

    const fetchMultipleData = async () => {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
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
            unit: `${item.unit}`,
          })),
        );
      } catch (err) {
        setError(err.response?.data?.message || "Terjadi kesalahan sistem.");
      } finally {
        setLoading(false);
      }
    };
    fetchMultipleData();
  }, [token]);

  // Fokus Otomatis ketika Baris Terpilih
  useEffect(() => {
    if (isSelected && qtyRef.current) {
      qtyRef.current.focus();
      qtyRef.current.value = null;
    }
    setIsSelected(false);
  }, [isSelected]);

  // Handler Umum Perubahan Form Utama
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "amount_paid") {
      setBalance(subTotal - value - discount);
      setFormData((prev) => ({
        ...prev,
        grand_total: subTotal - value - discount,
      }));
    }
    if (name === "fitting_date") fittingDateRef.current?.focus();
    else if (name === "due_date") serviceRef.current?.focus();
  };

  const updateCalculations = (details) => {
    const calculatedSubTotal = details.reduce(
      (acc, current) => acc + Number(current.total || 0),
      0,
    );

    if (calculatedSubTotal == 0) {
      setSubTotal(0);
      setDiscount(0);
      setBalance(0);
      setDownPayment(0);
      setFormData((prev) => ({
        ...prev,
        subtotal: 0,
        discount: 0,
        amount_paid: 0,
        payment_method: "",
        grand_total: 0,
      }));
    } else {
      setSubTotal(calculatedSubTotal);
      setBalance(calculatedSubTotal - downPayment - discount);
      setFormData((prev) => ({
        ...prev,
        subtotal: calculatedSubTotal,
        grand_total: calculatedSubTotal - downPayment - discount,
      }));
    }
  };

  const handlePriceChange = (e, index) => {
    const value = Number(e.target.value);
    const newDetails = [...orderDetails];
    newDetails[index].price = value;
    newDetails[index].total = value * (newDetails[index].quantity || 0);
    setOrderDetails(newDetails);
    updateCalculations(newDetails);
  };

  const handleQtyChange = (e, index) => {
    const value = Number(e.target.value);
    const newDetails = [...orderDetails];
    newDetails[index].quantity = value;
    newDetails[index].total = (newDetails[index].price || 0) * value;
    setOrderDetails(newDetails);
    updateCalculations(newDetails);
  };

  const handleDiscountChange = (e) => {
    const value = Number(e.target.value || 0);
    setDiscount(value);
    setBalance(Number(subTotal) - Number(downPayment) - value);
    setFormData((prev) => ({
      ...prev,
      discount: value,
      grand_total: Number(subTotal) - Number(downPayment) - value,
    }));
  };

  const removeRow = (indexToRemove) => {
    const updatedDetails = orderDetails.filter(
      (_, index) => index !== indexToRemove,
    );
    setOrderDetails(updatedDetails);
    updateCalculations(updatedDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    console.log(formData);
    console.log(orderDetails);

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
      if (orderDetail.service_ulid != "" && orderDetail.service_ulid != null) {
        order.append(
          `order_details[${index}][service_id]`,
          orderDetail.service_ulid,
        );
        order.append(
          `order_details[${index}][measurements]`,
          JSON.stringify(orderDetail.measurements),
        );
        order.append(
          `order_details[${index}][material_id]`,
          orderDetail.material_ulid,
        );
        if (orderDetail.category == "tailoring") {
          if (orderDetail.material_ulid != null) {
            order.append(
              `order_details[${index}][item_type]`,
              "service_with_material",
            );
          } else {
            order.append(`order_details[${index}][item_type]`, "service_only");
          }
        } else if (orderDetail.category == "material_sale") {
          order.append(`order_details[${index}][item_type]`, "material_only");
        } else {
          order.append(`order_details[${index}][item_type]`, "other");
        }
        order.append(`order_details[${index}][quantity]`, orderDetail.quantity);
        order.append(`order_details[${index}][price]`, orderDetail.price);
        order.append(`order_details[${index}][unit]`, orderDetail.unit);
        order.append(`order_details[${index}][total]`, orderDetail.total);
        order.append(
          `order_details[${index}][fabric_consumed_meter]`,
          orderDetail.fabric_consumed_meter,
        );
        order.append(`order_details[${index}][notes]`, orderDetail.notes);
      }
    });

    // try {
    //   setProcessing(true);
    //   await api.post("/api/orders", order, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   navigate("/dashboard/transactions/orders", {
    //     state: { message: "Penambahan data pesanan berhasil..!!" },
    //   });
    // } catch (err) {
    //   if (err.response?.status === 401) setErrorMessage("Unauthorized..!!");
    //   else setGetErrors(err.response?.data?.errors || {});
    // } finally {
    //   setProcessing(false);
    // }
  };

  return {
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
    refs: {
      errorRef,
      customerRef,
      materialRef,
      serviceRef,
      qtyRef,
      priceRef,
      numberRef,
      fittingDateRef,
      dueDateRef,
      amountPaidRef,
    },
  };
}
