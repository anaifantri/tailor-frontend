import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";

import HeaderShowAll from "@/components/HeaderShowAll";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";
import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import CheckSvg from "@/assets/Svg/CheckSvg";
import ReloadSvg from "@/assets/Svg/ReloadSvg";

export default function Show() {
  const { token } = useAuth();
  const { ulid } = useParams();
  const location = useLocation();
  const message = location.state?.message;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRow, setNewRow] = useState(0);
  const [showDetail, setShowDetail] = useState([]);
  const progressStatus = ["queued", "cutting", "sewing", "fitting", "finished"];

  const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/orders/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        setOrder(response.data.data);
        setNewRow(3 - Number(response.data.data.order_details.length));
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

    fetchOrder();
  }, [ulid, token]);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div className="text-rose-400 p-4">Error: {error}</div>;
  }

  return (
    <>
      <div className="w-full text-slate-100">
        <HeaderShowAll
          titleShow={`Pesanan Nomor : ${order?.number || ""}`}
          url="/transactions/orders"
          deleteUrl="/orders"
          getId={order.ulid}
          token={token}
        />

        {message && <SuccessMessage message={message} duration="3000" />}

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-2 border border-slate-700 bg-slate-800 rounded-xl p-4 shadow-lg text-slate-200">
            <h3 className="text-lg font-bold text-brand-secondary border-b border-slate-700 pb-2 mb-3">
              Informasi Pelanggan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-36 text-slate-400">Nama Pelanggan</span>
                <span className="text-slate-500 mr-2">:</span>
                <span className="font-semibold text-slate-100">
                  {order?.customer?.name}
                </span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-400">Nomor Telepon</span>
                <span className="text-slate-500 mr-2">:</span>
                <span className="text-slate-200">{order?.customer?.phone}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-400">Email</span>
                <span className="text-slate-500 mr-2">:</span>
                <span className="text-slate-200">
                  {order?.customer?.email || "-"}
                </span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-400">Alamat</span>
                <span className="text-slate-500 mr-2">:</span>
                <span className="text-slate-200">
                  {order?.customer?.address || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-slate-700 bg-slate-800 rounded-xl p-4 shadow-lg text-slate-200 col-span-1">
            <h3 className="text-lg font-bold text-brand-secondary border-b border-slate-700 pb-2 mb-3">
              Informasi Pesanan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Pesanan</span>
                <span className="font-semibold text-brand-accent">
                  {order?.number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tgl. Pesan</span>
                <span className="font-semibold text-slate-100">
                  {FormattedDateLong(order?.order_date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tgl. Fitting</span>
                <span className="font-semibold text-slate-100">
                  {FormattedDateLong(order?.fitting_date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tgl. Selesai</span>
                <span className="font-semibold text-slate-100">
                  {FormattedDateLong(order?.due_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-slate-700 bg-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-brand-secondary">
              Rincian Item Pesanan
            </h3>
          </div>

          <div className="flex-all-center w-full mt-1">
            <table className="table-auto w-full divide-y divide-slate-700 text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase font-semibold text-slate-200 tracking-wider">
                <tr>
                  <th className="py-3 px-3 text-center">No.</th>
                  <th className="py-3 px-3">Kode | Nama Bahan</th>
                  <th className="py-3 px-3">Kode | Jenis Pesanan</th>
                  <th className="py-3 px-3 text-center">Satuan</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 pr-3 text-right">price</th>
                  <th className="py-3 pr-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 bg-slate-800">
                {order.order_details.map((item, index) => {
                  const isShow = showDetail.includes(index);
                  let indexUpdate = null;
                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-700/50 transition"
                    >
                      <td className="px-3 py-2 text-center">{index + 1}</td>
                      <td className="px-3 py-2">
                        {item.material_name
                          ? `${item.material_code} | ${item.material_name}`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex w-full">
                          {isShow ? (
                            <div className="w-full">
                              <label className="flex p-1 w-full border-b">
                                {item.service_name}
                              </label>
                              <div className="flex items-start mt-2">
                                <span className="w-20">Progress :</span>
                                <div className="flex relative items-center ml-4">
                                  {progressStatus.map(
                                    (itemProgress, indexProgress) => {
                                      const isProgress = item.progress.some(
                                        (status) =>
                                          status.status === itemProgress,
                                      );
                                      if (
                                        item.current_progress.status ===
                                        itemProgress
                                      ) {
                                        indexUpdate = Number(indexProgress) + 1;
                                      }
                                      return (
                                        <div
                                          key={indexProgress}
                                          className="relative"
                                        >
                                          <div
                                            className={`h-0.5 absolute top-2.5 -left-4 z-10 w-16 ${isProgress ? "bg-teal-500" : "bg-gray-500"}`}
                                          ></div>
                                          <div className="flex justify-center ml-8 ">
                                            {isProgress ? (
                                              <button
                                                className={`flex-all-center z-20 w-5 rounded-full bg-white cursor-pointer ${isProgress ? "text-teal-500 hover:text-teal-400" : "text-gray-500"} `}
                                              >
                                                <Svg
                                                  title="Check"
                                                  c={
                                                    "w-5 fill-current border-white border rounded-full"
                                                  }
                                                >
                                                  <CheckSvg />
                                                </Svg>
                                              </button>
                                            ) : indexUpdate == indexProgress ? (
                                              <button
                                                className={`flex-all-center z-20 w-5 h-5 border rounded-full bg-teal-600 cursor-pointer text-white hover:bg-teal-400`}
                                              >
                                                <Svg
                                                  title="Update"
                                                  c={"w-4 fill-current"}
                                                >
                                                  <ReloadSvg />
                                                </Svg>
                                              </button>
                                            ) : (
                                              <div className="w-5 h-5 z-20 rounded-full border border-white bg-gray-600"></div>
                                            )}
                                          </div>
                                          <div className="flex-all-center ml-8">
                                            {itemProgress}
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full">
                              <span>{item.service_name}</span>
                            </div>
                          )}
                          {item.service_category === "tailoring" && (
                            <button
                              className="flex justify-center items-center w-9 mx-auto hover:text-stone-900 cursor-pointer"
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
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">{item.unit}</td>
                      <td className="px-3 py-2 text-center">{item.quantity}</td>
                      <td className="pr-3 py-2 text-right">
                        {rupiahFormatter.format(item.price)}
                      </td>
                      <td className="pr-3 py-2 text-right">
                        {rupiahFormatter.format(item.total)}
                      </td>
                    </tr>
                  );
                })}
                {newRow < 3 &&
                  Array.from({ length: newRow }).map((_, index) => (
                    <tr
                      key={index + order.order_details.length}
                      className="hover:bg-slate-700/50 transition h-8"
                    >
                      <td className="px-3 py-2 text-center"></td>
                      <td className="px-3 py-2 text-center"></td>
                      <td className="px-3 py-2"></td>
                      <td className="px-3 py-2 text-center"></td>
                      <td className="px-3 py-2 text-right"></td>
                      <td className="px-3 py-2 text-right"></td>
                      <td className="px-3 py-2 text-right"></td>
                    </tr>
                  ))}
                <tr className="h-10">
                  <td
                    className="px-3 py-2 align-top text-sm"
                    colSpan={5}
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
                  <td className="py-2 text-sm font-semibold text-right">
                    SUB TOTAL
                  </td>
                  <td className="pr-3 py-2 text-sm font-semibold text-right">
                    {rupiahFormatter.format(order.subtotal)}
                  </td>
                </tr>
                <tr className="h-10">
                  <td className="py-2 text-sm font-semibold text-right">
                    DISKON
                  </td>
                  <td className="pr-3 py-2 text-sm font-semibold text-right">
                    {rupiahFormatter.format(order.discount)}
                  </td>
                </tr>
                <tr className="h-10">
                  <td className="py-2 text-sm font-semibold text-right">
                    {order.payment_status == "paid"
                      ? "PEMBAYARAN"
                      : "UANG MUKA"}
                  </td>
                  <td className="pr-3 py-2 text-sm font-semibold text-right">
                    {rupiahFormatter.format(order.amount_paid)}
                  </td>
                </tr>
                {order.payment_status == "paid" ? (
                  <tr className="h-10 bg-brand-secondary">
                    <td
                      className="px-3 py-2 text-sm font-semibold text-center"
                      colSpan={2}
                    >
                      LUNAS
                    </td>
                  </tr>
                ) : (
                  <tr className="h-10 bg-brand-secondary">
                    <td className="py-2 text-sm font-semibold text-right">
                      SISA
                    </td>
                    <td className="pr-3 py-2 text-sm font-semibold text-right">
                      {rupiahFormatter.format(
                        order.grand_total - order.amount_paid,
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
