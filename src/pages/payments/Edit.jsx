import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

import api from "@/apiService";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/components/LoadingData";
import BcaSvg from "@/Assets/Svg/BcaSvg";
import BniSvg from "@/Assets/Svg/BniSvg";
import BriSvg from "@/Assets/Svg/BriSvg";

export default function Create() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderBalance, setOrderBalance] = useState(null);
  const [payment, setPayment] = useState({
    user_id: user.hashed_id,
    order_id: null,
    payment_date: null,
    amount_paid: null,
    payment_method: null,
    payment_status: null,
    notes: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
    if (name == "amount_paid") {
      if (value >= orderBalance) {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/payments/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayment(response.data.payment);
        const orderTotal = response.data.payment.order.total;
        const totalPayment = response.data.payment.order.payments.reduce(
          (acc, curr) => acc + curr.amount_paid,
          0,
        );
        const getBalance =
          orderTotal - (totalPayment - response.data.payment.amount_paid);
        setOrderBalance(getBalance);
        console.log(response.data.payment);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        const response = await api.post(
          `/api/payments/${id}/edit`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "mulipart/form-data",
            },
          },
        );
        navigate("/dashboard/payments/" + response.data.payment.hashed_id, {
          state: {
            message: response.data.message,
          },
        });
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
      <form onSubmit={handleSubmit}>
        <div className="w-250">
          <HeaderEdit
            titleEdit="Data Pembayaran"
            backUrl="/dashboard/transactions/payments"
            getProcessing={processing}
          />
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex ml-2 font-semibold">Data Pelanggan</div>
            <div className="flex ml-2 font-semibold">Data Pembayaran</div>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm texl-lg p-2">
              <div className="flex items-center">
                <label className="w-32">Nomor Pesanan</label>
                <label>:</label>
                <label className="ml-2 font-semibold">
                  {payment.order.number}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-32">Nama Pelanggan</label>
                <label>:</label>
                <label className="ml-2 font-semibold">
                  {payment.order.customer.name}
                </label>
              </div>
              <div className="flex items-center mt-2">
                <label className="w-32">Nomor Telepon</label>
                <label>:</label>
                <label className="ml-2 font-semibold">
                  {payment.order.customer.phone}
                </label>
              </div>
              <div className="flex mt-2">
                <label className="w-32">Alamat</label>
                <label>:</label>
                <label className="ml-2 font-semibold w-80">
                  {payment.order.customer.address}
                </label>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm texl-lg p-2">
              <div className="flex items-center">
                <label className="w-32">Tgl. Bayar</label>
                <label>:</label>
                <input
                  name="payment_date"
                  defaultValue={payment.payment_date}
                  onChange={handleChange}
                  type="date"
                  className="ml-2 px-2 w-48"
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
                  placeholder="Input Keterangan"
                  name="notes"
                  rows={4}
                  defaultValue={payment.notes}
                  onChange={handleChange}
                  className="ml-2 w-80 border rounded-lg px-2"
                ></textarea>
              </div>
              <div className="flex items-start mt-2">
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
                      defaultChecked={
                        payment.payment_method == "Cash" ? true : false
                      }
                    />
                    <label className="flex ml-1">Cash</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      name="payment_method"
                      value={"Card"}
                      onClick={handleChange}
                      type="radio"
                      defaultChecked={
                        payment.payment_method == "Card" ? true : false
                      }
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
                        defaultChecked={
                          payment.payment_method == "Transfer-BCA"
                            ? true
                            : false
                        }
                        className="flex ml-2"
                      />
                      <BcaSvg w={"50px"} h={"50px"} c={"ml-2"} />
                      <input
                        name="payment_method"
                        value={"Transfer-BNI"}
                        onClick={handleChange}
                        type="radio"
                        defaultChecked={
                          payment.payment_method == "Transfer-BNI"
                            ? true
                            : false
                        }
                        className="flex ml-4"
                      />
                      <BniSvg w={"50px"} h={"50px"} c={"ml-2"} />
                      <input
                        name="payment_method"
                        value={"Transfer-BRI"}
                        onClick={handleChange}
                        type="radio"
                        defaultChecked={
                          payment.payment_method == "Transfer-BRI"
                            ? true
                            : false
                        }
                        className="flex ml-4"
                      />
                      <BriSvg w={"50px"} h={"50px"} c={"ml-2"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
