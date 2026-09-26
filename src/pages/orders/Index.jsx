import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
import MeasurementModal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import TdAction from "@/components/TdAction";
import Filters from "@/components/Filters";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "@/components/LoadingData";
import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import ShowSvg from "@/assets/Svg/ShowSvg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";

export default function Index() {
  const [searchParams] = useSearchParams();
  const deleteMessage = searchParams.get("message");
  const failedDelete = searchParams.get("failed");
  const location = useLocation();
  const { token } = useAuth();
  const message = location.state?.message;
  const failed = location.state?.failed;
  const [orders, setOrders] = useState(null);
  const [measurementHistory, setMeasurementHistory] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [clothingType, setClothingType] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [showMeasurementModalOpen, setShowMeasurementModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetail, setShowDetail] = useState([]);

  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(currentMonthIndex + 1);
  const [year, setYear] = useState(currentYear);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const handleShowMeasurement = (measurements) => {
    console.log(measurements);
  };

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
          params: {
            page: currentPage,
            per_page: perPage,
            month,
            year,
            search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, perPage, month, year, search]);

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getRowNumber = (index) => (currentPage - 1) * perPage + index + 1;

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div className="text-rose-400 p-4">Error: {error}</div>;
  }

  return (
    <>
      <div className="w-full text-slate-100">
        <HeaderIndex
          title="Daftar Pesanan"
          addTitle="Tambah Pesanan"
          addUrl="/dashboard/transactions/orders/create"
        />
        <Filters
          pageAction={handlePerPageChange}
          perPage={perPage}
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

        <div className="overflow-hidden rounded-xl border border-slate-700 shadow-lg mt-4 bg-slate-800">
          <table className="table-auto w-full divide-y divide-slate-700 text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase font-semibold text-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-2 text-center">No.</th>
                <th className="py-3 px-2 text-center">No. Pesanan</th>
                <th className="py-3 px-2 text-center">Tgl. Pesan</th>
                <th className="py-3 px-2 text-center">Nama Pelanggan</th>
                <th className="py-3 px-2 text-center">Detail Pesanan</th>
                <th className="py-3 px-2 text-center">Total Harga</th>
                <th className="py-3 px-2 text-center">Pembayaran</th>
                <th className="py-3 px-2 text-center">Progress</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-800">
              {orders.map((order, index) => {
                const totalPayment = order.payments.reduce(
                  (total, payment) =>
                    Number(total) + Number(payment.amount_paid),
                  0,
                );
                const isShow = showDetail.includes(index);

                return (
                  <tr
                    key={index}
                    className="hover:bg-slate-700/50 transition-colors text-xs text-slate-200"
                  >
                    <td className="px-3 py-2 text-center text-slate-400">
                      {getRowNumber(index)}
                    </td>
                    <td className="px-3 py-2 text-center font-medium text-slate-100">
                      {order.number}
                    </td>
                    <td className="px-3 py-2 text-center text-slate-300">
                      {order.order_date}
                    </td>
                    <td className="px-3 py-2 text-center font-medium text-slate-100">
                      {order.customer.name}
                    </td>
                    <td className="px-3 py-2 text-center p-1">
                      {isShow ? (
                        <div className="flex w-full items-center">
                          <table
                            key={index}
                            className="w-full border border-slate-700 rounded-lg overflow-hidden"
                          >
                            <thead>
                              <tr className="h-6 bg-slate-900 text-indigo-400">
                                <th className="py-1 px-2 text-center text-xs w-54">
                                  Jenis
                                </th>
                                <th className="py-1 px-2 text-center text-xs w-20">
                                  Ukuran
                                </th>
                                <th className="py-1 px-2 text-center text-xs w-12">
                                  Qty
                                </th>
                                <th className="py-1 px-2 text-center text-xs w-20">
                                  Price
                                </th>
                                <th className="py-1 px-2 text-center text-xs w-24">
                                  Subtotal
                                </th>
                                <th className="py-1 px-2 text-center text-xs w-20">
                                  Progress
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                              {order.order_details.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-2 py-1 text-center text-slate-200">
                                    {item.clothing_type.type}
                                  </td>
                                  <td className="px-2 py-1 text-center">
                                    <div className="w-full flex-all-center">
                                      <button
                                        onClick={() =>
                                          handleShowMeasurement(
                                            item.measurements,
                                          )
                                        }
                                        title="Lihat ukuran"
                                        className="flex-all-center p-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer"
                                      >
                                        <Svg
                                          title="Show"
                                          c={"w-4 fill-current"}
                                        >
                                          <ShowSvg />
                                        </Svg>
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-2 py-1 text-center text-slate-200">
                                    {item.quantity}
                                  </td>
                                  <td className="px-2 py-1 text-slate-300">
                                    {Number(item.price).toLocaleString()}
                                  </td>
                                  <td className="px-2 py-1 text-slate-100 font-medium">
                                    {Number(
                                      item.price * item.quantity,
                                    ).toLocaleString()}
                                  </td>
                                  <td className="px-2 py-1 text-center text-indigo-300">
                                    {item.production_progress
                                      ? item.production_progress[
                                          item.production_progress.length - 1
                                        ].status
                                      : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <button
                            className="flex justify-center items-center w-8 mx-auto text-slate-400 hover:text-indigo-400 transition cursor-pointer ml-2"
                            onClick={() => handleBtnDetail(index)}
                          >
                            <Svg
                              title="Arrow"
                              c={
                                isShow
                                  ? "nav-svg w-5 fill-current rotate-180 text-indigo-400"
                                  : "nav-svg w-5 fill-current"
                              }
                            >
                              <ArrowSvg />
                            </Svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex w-full items-center">
                          <label className="ml-1 w-full text-slate-400">
                            Tampilkan Detail Pesanan
                          </label>
                          <button
                            className="flex justify-center items-center w-8 mx-auto text-slate-400 hover:text-indigo-400 transition cursor-pointer"
                            onClick={() => handleBtnDetail(index)}
                          >
                            <Svg
                              title="Arrow"
                              c={
                                isShow
                                  ? "nav-svg w-5 fill-current rotate-180 text-indigo-400"
                                  : "nav-svg w-5 fill-current"
                              }
                            >
                              <ArrowSvg />
                            </Svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <div className="flex w-full">
                        <label className="w-3 text-slate-400">Rp.</label>
                        <label className="w-16 ml-2 text-right font-medium text-slate-100">
                          {Number(order.total).toLocaleString()}
                        </label>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <div className="flex w-full">
                        <label className="w-3 text-slate-400">Rp.</label>
                        <label className="w-16 ml-2 text-right text-emerald-400 font-medium">
                          {totalPayment.toLocaleString()}
                        </label>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {order?.payment_status ? order.payment_status : "-"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {order?.status ? order.status : "-"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <TdAction
                        showUrl={`/dashboard/transactions/orders/${order.hashed_id}`}
                        editUrl={`/dashboard/transactions/orders/edit/${order.hashed_id}`}
                        deleteUrl="/api/orders/delete/"
                        deleteId={order.hashed_id}
                        getToken={token}
                        returnUrl="/dashboard/transactions/orders"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={(page) => setCurrentPage(page)}
          loading={loading}
        />
      </div>

      <MeasurementModal
        title={"Detail Ukuran"}
        isOpen={showMeasurementModalOpen}
        onClose={() => setShowMeasurementModalOpen(false)}
      >
        <div className="w-150 text-slate-200">
          <div className="flex-all-center mt-4">
            <div>
              <label className="w-44 text-indigo-400 font-semibold tracking-wider text-xs">
                INFORMASI PELANGGAN
              </label>
              <div className="flex p-3 border border-slate-700 bg-slate-800 rounded-xl w-full mt-1">
                <div>
                  <div className="flex items-center">
                    <label className="w-44 text-slate-400">
                      Nama Pelanggan
                    </label>
                    <label className="text-slate-500">:</label>
                    <label className="ml-2 font-medium text-slate-100">
                      {customer ? customer.name : "-"}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44 text-slate-400">Nomor Telepon</label>
                    <label className="text-slate-500">:</label>
                    <label className="ml-2 text-slate-200">
                      {customer ? customer.phone : "-"}
                    </label>
                  </div>
                  <div className="flex mt-2">
                    <label className="w-44 text-slate-400">Alamat</label>
                    <label className="text-slate-500">:</label>
                    <label className="ml-2 w-96 h-10 text-slate-200">
                      {customer ? customer.address : "-"}
                    </label>
                  </div>
                </div>
              </div>

              <label className="flex w-44 mt-4 text-indigo-400 font-semibold tracking-wider text-xs">
                DETAIL PENGUKURAN
              </label>
              <div className="flex p-3 border border-slate-700 bg-slate-800 rounded-xl w-full mt-1">
                <div>
                  <div className="flex items-center">
                    <label className="w-44 text-slate-400">Jenis Pakaian</label>
                    <label className="text-slate-500">:</label>
                    <label className="ml-2 font-medium text-slate-100">
                      {clothingType && clothingType.type}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44 text-slate-400">Tanggal Ukur</label>
                    <label className="text-slate-500">:</label>
                    <label className="ml-2 text-slate-200">
                      {measurementHistory && measurementHistory.measured_at}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44 text-slate-400">Diukur Oleh</label>
                    <label className="text-slate-500">:</label>
                    <label className="ml-2 text-slate-200">
                      {measurementHistory && measurementHistory.measured_by}
                    </label>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center border-b border-slate-700 p-2 w-72 font-semibold text-slate-200">
                      <label className="w-44">Detail Ukuran</label>
                    </div>
                    {measurementDetails.map((measurement, index) => (
                      <div
                        key={index}
                        className="flex items-center border-b border-slate-700/60 p-1.5 w-72 hover:bg-slate-700/30 text-slate-300"
                      >
                        <label className="w-6 text-slate-500">
                          {index + 1}.{" "}
                        </label>
                        <label className="w-44">{measurement.name}</label>
                        <label className="text-slate-500">=</label>
                        <label className="ml-2 w-6 text-right font-medium text-slate-100">
                          {measurement.value}
                        </label>
                        <label className="flex w-6 ml-2 text-slate-400 text-xs">
                          cm
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <label className="flex w-32 mt-4 text-slate-400 text-sm">
                Catatan tambahan :
              </label>
              <label className="flex mt-2 border border-slate-700 bg-slate-900 rounded-lg w-full min-h-16 px-3 py-2 text-slate-200 text-sm">
                {measurementHistory && measurementHistory.notes}
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setShowMeasurementModalOpen(false);
            }}
            className="flex-all-center bg-rose-600 hover:bg-rose-500 text-white font-medium px-3 py-1.5 rounded-lg mx-1 cursor-pointer transition shadow"
          >
            <Svg title="Close" c={"w-5 fill-current mx-1"}>
              <DeleteSvg />
            </Svg>
            <span className="mx-1">Close</span>
          </button>
        </div>
      </MeasurementModal>
    </>
  );
}
