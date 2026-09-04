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
import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";

export default function Index() {
  const [searchParams] = useSearchParams();
  const deleteMessage = searchParams.get("message");
  const failedDelete = searchParams.get("failed");
  const location = useLocation();
  const { token } = useAuth();
  const message = location.state?.message;
  const failed = location.state?.failed;
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetail, setShowDetail] = useState([]);

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
        const response = await api.get("/api/orders", {
          params: { month, year, search },
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
  }, [month, year, search]);

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
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
      <div className="w-400">
        <HeaderIndex
          title="Daftar Pesanan"
          addTitle="Tambah Pesanan"
          addUrl="/dashboard/orders/create"
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
        <table className="table-auto mt-4 w-full">
          <thead>
            <tr className="bg-stone-200">
              <th className="th-center text-xs w-10" rowSpan={2}>
                No.
              </th>
              <th className="th-center text-xs w-24" rowSpan={2}>
                No. Pesanan
              </th>
              <th className="th-center text-xs w-24" rowSpan={2}>
                Tgl. Pesan
              </th>
              <th className="th-center text-xs w-24" rowSpan={2}>
                Jadwal Fitting
              </th>
              <th className="th-center text-xs w-56" rowSpan={2}>
                Nama Pelanggan
              </th>
              <th className="th-center text-xs" rowSpan={2}>
                Detail Pesanan
              </th>
              <th className="th-center text-xs" colSpan={3}>
                Data Pembayaran
              </th>
              <th className="th-center text-xs w-32" rowSpan={2}>
                Action
              </th>
            </tr>
            <tr className="bg-stone-200">
              <th className="th-center text-xs w-24">Total Harga</th>
              <th className="th-center text-xs w-24">Pembayaran</th>
              <th className="th-center text-xs w-24">Kekurangan</th>
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
                <tr className="bg-white" key={index}>
                  <td className="td-center text-xs">{index + 1}</td>
                  <td className="td-center text-xs">{order.number}</td>
                  <td className="td-center text-xs">{order.order_date}</td>
                  <td className="td-center text-xs">{order.fitting_date}</td>
                  <td className="td-left">{order.client.name}</td>
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
                    <TdAction
                      showUrl={`/dashboard/orders/${order.hashed_id}`}
                      editUrl={`/dashboard/orders/edit/${order.hashed_id}`}
                      deleteUrl="/api/orders/delete/"
                      deleteId={order.hashed_id}
                      getToken={token}
                      returnUrl="/dashboard/orders"
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
