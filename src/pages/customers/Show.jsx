import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateShort from "@/utils/FormattedDateShort";
import HeaderShow from "@/components/HeaderShow";
import TdAction from "@/components/TdAction";
import HeaderIndex from "@/components/HeaderIndex";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";
import LogoBlack from "@/assets/Images/logo-riori-tailor-black.png";
import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
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
        const response = await api.get("/api/customers/" + id, {
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
      <div className="w-300">
        <HeaderShow
          titleShow="Data Pelanggan"
          url="/customers"
          getId={customer.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        {/* <div className="flex-all-center mt-4 w-full"> */}
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-4 border rounded-xl">
            <div className="divide-y divide-gray-400 p-2 col-span-2">
              <div className="flex w-full p-1">
                <label className="flex w-32">Kode Pelanggan</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {customer.code}
                </label>
              </div>
              <div className="flex w-full p-1">
                <label className="flex w-32">Nama Pelanggan</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {customer.name}
                </label>
              </div>
              <div className="flex w-full p-1">
                <label className="flex w-32">Nomor Hp.</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {customer.phone}
                </label>
              </div>
              <div className="flex w-full p-1">
                <label className="flex w-32">Email</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {customer.email}
                </label>
              </div>
              <div className="flex w-full p-1">
                <label className="flex w-32">Alamat</label>
                <label>:</label>
                <label className="flex ml-2 w-125 h-16 font-semibold border border-gray-200 rounded-md px-2">
                  {customer.address}
                </label>
              </div>
              <div></div>
            </div>
            <div className="flex justify-end p-4 col-span-1">
              <img className="flex h-40" src={LogoBlack} alt="" />
            </div>
          </div>
          <div className="mt-10">
            <HeaderIndex
              title="Riwayat Data Pengukuran"
              addTitle="Tambah Data Pengukuran"
              addUrl={
                "/dashboard/customers/measurement-histories/create/" +
                customer.hashed_id
              }
            />
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4">
              <table className="table-auto w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-center w-6">No.</th>
                    <th className="px-4 py-2 text-center w-24">Katagori</th>
                    <th className="px-4 py-2 w-56">Jenis Pakaian</th>
                    <th className="px-4 py-2 text-center w-36">Tanggal Ukur</th>
                    <th className="px-4 py-2 w-48">Diukur Oleh</th>
                    <th className="px-4 py-2">Detail Ukuran</th>
                    <th className="px-4 py-2 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customer &&
                    customer.measurement_histories.map((measurement, index) => {
                      const isShow = showDetail.includes(index);
                      const measurementDetails = JSON.parse(
                        measurement.measurement_details,
                      );
                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-1 text-center">{index + 1}</td>
                          <td className="px-4 py-1 text-center uppercase">
                            {measurement.category}
                          </td>
                          <td className="px-4 py-1 uppercase">
                            {measurement.clothing_type.type}
                          </td>
                          <td className="px-4 py-1 text-center">
                            {FormattedDateShort(measurement.measured_at)}
                          </td>
                          <td className="px-4 py-1">
                            {measurement.measured_by}
                          </td>
                          <td className="px-4 py-1">
                            <div className="flex w-full">
                              {isShow ? (
                                <div className="w-full">
                                  <div className="w-full border-b py-1">
                                    Detail Ukuran
                                  </div>
                                  <div className="mt-2">
                                    {measurementDetails.map(
                                      (itemDetail, indexDetail) => {
                                        return (
                                          itemDetail.name != "" && (
                                            <div
                                              key={indexDetail}
                                              className="flex items-start"
                                            >
                                              <label className="w-6">
                                                {indexDetail + 1}.{" "}
                                              </label>
                                              <label className="w-36">
                                                {itemDetail.name}
                                              </label>
                                              <label>=</label>
                                              <label className="ml-2">
                                                {itemDetail.value
                                                  ? itemDetail.value
                                                  : "-"}
                                              </label>
                                              <label className="flex w-6 ml-2">
                                                cm
                                              </label>
                                            </div>
                                          )
                                        );
                                      },
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full">
                                  Tampilkan Detail Ukuran
                                </div>
                              )}

                              <button
                                className="flex justify-center items-center w-4 mx-auto hover:text-stone-900 cursor-pointer"
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
                          <td className="px-4 py-1 text-center">
                            <TdAction
                              showUrl={`/dashboard/customers/measurement-histories/${measurement.hashed_id}`}
                              editUrl={`/dashboard/customers/measurement-histories/edit/${measurement.hashed_id}`}
                              deleteUrl="/api/measurement-histories/delete/"
                              deleteId={measurement.hashed_id}
                              getToken={token}
                              returnUrl={"/dashboard/customers/" + id}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
