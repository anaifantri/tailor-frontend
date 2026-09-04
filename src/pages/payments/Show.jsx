import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";
import FormattedDateLong from "@/Utils/FormattedDateLong";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [payment, setPayment] = useState(null);
  const [client, setClient] = useState(null);
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
        setClient(response.data.payment.order.client);
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
          titleShow="Data Pembayaran"
          url="/payments"
          getId={payment.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="flex-all-center mt-4">
          <div className=" border rounded-xl p-2 texl-lg w-160 h-60">
            <div className="flex w-full p-1">
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
                {client ? client.name : "-"}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-44">Nominal Bayar</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                Rp.
                {payment ? Number(payment.amount_paid).toLocaleString() : "-"}
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
              <label className="flex w-44">Jenis Pembayaran</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {payment && payment.payment_status == "down_payment"
                  ? "DP"
                  : "Pelunasan"}
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
              <label className="flex ml-2 font-semibold w-100">
                {payment &&
                payment.notes != "null" &&
                payment.notes != "" &&
                payment.notes != null
                  ? payment.notes
                  : "-"}
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
