import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
import TdAction from "@/components/TdAction";
import Filters from "@/components/Filters";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "@/components/LoadingData";
import FormattedDateShort from "@/Utils/FormattedDateShort";

export default function Index() {
  const [searchParams] = useSearchParams();
  const deleteMessage = searchParams.get("message");
  const failedDelete = searchParams.get("failed");
  const location = useLocation();
  const { token } = useAuth();
  const message = location.state?.message;
  const failed = location.state?.failed;
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(currentMonthIndex + 1);
  const [year, setYear] = useState(currentYear);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/payments", {
          params: { month, year, search },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month, year, search]);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="w-360">
        <HeaderIndex
          title="Daftar Pembayaran"
          addTitle="Tambah Pembayaran"
          addUrl="/dashboard/payments/create"
        />
        <Filters
          monthAction={handleMonthChange}
          yearAction={handleYearChange}
          searchAction={handleSearchChange}
          month={month}
          year={year}
          search={search}
        />
        {deleteMessage && (
          <SuccessMessage message={deleteMessage} duration="3000" />
        )}
        {failedDelete && (
          <FailedMessage message={failedDelete} duration="3000" />
        )}
        {message && <SuccessMessage message={message} duration="3000" />}
        {failed && <FailedMessage message={failed} duration="3000" />}
        <table className="table-auto mt-2 w-full">
          <thead>
            <tr className="bg-stone-200 h-10">
              <th className="th-center text-sm w-10">No.</th>
              <th className="th-center text-sm w-24">No. Pesanan</th>
              <th className="th-center text-sm w-24">Tgl. Pesan</th>
              <th className="th-center text-sm w-56">Nama Pelanggan</th>
              <th className="th-center text-sm w-32">Jenis Pembayaran</th>
              <th className="th-center text-sm w-32">Metode Bayar</th>
              <th className="th-center text-sm w-24">Tgl. Bayar</th>
              <th className="th-center text-sm w-32">Nominal Bayar</th>
              <th className="th-center text-sm w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => {
              const order = payment.order;
              const client = order.client;
              return (
                <tr className="bg-white" key={index}>
                  <td className="td-center text-sm">{index + 1}</td>
                  <td className="td-center text-sm">{order.number}</td>
                  <td className="td-center text-sm">
                    {FormattedDateShort(order.order_date)}
                  </td>
                  <td className="td-left text-sm">{client.name}</td>
                  <td className="td-center text-sm">
                    {payment && payment.payment_status == "down_payment"
                      ? "DP"
                      : payment && payment.payment_status == "full_payment"
                        ? "Pelunasan"
                        : "Bertahap"}
                  </td>
                  <td className="td-center text-sm">
                    {payment.payment_method}
                  </td>
                  <td className="td-center text-sm">
                    {FormattedDateShort(payment.payment_date)}
                  </td>
                  <td className="td-center text-sm">
                    <div className="flex w-full">
                      <label className="w-3">Rp.</label>
                      <label className="w-full ml-2 text-right">
                        {Number(payment.amount_paid).toLocaleString()}
                      </label>
                    </div>
                  </td>
                  <td className="td-center">
                    <TdAction
                      showUrl={`/dashboard/payments/${payment.hashed_id}`}
                      editUrl={`/dashboard/payments/edit/${payment.hashed_id}`}
                      deleteUrl="/api/payments/delete/"
                      deleteId={payment.hashed_id}
                      getToken={token}
                      returnUrl="/dashboard/payments"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
