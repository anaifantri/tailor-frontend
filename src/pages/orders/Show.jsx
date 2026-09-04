import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";
import Select from "react-select";

import FormattedDateLong from "@/Utils/FormattedDateLong";

import HeaderShow from "@/components/HeaderShow";
import BtnPay from "@/components/BtnPay";
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
  const [fullPayment, setFullPayment] = useState(null);
  const [balance, setBalance] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(null);
  const [progressNotes, setProgressNotes] = useState(null);
  const [productionProgress, setProductionProgress] = useState(null);
  const [orderDetailId, setOrderDetailId] = useState(null);
  const [tailorId, setTailorId] = useState(null);
  const [progressDate, setProgressDate] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [showProgressModalOpen, setShowProgressModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [savedStatus, setSavedStatus] = useState(true);
  const [showDetail, setShowDetail] = useState([]);
  const [tailorOptions, setTailorOptions] = useState([]);
  const [payment, setPayment] = useState({
    user_id: user.hashed_id,
    order_id: null,
    payment_date: today,
    amount_paid: null,
    payment_method: null,
    payment_status: "full_payment",
    notes: null,
  });

  const progress = ["Antrian", "Potong", "Jahit", "Fitting", "Selesai"];

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
  };

  const handleProgressDateChange = (e) => {
    const { value } = e.target;
    setProgressDate(value);
  };

  const handleProgressNotesChange = (e) => {
    const { value } = e.target;
    setProgressNotes(value);
  };

  const handleSelectTailorChange = (selectedOption) => {
    setTailorId(selectedOption.value);
  };

  const handleProgressModal = (status, detailId) => {
    setProgressModalOpen(true);
    setUpdateProgress(status);
    setOrderDetailId(detailId);
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await api.get("/api/tailors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const formattedTailorOptions = response.data.map((item) => ({
          value: item.hashed_id,
          label: item.name,
        }));
        setTailorOptions(formattedTailorOptions);
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
    progressData.append("tailor_id", tailorId);
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
          const payments = response.data.order.payments;
          const getDownPayment = payments.find(
            (payment) => payment.payment_status === "down_payment",
          );
          const getFullPayment = payments.find(
            (payment) => payment.payment_status === "full_payment",
          );
          const downPaymentAmount = getDownPayment
            ? getDownPayment.amount_paid
            : 0;
          const fullPaymentAmount = getFullPayment
            ? getFullPayment.amount_paid
            : 0;
          const balanceAmount =
            response.data.order.total - downPaymentAmount - fullPaymentAmount;
          setDownPayment(downPaymentAmount);
          setFullPayment(fullPaymentAmount);
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
      <div className="w-250">
        <HeaderShow
          titleShow="Data Pesanan"
          url="/orders"
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
                {order.client.name}
              </label>
            </div>
            <div className="flex items-start mt-2">
              <label className="w-40">Alamat</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm w-100 h-14">
                {order.client.address}
              </label>
            </div>
            <div className="flex items-center mt-2">
              <label className="w-40">No. Handphone</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {order.client.phone}
              </label>
            </div>
            <div className="flex items-center mt-2">
              <label className="w-40">Email</label>
              <label>:</label>
              <label className="ml-2 font-semibold text-sm">
                {order.client.email}
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
                <th className="th-center text-sm w-20">No. Kain</th>
                <th className="th-center text-sm">Jenis</th>
                <th className="th-center text-sm w-16">Qty</th>
                <th className="th-center text-sm w-36">price</th>
                <th className="th-center text-sm w-40">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.order_details.map((item, index) => {
                const productionProgress = item.production_progress;
                const isShow = showDetail.includes(index);
                const nextProgress = productionProgress.length;
                return (
                  <tr className="h-8" key={index}>
                    <td className="td-center text-sm">{index + 1}</td>
                    <td className="td-center">{item.material.code}</td>
                    <td className="td-left">
                      <div className="flex w-full">
                        {isShow ? (
                          <div className="w-120">
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
                                      <div className="border-b-2 border-stone-900 w-12 h-3"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="w-120">
                            <span>{item.clothing_type.type}</span>
                          </div>
                        )}

                        <button
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
                    <td className="td-center">{item.quantity}</td>
                    <td className="td-right">
                      <div className="flex w-full">
                        <label className="w-3">Rp.</label>
                        <label className="w-28 ml-2 text-right">
                          {Number(item.price).toLocaleString()}
                        </label>
                      </div>
                    </td>
                    <td className="td-right">
                      <div className="flex w-full">
                        <label className="w-3">Rp.</label>
                        <label className="w-32 ml-2 text-right">
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
                  colSpan={4}
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
                    <label className="w-32 ml-2 text-right">
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
                    <label className="w-32 ml-2 text-right">
                      {Number(downPayment).toLocaleString()}
                    </label>
                  </div>
                </td>
              </tr>
              <tr className="h-10">
                <td className="td-right text-sm font-semibold">Pelunasan</td>
                <td className="td-right text-sm font-semibold">
                  {fullPayment ? (
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-32 ml-2 text-right">
                        {Number(fullPayment).toLocaleString()}
                      </label>
                    </div>
                  ) : (
                    <div className="flex w-full justify-end">
                      <BtnPay action={() => setPaymentModalOpen(true)} />
                    </div>
                  )}
                </td>
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
              </tr>
            </tbody>
          </table>
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
                    className="flex ml-2"
                  />
                  <label className="flex ml-1">Cash</label>
                </div>
                <div className="flex items-center">
                  <input
                    name="payment_method"
                    value={"Card"}
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
                      onClick={handleChange}
                      type="radio"
                      className="flex ml-2"
                    />
                    <BcaSvg w={"50px"} h={"50px"} c={"ml-2"} />
                    <input
                      name="payment_method"
                      value={"Transfer-BNI"}
                      onClick={handleChange}
                      type="radio"
                      className="flex ml-4"
                    />
                    <BniSvg w={"50px"} h={"50px"} c={"ml-2"} />
                    <input
                      name="payment_method"
                      value={"Transfer-BRI"}
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
                defaultValue={Number(balance)}
                type="number"
                className="ml-2 px-2 spinner-disabled"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-start mt-2">
              <label className="w-32">Keterangan</label>
              <label>:</label>
              <textarea
                name="notes"
                onChange={handleChange}
                className="ml-2 w-64 border rounded-lg px-2"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2">
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
              <label className="w-32">Pilih Tukang</label>
              <label>:</label>
              <Select
                className="w-60 ml-2 outline-none"
                onChange={(selectedOption) =>
                  handleSelectTailorChange(selectedOption)
                }
                options={tailorOptions}
                required
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
    </>
  );
}
