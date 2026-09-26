import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import FormattedDateShort from "@/Utils/FormattedDateShort";

import HeaderShowAll from "@/components/HeaderShowAll";
import BtnPay from "@/components/BtnPay";
import BtnPdf from "@/components/BtnPdf";
import ShowMeasurementModal from "@/components/Modal";
import PaymentModal from "@/components/Modal";
import ProgressModal from "@/components/Modal";
import ShowProgressModal from "@/components/Modal";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";
import BcaSvg from "@/Assets/Svg/BcaSvg";
import BniSvg from "@/Assets/Svg/BniSvg";
import BriSvg from "@/Assets/Svg/BriSvg";
import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import BlackLogo from "@/components/BlackLogo";
import CheckSvg from "@/assets/Svg/CheckSvg";
import CloseSvg from "@/assets/Svg/CloseSvg";
import ReloadSvg from "@/assets/Svg/ReloadSvg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";
import BtnSave from "@/components/BtnSave";
import ShowSvg from "@/assets/Svg/ShowSvg";

export default function Show() {
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const { user, token } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const message = location.state?.message;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [downPayment, setDownPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const [balance, setBalance] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(null);
  const [progressNotes, setProgressNotes] = useState(null);
  const [productionProgress, setProductionProgress] = useState(null);
  const [orderDetailId, setOrderDetailId] = useState(null);
  const [progressDate, setProgressDate] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [showProgressModalOpen, setShowProgressModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(response.data.order);
        const totalPaid = response.data.order.payments.reduce(
          (sum, item) => sum + Number(item.amount_paid),
          0,
        );
        setTotalPayment(totalPaid);
        setBalance(
          response.data.order.total - totalPaid - response.data.order.discount,
        );
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
  }, [id, token]);

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
          title={`Detail Pesanan - ${order?.number || ""}`}
          backUrl="/dashboard/transactions/orders"
        />

        {message && <SuccessMessage message={message} duration="3000" />}

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-span-2 border border-slate-700 bg-slate-800 rounded-xl p-4 shadow-lg text-slate-200">
            <h3 className="text-lg font-bold text-indigo-400 border-b border-slate-700 pb-2 mb-3">
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
            <h3 className="text-lg font-bold text-indigo-400 border-b border-slate-700 pb-2 mb-3">
              Informasi Tanggal
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Tgl. Pesan:</span>
                <span className="font-semibold text-slate-100">
                  {FormattedDateLong(order?.order_date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tgl. Fitting:</span>
                <span className="font-semibold text-slate-100">
                  {FormattedDateShort(order?.fitting_date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tgl. Selesai:</span>
                <span className="font-semibold text-indigo-300">
                  {FormattedDateShort(order?.due_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-slate-700 bg-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-indigo-400">
              Rincian Item Pesanan
            </h3>
            <BtnPdf />
          </div>
          <table className="table-auto w-full divide-y divide-slate-700 text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-xs uppercase font-semibold text-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center">No.</th>
                <th className="py-3 px-3">Jenis Pakaian</th>
                <th className="py-3 px-3">Bahan / Kain</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Harga</th>
                <th className="py-3 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-800">
              {order?.order_details?.map((detail, index) => (
                <tr key={index} className="hover:bg-slate-700/50 transition">
                  <td className="px-3 py-2 text-center text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-100">
                    {detail?.clothing_type?.type}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {detail?.material?.name || "-"}
                  </td>
                  <td className="px-3 py-2 text-center text-slate-200">
                    {detail?.quantity}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-300">
                    Rp {Number(detail?.price).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-100 font-semibold">
                    Rp {(detail?.quantity * detail?.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900/80 font-medium text-slate-200 border-t border-slate-700">
              <tr>
                <td colSpan={4} className="px-3 py-2 text-right text-slate-400">
                  Total Harga:
                </td>
                <td
                  colSpan={2}
                  className="px-3 py-2 text-right text-slate-100 text-base font-bold"
                >
                  Rp {Number(order?.total).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="px-3 py-2 text-right text-slate-400">
                  Total Terbayar:
                </td>
                <td
                  colSpan={2}
                  className="px-3 py-2 text-right text-emerald-400 text-base font-bold"
                >
                  Rp {totalPayment.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="px-3 py-2 text-right text-slate-400">
                  Sisa Pembayaran:
                </td>
                <td
                  colSpan={2}
                  className="px-3 py-2 text-right text-indigo-400 text-base font-bold"
                >
                  Rp {Number(balance).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
