import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
import MeasurementModal from "@/components/Modal";
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
  const [client, setClient] = useState(null);
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

  const handleShowMeasurement = (measurementHistoryId) => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          "/api/measurement-histories/" + measurementHistoryId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setMeasurementHistory(response.data.measurement_history);
        setMeasurementDetails(
          JSON.parse(response.data.measurement_history.measurement_details),
        );
        setClient(response.data.measurement_history.client);
        setClothingType(response.data.measurement_history.clothing_type);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setShowMeasurementModalOpen(true);
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
              <th className="th-center text-xs w-20" rowSpan={2}>
                Tgl. Pesan
              </th>
              <th className="th-center text-xs w-20" rowSpan={2}>
                Tgl. Fitting
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
                    {isShow ? (
                      <div className="flex w-full">
                        <table key={index}>
                          <thead>
                            <tr className="h-6 bg-stone-200">
                              <th className="th-center text-xs w-54">Jenis</th>
                              <th className="th-center text-xs w-20">Ukuran</th>
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
                                <td className="td-center">
                                  <div className="w-full flex-all-center">
                                    <button
                                      onClick={() =>
                                        handleShowMeasurement(
                                          item.measurement_history.hashed_id,
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
                                  {Number(item.price).toLocaleString()}
                                </td>
                                <td className="td-right">
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

                        <button
                          className="flex justify-center items-center w-9 mx-auto hover:text-teal-700 cursor-pointer"
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
                    ) : (
                      <div className="flex w-full">
                        <label className="ml-1 w-full">
                          Tampilkan Detail Pesanan
                        </label>
                        <button
                          className="flex justify-center items-center w-9 mx-auto hover:text-teal-700 cursor-pointer"
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
                    )}
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
                    {order.total - totalPayment <= 0 ? (
                      <div className="flex justify-center w-full">LUNAS</div>
                    ) : (
                      <div className="flex w-full">
                        <label className="w-3">Rp.</label>
                        <label className="w-16 ml-2 text-right">
                          {(order.total - totalPayment).toLocaleString()}
                        </label>
                      </div>
                    )}
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

      <MeasurementModal
        title={"Detail Ukuran"}
        isOpen={showMeasurementModalOpen}
        onClose={() => setShowMeasurementModalOpen(false)}
      >
        <div className="w-150">
          <div className="flex-all-center mt-4">
            <div>
              <label className="w-44">INFORMASI PELANGGAN</label>
              <div className="flex p-2 border rounded-xl w-full mt-1">
                <div>
                  <div className="flex items-center">
                    <label className="w-44">Nama Pelanggan</label>
                    <label>:</label>
                    <label className="ml-2">{client ? client.name : "-"}</label>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44">Nomor Telepon</label>
                    <label>:</label>
                    <label className="ml-2">
                      {client ? client.phone : "-"}
                    </label>
                  </div>
                  <div className="flex mt-2">
                    <label className="w-44">Alamat</label>
                    <label>:</label>
                    <label className="ml-2 w-96 h-10">
                      {client ? client.address : "-"}
                    </label>
                  </div>
                </div>
              </div>

              <label className="flex w-44 mt-4">DETAIL PENGUKURAN</label>
              <div className="flex p-2 border rounded-xl w-full mt-1">
                <div>
                  <div className="flex items-center">
                    <label className="w-44">Jenis Pakaian</label>
                    <label>:</label>
                    <label className="ml-2">
                      {clothingType && clothingType.type}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44">Tanggal Ukur</label>
                    <label>:</label>
                    <label className="ml-2">
                      {measurementHistory && measurementHistory.measured_at}
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44">Diukur Oleh</label>
                    <label>:</label>
                    <label className="ml-2">
                      {measurementHistory && measurementHistory.measured_by}
                    </label>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center border-b p-1 w-72">
                      <label className="w-44">Detail Ukuran</label>
                    </div>
                    {measurementDetails.map((measurement, index) => (
                      <div
                        key={index}
                        className="flex items-center border-b p-1 w-72"
                      >
                        <label className="w-6">{index + 1}. </label>
                        <label className="w-44">{measurement.name}</label>
                        <label>=</label>
                        <label className="ml-2 w-6 text-right">
                          {measurement.value}
                        </label>
                        <label className="flex w-6 ml-2">cm</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <label className="flex w-32 mt-4">Catatan tambahan :</label>
              <label className="flex mt-2 border rounded-md w-full min-h-16 px-2 py-1">
                {measurementHistory && measurementHistory.notes}
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              setShowMeasurementModalOpen(false);
            }}
            className="flex-all-center button-danger mx-1 cursor-pointer"
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
