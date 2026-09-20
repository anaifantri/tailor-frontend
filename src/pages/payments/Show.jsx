import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import LogoBlack from "@/assets/Images/logo-riori-black.png";
import TextBlack from "@/assets/Images/text-riori-black.png";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [payment, setPayment] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/payments/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayment(response.data.payment);
        setOrder(response.data.payment.order);
        setCustomer(response.data.payment.order.customer);
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

    fetchData();
  }, []);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>
        <HeaderShow
          titleShow="Pembayaran"
          url="/transactions/payments"
          deleteUrl="/payments"
          getId={payment.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="flex-all-center mt-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm texl-lg w-full p-6">
            <div className="flex-all-center w-full border-b p-2">
              <img className="h-20" src={LogoBlack} alt="" />
              <div>
                <div className="flex-all-center w-72">
                  <img className="h-9" src={TextBlack} alt="" />
                </div>
                <div className="flex-all-center mt-1 w-72">
                  <span className="flex text-xs">
                    Jl. Teuku Umar No. 65 E - Denpasar, Bali
                  </span>
                </div>
                <div className="flex-all-center w-72">
                  <span className="flex text-xs">
                    www.rioritailor.com | Email : info@rioritailor.com
                  </span>
                </div>
                <div className="flex-all-center w-72">
                  <span className="flex text-xs">WA +62 851 0144 2323</span>
                </div>
              </div>
            </div>
            <div className="flex w-full p-1 mt-2">
              <label className="flex w-44">Nomor Pesanan</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {order ? order.number : "-"}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-44">Nama Pelanggan</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {customer ? customer.name : "-"}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-44">Tgl. Bayar</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {payment ? FormattedDateLong(payment.payment_date) : "-"}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-44">Nominal Bayar</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">Rp.</label>
              <label className="flex ml-2 font-semibold">
                {payment ? Number(payment.amount_paid).toLocaleString() : "-"},-
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-44">Jenis Pembayaran</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {payment && payment.payment_status == "down_payment"
                  ? "DP"
                  : payment && payment.payment_status == "full_payment"
                    ? "Pelunasan"
                    : "Bertahap"}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-44">Metode Pembayaran</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {payment ? payment.payment_method : "-"}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-44">Keterangan</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold w-56">
                {payment &&
                payment.notes != "null" &&
                payment.notes != "" &&
                payment.notes != null
                  ? payment.notes
                  : "-"}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <div className="w-full">
                <div className="flex-all-center w-full">
                  <label className="flex">Kasir,</label>
                </div>
                <div className="flex-all-center w-full mt-14">
                  <label className="flex ml-2 font-semibold underline">
                    ({payment ? payment.user.name : "-"})
                  </label>
                </div>
              </div>
              <div className="flex-all-center w-full">
                <div className="w-full">
                  <div className="flex-all-center w-full">
                    <label className="flex">Pelanggan,</label>
                  </div>
                  <div className="flex-all-center w-full mt-14">
                    <label className="flex ml-2 font-semibold">
                      (_____________________)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
