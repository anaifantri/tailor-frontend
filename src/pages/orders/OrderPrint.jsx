import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import LogoBlack from "@/assets/Images/logo-riori-black.png";
import TextBlack from "@/assets/Images/text-riori-black.png";
import Svg from "@/components/Svg";
import QRCode from "@/components/QRCode";
import PrintSvg from "@/assets/Svg/PrintSvg";

import LoadingData from "@/components/LoadingData";

export default function OrderPrint() {
  const { token } = useAuth();
  const { id } = useParams();
  const handlePrint = () => {
    window.print();
  };

  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [grandTotal, setGrandTotal] = useState(null);
  const [downPayment, setDownPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/orders/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(response.data.order);
        setCustomer(response.data.order.customer);
        setOrderDetails(response.data.order.order_details);
        const getSubTotal = response.data.order.total;
        const getDiscount = response.data.order.discount;
        const getTax = response.data.order.tax;
        const payments = response.data.order.payments;
        const getDownPayment =
          payments.find(
            (payment) => payment.payment_status === "down_payment",
          ) || 0;
        const getGrandTotal =
          Number(getSubTotal) -
          Number(getDownPayment) -
          Number(getDiscount) +
          Number(getTax);
        console.log(getGrandTotal);
        setDownPayment(getDownPayment);
        setGrandTotal(getGrandTotal);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
          console.log(err.response.data.message);
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

  return (
    <div>
      <div className="flex w-full justify-end p-2">
        <button
          onClick={handlePrint}
          className="flex-all-center button-primary mx-1 print:hidden cursor-pointer"
        >
          <Svg title="Pdf" c={"w-5 fill-current mx-1"}>
            <PrintSvg />
          </Svg>
          <span className="mx-1">Cetak</span>
        </button>
      </div>

      <div className="print-container">
        <div className="nota-page font-mono text-xs w-card h-card p-print-p box-border border border-dashed border-gray-300 mb-8 print:mb-0 print:border-none print:relative print:break-after-page relative">
          <div className="grid grid-cols-4 border-b border-dashed border-black w-full">
            <div className="flex col-span-3">
              <div className="w-28 pb-1">
                <div className="flex-all-center w-full">
                  <img className="h-10" src={LogoBlack} alt="" />
                </div>
                <div className="flex-all-center w-full">
                  <img className="h-5" src={TextBlack} alt="" />
                </div>
              </div>
              <div className="text-xs font-semibold">
                <span className="flex">RIORI TAILOR & TEXTILE</span>
                <span className="flex">
                  Jl. Teuku Umar No. 65 E - Denpasar, Bali
                </span>
                <span className="flex">WA +62 851 0144 2323</span>
                <span className="flex">
                  Email : info@rioritailor.com | www.rioritailor.com
                </span>
              </div>
            </div>
            <div className="col-span-1 mx-2">
              <h3 className="text-xl font-bold tracking-wider w-full border-b border-dashed">
                NOTA PESANAN
              </h3>
              <p className="text-base">No. Nota : {order?.number}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="col-span-2 border border-dashed rounded-lg p-2">
              <div className="flex items-center">
                <label className="w-28">Nama Pelanggan</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-xs">
                  {customer.name}
                </label>
              </div>
              <div className="flex items-start ">
                <label className="w-28">Alamat</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-xs w-100">
                  {customer.address}
                </label>
              </div>
              <div className="flex items-center ">
                <label className="w-28">No. Handphone</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-xs">
                  {customer.phone}
                </label>
              </div>
            </div>
            <div className="border border-dashed rounded-xl p-2 texl-lg col-span-1">
              <div className="flex items-center">
                <label className="w-28">Tgl. Pesan</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-xs">
                  {FormattedDateLong(order.order_date)}
                </label>
              </div>
              <div className="flex items-center ">
                <label className="w-28">Tgl. Fitting</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-xs">
                  {FormattedDateLong(order.fitting_date)}
                </label>
              </div>
              <div className="flex items-center ">
                <label className="w-28">Tgl. Selesai</label>
                <label>:</label>
                <label className="ml-2 font-semibold text-xs">
                  {FormattedDateLong(order.due_date)}
                </label>
              </div>
            </div>
          </div>

          <table className="w-full mt-2 border-collapse divide-y divide-gray-300 divide-dashed">
            <thead className="uppercase">
              <tr className="text-sm">
                <th className="px-4 border border-dashed w-10">No.</th>
                <th className="px-4 border border-dashed w-36">Nomor Kain</th>
                <th className="px-4 border border-dashed">Jenis Pesanan</th>
                <th className="px-4 border border-dashed w-20">Jumlah</th>
                <th className="px-4 border border-dashed w-32">Harga</th>
                <th className="px-4 border border-dashed w-36">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail, index) => {
                const total = detail.quantity * detail.price;
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors text-sm"
                  >
                    <td className=" text-center border-l border-dashed px-2">
                      {index + 1}.
                    </td>
                    <td className=" text-center  border-l border-dashed px-2">
                      {detail.material.code}
                    </td>
                    <td className=" border-l border-dashed px-2">
                      {detail.clothing_type.type}
                    </td>
                    <td className="text-center border-l border-dashed px-2">
                      {detail.quantity}
                    </td>
                    <td className="border-l border-dashed px-4 text-right">
                      {Number(detail.price).toLocaleString()}
                    </td>
                    <td className="border-x border-dashed px-4 text-right">
                      {Number(total).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  className="border border-dashed px-2"
                  rowSpan={5}
                  colSpan={4}
                >
                  <div>
                    <span className="flex font-semibold">Catatan :</span>
                    <div className="flex">
                      <span className="flex w-2">1.</span>
                      <span className="flex text-left ml-2 w-130">
                        Lebih dari 2 bulan barang tidak diambil, segala
                        kehilangan / kerusakan dan lain-lain diluar tanggung
                        jawab kami
                      </span>
                    </div>
                    <div className="flex">
                      <span className="flex w-2">2.</span>
                      <span className="flex ml-2 w-130">
                        Dengan nota tersebut barang bisa diterima
                      </span>
                    </div>
                    <div className="flex">
                      <span className="flex w-2">3.</span>
                      <span className="flex ml-2 w-130">
                        Kehilangan nota pengambilan bukan tanggung jawab kami
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="text-sm">
                <td className="text-right border border-dashed px-2 font-semibold">
                  SUB TOTAL
                </td>
                <td className="border border-dashed px-4 text-right font-semibold">
                  {Number(order?.total).toLocaleString()}
                </td>
              </tr>
              <tr className="text-sm">
                <td className="text-right border border-dashed px-2 font-semibold">
                  DP
                </td>
                <td className="border border-dashed px-4 text-right font-semibold">
                  {Number(downPayment).toLocaleString()}
                </td>
              </tr>
              <tr className="text-sm">
                <td className="text-right border border-dashed px-2 font-semibold">
                  DISKON
                </td>
                <td className="border border-dashed px-4 text-right font-semibold">
                  {Number(order?.discount).toLocaleString()}
                </td>
              </tr>
              <tr className="text-sm">
                <td className="text-right border border-dashed px-2 font-semibold">
                  GRAND TOTAL
                </td>
                <td className="border border-dashed px-4 text-right font-semibold">
                  {Number(grandTotal).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="absolute flex bottom-6 text-center ">
            <div className="w-28">
              Hormat kami,
              <div className="mt-10 border-b border-dotted border-black w-32 mx-auto"></div>
            </div>
            <div className="ml-10 w-28">
              Pelanggan,
              <div className="mt-10 border-b border-dotted border-black w-32 mx-auto"></div>
            </div>
          </div>

          <div className="absolute bottom-4 right-8">
            <QRCode
              url={
                "http://localhost:5173/dashboard/transactions/orders/order-print/" +
                id
              }
              size={100}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          @page {
            size: 9.5in 5.5in;
            margin: 0;
          }
          /* Hilangkan sisa margin bawaan browser */
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 9.5in;
          }
          /* Pastikan elemen terakhir tidak membuat halaman kosong baru di beberapa browser */
          .nota-page:last-child {
            break-after: avoid;
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
}
