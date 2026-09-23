import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateShort from "@/utils/FormattedDateShort";
import HeaderShow from "@/components/HeaderShow";
import TdAction from "@/components/TdAction";
import HeaderIndex from "@/components/HeaderIndex";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "@/components/LoadingData";
import LogoBlack from "@/assets/Images/logo-riori-tailor-black.png";
import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";

export default function Show() {
  const { ulid } = useParams(); // id mewakili ULID
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const failed = location.state?.failed;

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetail, setShowDetail] = useState([]);

  const handleBtnDetail = (index) => {
    if (showDetail.includes(index)) {
      setShowDetail(showDetail.filter((i) => i !== index));
    } else {
      setShowDetail([...showDetail, index]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/customers/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomer(response.data.customer);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(
            err.response?.data?.message || "Gagal memuat data pelanggan",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ulid, token, message]);

  if (loading) return <LoadingData />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!customer) return <div className="p-4">Data tidak ditemukan.</div>;

  return (
    <div className="w-full max-w-6xl">
      <HeaderShow
        titleShow="Data Pelanggan"
        url="/customers"
        deleteUrl="/api/customers"
        getId={customer.ulid}
        token={token}
      />

      {message && <SuccessMessage message={message} duration="3000" />}
      {failed && <FailedMessage message={failed} duration="3000" />}

      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4 border rounded-xl bg-white p-4">
          <div className="divide-y divide-gray-200 col-span-2">
            <div className="flex w-full py-2">
              <label className="w-32 text-gray-600">Kode Pelanggan</label>
              <span>:</span>
              <label className="ml-2 font-semibold text-gray-800">
                {customer.code}
              </label>
            </div>
            <div className="flex w-full py-2">
              <label className="w-32 text-gray-600">Nama Pelanggan</label>
              <span>:</span>
              <label className="ml-2 font-semibold text-gray-800">
                {customer.name}
              </label>
            </div>
            <div className="flex w-full py-2">
              <label className="w-32 text-gray-600">Nomor Hp.</label>
              <span>:</span>
              <label className="ml-2 font-semibold text-gray-800">
                {customer.phone || "-"}
              </label>
            </div>
            <div className="flex w-full py-2">
              <label className="w-32 text-gray-600">Email</label>
              <span>:</span>
              <label className="ml-2 font-semibold text-gray-800">
                {customer.email || "-"}
              </label>
            </div>
            <div className="flex w-full py-2">
              <label className="w-32 text-gray-600">Alamat</label>
              <span>:</span>
              <div className="ml-2 font-semibold text-gray-800 whitespace-pre-line">
                {customer.address || "-"}
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 col-span-1">
            <img className="h-32 object-contain" src={LogoBlack} alt="Logo" />
          </div>
        </div>

        <div className="mt-10">
          <HeaderIndex
            title="Riwayat Data Pengukuran"
            addTitle="Tambah Data Pengukuran"
            addUrl={`/dashboard/customers/measurement-histories/create/${customer.ulid}`}
          />
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4 bg-white">
            <table className="table-auto w-full divide-y divide-gray-200 text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-center w-12">No.</th>
                  <th className="px-4 py-2 text-center w-28">Kategori</th>
                  <th className="px-4 py-2 w-48">Jenis Pakaian</th>
                  <th className="px-4 py-2 text-center w-36">Tanggal Ukur</th>
                  <th className="px-4 py-2 w-48">Diukur Oleh</th>
                  <th className="px-4 py-2">Detail Ukuran</th>
                  <th className="px-4 py-2 text-center w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!customer.measurement_histories ||
                customer.measurement_histories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-400">
                      Belum ada riwayat pengukuran.
                    </td>
                  </tr>
                ) : (
                  customer.measurement_histories.map((measurement, index) => {
                    const isShow = showDetail.includes(index);
                    let measurementDetails = [];
                    try {
                      measurementDetails =
                        typeof measurement.measurement_details === "string"
                          ? JSON.parse(measurement.measurement_details)
                          : measurement.measurement_details || [];
                    } catch (e) {
                      measurementDetails = [];
                    }

                    return (
                      <tr
                        key={measurement.ulid || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-2 text-center">{index + 1}</td>
                        <td className="px-4 py-2 text-center uppercase">
                          {measurement.category}
                        </td>
                        <td className="px-4 py-2 uppercase">
                          {measurement.clothing_type?.type || "-"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {FormattedDateShort(measurement.measured_at)}
                        </td>
                        <td className="px-4 py-2">{measurement.measured_by}</td>
                        <td className="px-4 py-2">
                          <div className="flex w-full items-start justify-between">
                            {isShow ? (
                              <div className="w-full">
                                <div className="w-full border-b pb-1 font-semibold text-gray-700">
                                  Detail Ukuran
                                </div>
                                <div className="mt-2 space-y-1">
                                  {measurementDetails.map(
                                    (itemDetail, indexDetail) =>
                                      itemDetail.name && (
                                        <div
                                          key={indexDetail}
                                          className="flex items-center text-xs"
                                        >
                                          <span className="w-6">
                                            {indexDetail + 1}.
                                          </span>
                                          <span className="w-36">
                                            {itemDetail.name}
                                          </span>
                                          <span className="mx-1">:</span>
                                          <span className="font-medium">
                                            {itemDetail.value
                                              ? itemDetail.value
                                              : "-"}{" "}
                                            cm
                                          </span>
                                        </div>
                                      ),
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Klik panah untuk melihat detail
                              </span>
                            )}

                            <button
                              type="button"
                              className="ml-2 p-1 hover:text-stone-900 cursor-pointer"
                              onClick={() => handleBtnDetail(index)}
                            >
                              <Svg
                                title="Arrow"
                                c={
                                  isShow
                                    ? "nav-svg w-5 fill-current rotate-180 transition-transform"
                                    : "nav-svg w-5 fill-current transition-transform"
                                }
                              >
                                <ArrowSvg />
                              </Svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <TdAction
                            showUrl={`/dashboard/customers/measurement-histories/${measurement.ulid}`}
                            editUrl={`/dashboard/customers/measurement-histories/edit/${measurement.ulid}`}
                            deleteUrl={`/api/measurement-histories`}
                            deleteId={measurement.ulid}
                            getToken={token}
                            returnUrl={`/dashboard/customers/${customer.ulid}`}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
