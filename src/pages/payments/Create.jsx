import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import api from "@/apiService";

import BtnPay from "@/components/BtnPay";
import PaymentModal from "@/components/Modal";
import LoadingData from "@/components/LoadingData";
import FormattedDateShort from "@/Utils/FormattedDateShort";
import Svg from "@/components/Svg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import BcaSvg from "@/Assets/Svg/BcaSvg";
import BniSvg from "@/Assets/Svg/BniSvg";
import BriSvg from "@/Assets/Svg/BriSvg";
import BtnSave from "@/components/BtnSave";

export default function Create() {
  const navigate = useNavigate();
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const { user, token } = useAuth();
  const [orders, setOrders] = useState(null);
  const [balance, setBalance] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showDetail, setShowDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payment, setPayment] = useState({
    user_id: user.hashed_id,
    order_id: null,
    payment_date: today,
    amount_paid: null,
    payment_method: null,
    payment_status: "full_payment",
    notes: null,
  });

  const handleBtnPay = (balance, orderId) => {
    setBalance(balance);
    setPayment((prevPayment) => ({
      ...prevPayment,
      ["order_id"]: orderId,
      ["amount_paid"]: balance,
    }));
    setPaymentModalOpen(true);
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/orders/unpaid", {
          params: { search },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

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
        console.log(response.data);
        navigate(
          "/dashboard/transaction/payments/" + response.data.payment.hashed_id,
          {
            state: {
              message: response.data.message,
            },
          },
        );
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
      <div className="w-360">
        <div className="flex border-b w-full">
          <label className="flex font-semibold p-1 text-lg w-96">
            PILIH PESANAN YANG AKAN DIBAYAR
          </label>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mt-2">
            <label className="flex w-20">Pencarian</label>
            <input
              type="text"
              placeholder="search"
              value={search}
              onChange={handleSearchChange}
              className="py-1 px-2"
            />
          </div>
        </div>
        <table className="table-auto mt-2 w-full">
          <thead>
            <tr className="bg-stone-200 h-12">
              <th className="th-center text-xs w-10">No.</th>
              <th className="th-center text-xs w-24">Tgl. Pesan</th>
              <th className="th-center text-xs w-24">No. Pesanan</th>
              <th className="th-center text-xs w-56">Nama Pelanggan</th>
              <th className="th-center text-xs w-32">No. Telepon</th>
              <th className="th-center text-xs">Detail Pesanan</th>
              <th className="th-center text-xs w-24">Total Harga</th>
              <th className="th-center text-xs w-24">DP</th>
              <th className="th-center text-xs w-24">Kekurangan</th>
              <th className="th-center text-xs w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const totalPayment = order.payments.reduce(
                (total, payment) => Number(total) + Number(payment.amount_paid),
                0,
              );
              const isShow = showDetail.includes(index);
              return (
                <tr className="bg-white h-10" key={index}>
                  <td className="td-center text-xs">{index + 1}</td>
                  <td className="td-center text-xs">
                    {FormattedDateShort(order.order_date)}
                  </td>
                  <td className="td-center text-xs">{order.number}</td>
                  <td className="td-left">{order.customer.name}</td>
                  <td className="td-center">{order.customer.phone}</td>
                  <td className="td-left p-1">
                    <div className="flex w-full">
                      {isShow ? (
                        <table key={index}>
                          <thead>
                            <tr className="h-6 bg-stone-200">
                              <th className="th-center text-xs w-44">Jenis</th>
                              <th className="th-center text-xs w-12">Qty</th>
                              <th className="th-center text-xs w-20">price</th>
                              <th className="th-center text-xs w-24">
                                Subtotal
                              </th>
                              <th className="th-center text-xs w-20">
                                Progress
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.order_details.map((item, index) => (
                              <tr key={index}>
                                <td className="td-center">
                                  {item.clothing_type.type}
                                </td>
                                <td className="td-center">{item.quantity}</td>
                                <td className="td-center">
                                  {Number(item.price).toLocaleString()}
                                </td>
                                <td className="td-center">
                                  {Number(
                                    item.price * item.quantity,
                                  ).toLocaleString()}
                                </td>
                                <td className="td-center">
                                  {item.production_progress[
                                    item.production_progress.length - 1
                                  ].status == "queued"
                                    ? "antrian"
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <label className="w-120">
                          {order.order_details.map((detail, i) => (
                            <label className="ml-1" key={i}>
                              {detail.clothing_type.type},
                            </label>
                          ))}
                        </label>
                      )}

                      <button
                        className="flex justify-center items-center w-4 mx-auto hover:text-teal-700 cursor-pointer"
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
                  <td className="td-right text-xs">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-16 ml-2 text-right">
                        {Number(order.total).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-right text-xs">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-16 ml-2 text-right">
                        {totalPayment.toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-right text-xs">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-16 ml-2 text-right">
                        {(order.total - totalPayment).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center">
                    <div className="flex w-full justify-end">
                      <BtnPay
                        action={() =>
                          handleBtnPay(
                            order.total - totalPayment,
                            order.hashed_id,
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
                className="ml-2 px-2 w-40"
              />
            </div>
            <div className="flex items-center mt-2">
              <label className="w-32">Nominal Bayar</label>
              <label>:</label>
              <input
                name="amount_paid"
                placeholder="Input Nominal"
                defaultValue={balance}
                type="number"
                className="ml-2 px-2 spinner-disabled w-40"
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
    </>
  );
}
