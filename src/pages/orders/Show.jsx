import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import FormattedDateShort from "@/Utils/FormattedDateShort";

import HeaderShowAll from "@/components/HeaderShowAll";
import BtnPay from "@/components/BtnPay";
import BtnPdf from "@/components/BtnPdf";
import ShowMeasurementModal from "@/components/Modal";
import PaymentModal from "@/components/Modal";
import ProgressModal from "@/components/Modal";
import ShowProgressModal from "@/components/Modal";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";
import BcaSvg from "@/Assets/Svg/BcaSvg";
import BniSvg from "@/Assets/Svg/BniSvg";
import BriSvg from "@/Assets/Svg/BriSvg";
import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import BlackLogo from "@/components/BlackLogo";
import CheckSvg from "@/assets/Svg/CheckSvg";
import CloseSvg from "@/assets/Svg/CloseSvg";
import ReloadSvg from "@/assets/Svg/ReloadSvg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";
import BtnSave from "@/components/BtnSave";
import ShowSvg from "@/assets/Svg/ShowSvg";

export default function Show() {
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const { user, token } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const message = location.state?.message;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [downPayment, setDownPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [balance, setBalance] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(null);
  const [progressNotes, setProgressNotes] = useState(null);
  const [productionProgress, setProductionProgress] = useState(null);
  const [orderDetailId, setOrderDetailId] = useState(null);
  const [progressDate, setProgressDate] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [showProgressModalOpen, setShowProgressModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [savedStatus, setSavedStatus] = useState(true);
  const [showDetail, setShowDetail] = useState([]);
  const [payment, setPayment] = useState({
    user_id: user.hashed_id,
    order_id: null,
    payment_date: today,
    amount_paid: null,
    payment_method: null,
    payment_status: "full_payment",
    notes: null,
  });

  const [customer, setCustomer] = useState(null);
  const [clothingType, setClothingType] = useState(null);
  const [category, setCategory] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [showMeasurementModalOpen, setShowMeasurementModalOpen] =
    useState(false);

  const rok = ["Panjang Rok", "Lingkar Pinggang", "Lingkar Pinggul"];
  const celana = [
    "Panjang Celana",
    "Lingkar Pinggang",
    "Lingkar Pinggul",
    "Pesak",
    "Paha",
    "Lutut",
    "Kaki",
  ];
  const baju = [
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
  ];

  const progress = [
    "Antrian",
    "Potong",
    "Jahit",
    "Fitting",
    "Selesai",
    "Pengambilan",
  ];

  const handleShowMeasurements = (clothingType, category, measurements) => {
    setClothingType(clothingType);
    setCategory(category);
    setMeasurements(JSON.parse(measurements));
    setShowMeasurementModalOpen(true);
  };

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
    if (name == "amount_paid") {
      if (value >= balance) {
        setPayment((prevPayment) => ({
          ...prevPayment,
          ["payment_status"]: "full_payment",
        }));
      } else {
        setPayment((prevPayment) => ({
          ...prevPayment,
          ["payment_status"]: "partial_payment",
        }));
      }
    }
  };

  const handleProgressDateChange = (e) => {
    const { value } = e.target;
    setProgressDate(value);
  };

  const handleProgressNotesChange = (e) => {
    const { value } = e.target;
    setProgressNotes(value);
  };

  const handleProgressModal = (status, detailId) => {
    setProgressModalOpen(true);
    setUpdateProgress(status);
    setOrderDetailId(detailId);
  };

  const handleShowProgressModal = (progressId) => {
    setShowProgressModalOpen(true);
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await api.get(
          "/api/production-progress/" + progressId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProductionProgress(response.data.production_progress);
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
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const progressData = new FormData();
    progressData.append("order_detail_id", orderDetailId);
    progressData.append("progress_date", progressDate);
    progressData.append("status", updateProgress);
    progressData.append("notes", progressNotes);
    try {
      setProcessing(true);
      const response = await api.post(
        "/api/production-progress",
        progressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        },
      );
      setSavedStatus(true);
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setError(err.response.data.message);
        console.log(err.response.data);
      }
    } finally {
      setProcessing(false);
      setProgressModalOpen(false);
    }
  };

  useEffect(() => {
    if (savedStatus) {
      const fetchData = async () => {
        try {
          const response = await api.get("/api/orders/" + id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrder(response.data.order);
          const orderDetails = response.data.order.order_details;
          const formattedMeasurementDetail = orderDetails.map((item) => ({
            category: item.clothing_type.category,
            code: item.clothing_type.code,
            measurements: JSON.parse(item.measurements),
          }));
          setMeasurementDetails(formattedMeasurementDetail);
          setCustomer(response.data.order.customer);
          const payments = response.data.order.payments;
          const getDownPayment = payments.find(
            (payment) => payment.payment_status === "down_payment",
          );
          const getTotalPayment = payments.reduce(
            (acc, curr) => acc + Number(curr.amount_paid),
            0,
          );
          const downPaymentAmount = getDownPayment
            ? Number(getDownPayment.amount_paid)
            : 0;
          const balanceAmount =
            Number(response.data.order.total) - getTotalPayment;
          setDownPayment(downPaymentAmount);
          setTotalPayment(getTotalPayment - downPaymentAmount);
          setBalance(balanceAmount);
          setPayment((prevPayment) => ({
            ...prevPayment,
            ["order_id"]: response.data.order.hashed_id,
            ["amount_paid"]: balanceAmount,
          }));
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
      setSavedStatus(false);
    }
  }, [savedStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (payment.payment_method == null) {
      alert("Silahkan pilih type pembayaran terlebih dahulu..!!");
    } else if (
      payment.amount_paid <= 0 ||
      payment.amount_paid == null ||
      payment.amount_paid == ""
    ) {
      alert("Jumlah pembayaran harus lebih besar dari 0..!!");
    } else if (payment.payment_date == null || payment.payment_date == "") {
      alert("Silahkan input tanggal pembayaran terlebih dahulu..!!");
    } else {
      const paymentData = new FormData();
      paymentData.append("user_id", payment.user_id);
      paymentData.append("order_id", payment.order_id);
      paymentData.append("payment_date", payment.payment_date);
      paymentData.append("payment_method", payment.payment_method);
      paymentData.append("payment_status", payment.payment_status);
      paymentData.append("amount_paid", payment.amount_paid);
      paymentData.append("notes", payment.notes);

      try {
        setProcessing(true);
        const response = await api.post("/api/payments", paymentData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        });
        setSavedStatus(true);
      } catch (err) {
        if (!err?.response) {
          setErrorMessage("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setErrorMessage("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
        }
      } finally {
        setProcessing(false);
        setPaymentModalOpen(false);
      }
    }
  };

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="w-300">
        <HeaderShowAll
          titleShow="Data Pesanan"
          url="/transactions/orders"
          deleteUrl="/orders"
          getId={order.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
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
                <label className="ml-2 font-bold text-lg">{order.number}</label>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="col-span-2 border border-stone-900 rounded-lg p-2">
            <div className="flex items-center">
              <label className="w-40">Nama Pelanggan</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {order.customer.name}
              </label>
            </div>
            <div className="flex items-start mt-2">
              <label className="w-40">Alamat</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm w-100 h-14">
                {order.customer.address}
              </label>
            </div>
            <div className="flex items-center mt-2">
              <label className="w-40">No. Handphone</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {order.customer.phone}
              </label>
            </div>
            <div className="flex items-center mt-2">
              <label className="w-40">Email</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {order.customer.email}
              </label>
            </div>
          </div>
          <div className="border border-stone-900 rounded-xl p-2 texl-lg col-span-1">
            <div className="flex items-center">
              <label className="w-28">Tgl. Pesan</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {FormattedDateLong(order.order_date)}
              </label>
            </div>
            <div className="flex items-center mt-2">
              <label className="w-28">Tgl. Fitting</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {FormattedDateLong(order.fitting_date)}
              </label>
            </div>
            <div className="flex items-center mt-2">
              <label className="w-28">Tgl. Selesai</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {FormattedDateLong(order.due_date)}
              </label>
            </div>
          </div>
        </div>
        <div className="flex-all-center border-b-2 w-full mt-2"></div>
        <div className="flex-all-center w-full mt-1">
          <table className="table-auto w-full">
            <thead>
              <tr className="h-10 bg-stone-200">
                <th className="th-center text-xs w-10">No.</th>
                <th className="th-center text-sm w-28">No. Kain</th>
                <th className="th-center text-sm">Jenis</th>
                <th className="th-center text-sm w-20">Ukuran</th>
                <th className="th-center text-sm w-16">Qty</th>
                <th className="th-center text-sm w-24">price</th>
                <th className="th-center text-sm w-24">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.order_details.map((item, index) => {
                const productionProgress = item.production_progress;
                const isShow = showDetail.includes(index);
                const nextProgress = productionProgress.length;
                return (
                  <tr className="h-8 hover:bg-gray-200" key={index}>
                    <td className="td-center text-sm">{index + 1}</td>
                    <td className="td-center">{item.material.code}</td>
                    <td className="td-left">
                      <div className="flex w-full">
                        {isShow ? (
                          <div className="w-full">
                            <div className="w-full border-b py-1">
                              <span>{item.clothing_type.type}</span>
                            </div>
                            <div className="flex items-start mt-2">
                              <span>Progress :</span>
                              {progress.map((itemProgress, indexProgress) => {
                                const isProgress = productionProgress.filter(
                                  (progress) =>
                                    progress.status.includes(itemProgress),
                                );
                                return (
                                  <div
                                    key={indexProgress}
                                    className="flex items-start"
                                  >
                                    {isProgress.length > 0 &&
                                      indexProgress != nextProgress && (
                                        <div>
                                          <button
                                            className="flex-all-center w-full cursor-pointer text-green-500 hover:text-green-700"
                                            onClick={() =>
                                              handleShowProgressModal(
                                                isProgress[0].hashed_id,
                                              )
                                            }
                                          >
                                            <Svg
                                              title="Check"
                                              c={"w-5 fill-current mx-1"}
                                            >
                                              <CheckSvg />
                                            </Svg>
                                          </button>
                                          <div className="flex-all-center">
                                            {itemProgress}
                                          </div>
                                        </div>
                                      )}
                                    {isProgress.length == 0 &&
                                      indexProgress != nextProgress && (
                                        <div>
                                          <div className="flex-all-center">
                                            <Svg
                                              title="Uncheck"
                                              c={"w-5 fill-red-500 mx-1"}
                                            >
                                              <CloseSvg />
                                            </Svg>
                                          </div>
                                          <div className="flex-all-center">
                                            {itemProgress}
                                          </div>
                                        </div>
                                      )}
                                    {indexProgress == nextProgress && (
                                      <div>
                                        <div className="flex-all-center">
                                          <button
                                            onClick={() =>
                                              handleProgressModal(
                                                itemProgress,
                                                item.hashed_id,
                                              )
                                            }
                                            title="Update Progres"
                                            className="flex-all-center text-teal-500 cursor-pointer hover:text-teal-700"
                                          >
                                            <Svg
                                              title="Update"
                                              c={"w-5 fill-current mx-1"}
                                            >
                                              <ReloadSvg />
                                            </Svg>
                                          </button>
                                        </div>
                                        <div className="flex-all-center">
                                          {itemProgress}
                                        </div>
                                      </div>
                                    )}
                                    {indexProgress != progress.length - 1 && (
                                      <div className="border-b-2 border-stone-900 w-10 h-3"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full">
                            <span>{item.clothing_type.type}</span>
                          </div>
                        )}

                        <button
                          className="flex justify-center items-center w-9 mx-auto hover:text-stone-900 cursor-pointer"
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
                      <div className="w-full flex-all-center">
                        <button
                          onClick={() =>
                            handleShowMeasurements(
                              item.clothing_type.type,
                              item.clothing_type.category,
                              item.measurements,
                            )
                          }
                          title="Lihat ukuran"
                          className="flex-all-center p-1 m-1 rounded-md bg-teal-700 text-white hover:bg-teal-500 cursor-pointer"
                        >
                          <Svg title="Show" c={"w-5 fill-current"}>
                            <ShowSvg />
                          </Svg>
                        </button>
                      </div>
                    </td>
                    <td className="td-center">{item.quantity}</td>
                    <td className="td-right">
                      <div className="flex w-full">
                        <label className="w-3">Rp.</label>
                        <label className="w-full ml-2 text-right">
                          {Number(item.price).toLocaleString()}
                        </label>
                      </div>
                    </td>
                    <td className="td-right">
                      <div className="flex w-full">
                        <label className="w-3">Rp.</label>
                        <label className="w-full ml-2 text-right">
                          {Number(item.price * item.quantity).toLocaleString()}
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr className="h-10">
                <td
                  className="td-center align-top text-sm"
                  colSpan={5}
                  rowSpan={5}
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
                    <label className="w-full ml-2 text-right">
                      {Number(order.total).toLocaleString()}
                    </label>
                  </div>
                </td>
              </tr>
              <tr className="h-10">
                <td className="td-right text-sm font-semibold">Uang Muka</td>
                <td className="td-right text-sm font-semibold">
                  <div className="flex w-full">
                    <label className="w-3">Rp.</label>
                    <label className="w-full ml-2 text-right">
                      {Number(downPayment).toLocaleString()}
                    </label>
                  </div>
                </td>
              </tr>
              <tr className="h-10">
                <td className="td-right text-sm font-semibold">
                  {balance <= 0 ? "Pelunasan" : "Pembayaran"}
                </td>
                <td className="td-right text-sm font-semibold">
                  <div className="flex w-full">
                    <label className="w-3">Rp.</label>
                    <label className="w-full ml-2 text-right">
                      {Number(totalPayment).toLocaleString()}
                    </label>
                  </div>
                </td>
              </tr>
              <tr className="h-10">
                <td className="td-right text-sm font-semibold">
                  <div className="flex w-full justify-end">
                    {/* {balance > 0 && (
                      <BtnPay action={() => setPaymentModalOpen(true)} />
                    )} */}
                    <span className="ml-2">Sisa</span>
                  </div>
                </td>
                <td className="td-right text-sm font-semibold">
                  <div className="flex w-full">
                    {balance <= 0 ? (
                      <div className="flex justify-center w-full">LUNAS</div>
                    ) : (
                      <div className="flex w-full">
                        <label className="w-3">Rp.</label>
                        <label className="w-full ml-2 text-right">
                          {Number(balance).toLocaleString()}
                        </label>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full h-175 mt-4">
          <div className="border border-stone-900 rounded-xl p-2">
            <div className="grid grid-cols-3 gap-4 border-b">
              <div className="col-span-2">
                <div className="flex py-1">
                  <label className="w-32">No. Nota</label>
                  <label>:</label>
                  <label className="ml-2">
                    {order.number ? order.number : "-"}
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
                    {order.order_date
                      ? FormattedDateShort(order.order_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Fitting</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {order.fitting_date
                      ? FormattedDateShort(order.fitting_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Selesai</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {order.due_date ? FormattedDateShort(order.due_date) : "-"}
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
                {measurementDetails.some(
                  (detail) => detail.category === "baju",
                ) && (
                  <>
                    <div className="flex">
                      <div>
                        <div className="flex justify-center items-center border w-40 mt-1 font-semibold">
                          BAJU / ATASAN
                        </div>
                        {baju.map((measurement, index) => {
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
                      {measurementDetails.map((item, index) => {
                        if (item.category == "baju") {
                          return (
                            <div key={index}>
                              <div className="flex justify-center items-center border-y border-r mt-1 font-semibold px-2">
                                {item.code}
                              </div>
                              {item.measurements.map((measurement, index) => {
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
                              })}
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
                    {order.number ? order.number : "-"}
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
                    {order.order_date
                      ? FormattedDateShort(order.order_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Fitting</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {order.fitting_date
                      ? FormattedDateShort(order.fitting_date)
                      : "-"}
                  </label>
                </div>
                <div className="flex py-1 justify-end">
                  <label className="w-24">Tgl. Selesai</label>
                  <label>:</label>
                  <label className="ml-2 w-24">
                    {order.due_date ? FormattedDateShort(order.due_date) : "-"}
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
                {/* <div className="flex"> */}
                {measurementDetails.some(
                  (detail) => detail.category === "celana",
                ) && (
                  <>
                    <div className="flex">
                      <div>
                        <div className="flex justify-center items-center border w-40 mt-1 font-semibold">
                          CELANA
                        </div>
                        {celana.map((measurement, index) => {
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
                      {measurementDetails.map((item, index) => {
                        if (item.category == "celana") {
                          return (
                            <div key={index}>
                              <div className="flex justify-center items-center border-y border-r mt-1 font-semibold px-2">
                                {item.code}
                              </div>
                              {item.measurements.map((measurement, index) => {
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
                              })}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </>
                )}

                {measurementDetails.some(
                  (detail) => detail.category === "rok",
                ) && (
                  <>
                    <div className="flex">
                      <div>
                        <div className="flex justify-center items-center border w-40 mt-1 font-semibold">
                          ROK
                        </div>
                        {rok.map((measurement, index) => {
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
                      {measurementDetails.map((item, index) => {
                        if (item.category == "rok") {
                          return (
                            <div key={index}>
                              <div className="flex justify-center items-center border-y border-r mt-1 font-semibold px-2">
                                {item.code}
                              </div>
                              {item.measurements.map((measurement, index) => {
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
                              })}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </>
                )}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <PaymentModal
          title={"Input Pembayaran"}
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        >
          <div>
            <div className="flex items-start">
              <label className="w-32">Type Pembayaran</label>
              <label>:</label>
              <div>
                <div className="flex items-center">
                  <input
                    name="payment_method"
                    value={"Cash"}
                    onClick={handleChange}
                    type="radio"
                    defaultChecked={
                      payment.payment_method == "Cash" ? true : false
                    }
                    className="flex ml-2"
                  />
                  <label className="flex ml-1">Cash</label>
                </div>
                <div className="flex items-center">
                  <input
                    name="payment_method"
                    value={"Card"}
                    defaultChecked={
                      payment.payment_method == "Card" ? true : false
                    }
                    onClick={handleChange}
                    type="radio"
                    className="flex ml-2"
                  />
                  <label className="flex ml-1">Card</label>
                </div>
                <div className="mt-2">
                  <label className="flex ml-2">Transfer</label>
                  <div className="flex items-center">
                    <input
                      name="payment_method"
                      value={"Transfer-BCA"}
                      defaultChecked={
                        payment.payment_method == "Transfer-BCA" ? true : false
                      }
                      onClick={handleChange}
                      type="radio"
                      className="flex ml-2"
                    />
                    <BcaSvg w={"50px"} h={"50px"} c={"ml-2"} />
                    <input
                      name="payment_method"
                      value={"Transfer-BNI"}
                      defaultChecked={
                        payment.payment_method == "Transfer-BNI" ? true : false
                      }
                      onClick={handleChange}
                      type="radio"
                      className="flex ml-4"
                    />
                    <BniSvg w={"50px"} h={"50px"} c={"ml-2"} />
                    <input
                      name="payment_method"
                      value={"Transfer-BRI"}
                      defaultChecked={
                        payment.payment_method == "Transfer-BRI" ? true : false
                      }
                      onClick={handleChange}
                      type="radio"
                      className="flex ml-4"
                    />
                    <BriSvg w={"50px"} h={"50px"} c={"ml-2"} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <label className="w-32">Tgl. Bayar</label>
              <label>:</label>
              <input
                name="payment_date"
                defaultValue={today}
                onChange={handleChange}
                type="date"
                className="ml-2 px-2"
              />
            </div>
            <div className="flex items-center mt-2">
              <label className="w-32">Nominal Bayar</label>
              <label>:</label>
              <input
                name="amount_paid"
                placeholder="Input Nominal"
                defaultValue={payment.amount_paid}
                type="number"
                className="ml-2 px-2 spinner-disabled w-48"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-start mt-2">
              <label className="w-32">Keterangan</label>
              <label>:</label>
              <textarea
                name="notes"
                defaultValue={payment.notes}
                placeholder="Input keterangan"
                onChange={handleChange}
                className="ml-2 w-64 border rounded-lg px-2"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="flex-all-center button-danger mx-1 cursor-pointer"
            >
              <Svg title="Cancel" c={"w-5 fill-current mx-1"}>
                <DeleteSvg />
              </Svg>
              <span className="mx-1">Cancel</span>
            </button>
            <BtnSave p={processing} />
          </div>
        </PaymentModal>
      </form>

      <form onSubmit={handleProgressSubmit}>
        <ProgressModal
          title={"Update Progress Pengerjaan"}
          isOpen={progressModalOpen}
          onClose={() => setProgressModalOpen(false)}
        >
          <div>
            <div className="flex items-start">
              <label className="w-32">Progress Status</label>
              <label>:</label>
              <label className="ml-2 font-semibold">{updateProgress}</label>
            </div>
            <div className="flex items-start mt-2">
              <label className="w-32">Tanggal</label>
              <label>:</label>
              <input
                type="date"
                className="ml-2"
                onChange={handleProgressDateChange}
              />
            </div>
            <div className="flex items-start mt-2">
              <label className="w-32">Keterangan</label>
              <label>:</label>
              <textarea
                name="notes"
                onChange={handleProgressNotesChange}
                className="ml-2 w-64 border rounded-lg px-2"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setProgressModalOpen(false);
              }}
              className="flex-all-center button-danger mx-1 cursor-pointer"
            >
              <Svg title="Cancel" c={"w-5 fill-current mx-1"}>
                <DeleteSvg />
              </Svg>
              <span className="mx-1">Cancel</span>
            </button>
            <BtnSave p={processing} />
          </div>
        </ProgressModal>
      </form>

      <ShowProgressModal
        title={"Detail Progress Pengerjaan"}
        isOpen={showProgressModalOpen}
        onClose={() => setShowProgressModalOpen(false)}
      >
        <div>
          <div className="flex items-start">
            <label className="w-32">Progress</label>
            <label>:</label>
            <label className="ml-2 font-semibold">
              {productionProgress ? productionProgress.status : "-"}
            </label>
          </div>
          <div className="flex items-start mt-2">
            <label className="w-32">Tanggal</label>
            <label>:</label>
            <label className="ml-2 font-semibold">
              {productionProgress
                ? FormattedDateLong(productionProgress.created_at)
                : "-"}
            </label>
          </div>
          <div className="flex items-start mt-2">
            <label className="w-32">Nama Tukang</label>
            <label>:</label>
            <label className="ml-2 font-semibold">
              {productionProgress && productionProgress.tailor
                ? productionProgress.tailor.name
                : "-"}
            </label>
          </div>
          <div className="flex items-start mt-2">
            <label className="w-32">Keterangan</label>
            <label>:</label>
            <label className="ml-2 font-semibold w-60">
              {productionProgress ? productionProgress.notes : "-"}
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => setShowProgressModalOpen(false)}
            className="flex-all-center button-danger mx-1 cursor-pointer"
          >
            <Svg title="Close" c={"w-5 fill-current mx-1"}>
              <DeleteSvg />
            </Svg>
            <span className="mx-1">Close</span>
          </button>
        </div>
      </ShowProgressModal>

      <ShowMeasurementModal
        title={"Detail Ukuran"}
        isOpen={showMeasurementModalOpen}
        onClose={() => {
          setClothingType("");
          setCategory("");
          setMeasurements([]);
          setShowMeasurementModalOpen(false);
        }}
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
                <label className="ml-2 uppercase">{category}</label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-44">Jenis Pakaian</label>
                <label>:</label>
                <label className="ml-2">{clothingType}</label>
              </div>
              <div className="mt-4">
                <div className="flex items-center border-b p-1 w-96">
                  <label className="w-44">Bagian yang di ukur</label>
                </div>
                {measurements?.map((measurement, index) => {
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
                })}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setClothingType("");
                  setCategory("");
                  setMeasurements([]);
                  setShowMeasurementModalOpen(false);
                }}
                className="flex-all-center button-danger px-2 cursor-pointer"
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
    </>
  );
}
