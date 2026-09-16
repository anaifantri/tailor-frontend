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
  const [payments, setPayments] = useState([]);
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
        console.log(response.data);
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
          addUrl="/dashboard/transactions/payments/create"
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

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4">
          <table className="table-auto w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-2 text-center">No.</th>
                <th className="px-4 py-2 text-center">No. Pesanan</th>
                <th className="px-4 py-2 text-center">Tgl. Pesan</th>
                <th className="px-4 py-2 text-center">Nama Pelanggan</th>
                <th className="px-4 py-2 text-center">Jenis Pembayaran</th>
                <th className="px-4 py-2 text-center">Metode Bayar</th>
                <th className="px-4 py-2 text-center">Tgl. Bayar</th>
                <th className="px-4 py-2 text-center">Nominal Bayar</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment, index) => {
                const order = payment.order;
                const customer = order.customer;
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-1 text-center">{index + 1}</td>
                    <td className="px-4 py-1 text-center">{order.number}</td>
                    <td className="px-4 py-1 text-center">
                      {FormattedDateShort(order.order_date)}
                    </td>
                    <td className="px-4 py-1 text-center">{customer.name}</td>
                    <td className="px-4 py-1 text-center">
                      {payment && payment.payment_status == "down_payment"
                        ? "DP"
                        : payment && payment.payment_status == "full_payment"
                          ? "Pelunasan"
                          : "Bertahap"}
                    </td>
                    <td className="px-4 py-1 text-center">
                      {payment.payment_method}
                    </td>
                    <td className="px-4 py-1 text-center">
                      {FormattedDateShort(payment.payment_date)}
                    </td>
                    <td className="px-4 py-1 text-center">
                      <div className="flex w-full">
                        <label className="w-3">Rp.</label>
                        <label className="w-full ml-2 text-right">
                          {Number(payment.amount_paid).toLocaleString()}
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-1 text-center">
                      <TdAction
                        showUrl={`/dashboard/transactions/payments/${payment.hashed_id}`}
                        editUrl={`/dashboard/transactions/payments/edit/${payment.hashed_id}`}
                        deleteUrl="/api/payments/delete/"
                        deleteId={payment.hashed_id}
                        getToken={token}
                        returnUrl="/dashboard/transactions/payments"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
