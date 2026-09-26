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
import Logo from "@/assets/Images/logo-riori-tailor-02.png";
import TextLogo from "@/assets/Images/text-riori-tailor.png";
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
  if (error)
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
        Error: {error}
      </div>
    );
  if (!customer)
    return <div className="p-4 text-slate-400">Data tidak ditemukan.</div>;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <HeaderShow
        titleShow="Data Pelanggan"
        url="/customers"
        deleteUrl="/api/customers"
        getId={customer.ulid}
        token={token}
      />

      {message && <SuccessMessage message={message} duration="3000" />}
      {failed && <FailedMessage message={failed} duration="3000" />}

      {/* Profile / Information Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="divide-y divide-slate-800/80 md:col-span-2 text-sm">
          <div className="flex flex-col sm:flex-row py-2.5">
            <span className="w-36 text-slate-400 font-medium">
              Kode Pelanggan
            </span>
            <span className="hidden sm:inline text-slate-600 mr-2">:</span>
            <span className="font-semibold text-indigo-400 font-mono">
              {customer.code}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row py-2.5">
            <span className="w-36 text-slate-400 font-medium">
              Nama Pelanggan
            </span>
            <span className="hidden sm:inline text-slate-600 mr-2">:</span>
            <span className="font-semibold text-white">{customer.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row py-2.5">
            <span className="w-36 text-slate-400 font-medium">Nomor Hp.</span>
            <span className="hidden sm:inline text-slate-600 mr-2">:</span>
            <span className="font-semibold text-slate-200">
              {customer.phone || "-"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row py-2.5">
            <span className="w-36 text-slate-400 font-medium">Email</span>
            <span className="hidden sm:inline text-slate-600 mr-2">:</span>
            <span className="font-semibold text-slate-200">
              {customer.email || "-"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row py-2.5">
            <span className="w-36 text-slate-400 font-medium">Alamat</span>
            <span className="hidden sm:inline text-slate-600 mr-2">:</span>
            <span className="font-semibold text-slate-200 whitespace-pre-line flex-1">
              {customer.address || "-"}
            </span>
          </div>
        </div>

        {/* Branding Logo display */}
        <div className="flex flex-col items-center justify-center p-6 border-t md:border-t-0 md:border-l border-slate-800/80">
          <img
            className="h-20 object-contain opacity-80"
            src={Logo}
            alt="Logo"
          />
          <img
            className="h-8 object-contain mt-2 opacity-60"
            src={TextLogo}
            alt="Text Logo"
          />
        </div>
      </div>

      {/* Measurement History Section */}
      <div className="space-y-4 pt-4">
        <HeaderIndex
          title="Riwayat Data Pengukuran"
          addTitle="Tambah Data Pengukuran"
          addUrl={`/dashboard/customers/measurement-histories/create/${customer.ulid}`}
        />

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-center w-12">No.</th>
                <th className="px-4 py-3 text-center w-28">Kategori</th>
                <th className="px-4 py-3 w-48">Jenis Pakaian</th>
                <th className="px-4 py-3 text-center w-36">Tanggal Ukur</th>
                <th className="px-4 py-3 w-48">Diukur Oleh</th>
                <th className="px-4 py-3">Detail Ukuran</th>
                <th className="px-4 py-3 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {!customer.measurement_histories ||
              customer.measurement_histories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
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
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-center text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-center uppercase font-medium text-slate-300">
                        {measurement.category}
                      </td>
                      <td className="px-4 py-3 uppercase text-indigo-400 font-medium">
                        {measurement.clothing_type?.type || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-300">
                        {FormattedDateShort(measurement.measured_at)}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {measurement.measured_by}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex w-full items-start justify-between">
                          {isShow ? (
                            <div className="w-full bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                              <div className="w-full border-b border-slate-800 pb-1 font-semibold text-slate-300 text-xs">
                                Detail Ukuran
                              </div>
                              <div className="mt-2 space-y-1">
                                {measurementDetails.map(
                                  (itemDetail, indexDetail) =>
                                    itemDetail.name && (
                                      <div
                                        key={indexDetail}
                                        className="flex items-center text-xs text-slate-400"
                                      >
                                        <span className="w-6 text-slate-500">
                                          {indexDetail + 1}.
                                        </span>
                                        <span className="w-36 text-slate-300">
                                          {itemDetail.name}
                                        </span>
                                        <span className="mx-1 text-slate-600">
                                          :
                                        </span>
                                        <span className="font-medium text-indigo-300">
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
                            <span className="text-xs text-slate-500 italic">
                              Klik panah untuk melihat detail
                            </span>
                          )}

                          <button
                            type="button"
                            className="ml-2 p-1 text-slate-400 hover:text-white cursor-pointer transition-colors"
                            onClick={() => handleBtnDetail(index)}
                          >
                            <Svg
                              title="Arrow"
                              c={
                                isShow
                                  ? "w-5 h-5 fill-current rotate-180 transition-transform"
                                  : "w-5 h-5 fill-current transition-transform"
                              }
                            >
                              <ArrowSvg />
                            </Svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
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
  );
}

// import React, { useState, useEffect } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import api from "@/apiService";

// import FormattedDateShort from "@/utils/FormattedDateShort";
// import HeaderShow from "@/components/HeaderShow";
// import TdAction from "@/components/TdAction";
// import HeaderIndex from "@/components/HeaderIndex";
// import SuccessMessage from "@/components/SuccessMessage";
// import FailedMessage from "@/components/FailedMessage";
// import LoadingData from "@/components/LoadingData";
// import LogoBlack from "@/assets/Images/logo-riori-tailor-black.png";
// import Svg from "@/components/Svg";
// import ArrowSvg from "@/assets/Svg/ArrowSvg";

// export default function Show() {
//   const { ulid } = useParams(); // id mewakili ULID
//   const { token } = useAuth();
//   const location = useLocation();
//   const message = location.state?.message;
//   const failed = location.state?.failed;

//   const [customer, setCustomer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDetail, setShowDetail] = useState([]);

//   const handleBtnDetail = (index) => {
//     if (showDetail.includes(index)) {
//       setShowDetail(showDetail.filter((i) => i !== index));
//     } else {
//       setShowDetail([...showDetail, index]);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/api/customers/${ulid}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setCustomer(response.data.customer);
//       } catch (err) {
//         if (!err?.response) {
//           setError("No Server Response..!!");
//         } else if (err.response?.status === 401) {
//           setError("Unauthorized..!!");
//         } else {
//           setError(
//             err.response?.data?.message || "Gagal memuat data pelanggan",
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [ulid, token, message]);

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
//   if (!customer) return <div className="p-4">Data tidak ditemukan.</div>;

//   return (
//     <div className="w-full max-w-6xl">
//       <HeaderShow
//         titleShow="Data Pelanggan"
//         url="/customers"
//         deleteUrl="/api/customers"
//         getId={customer.ulid}
//         token={token}
//       />

//       {message && <SuccessMessage message={message} duration="3000" />}
//       {failed && <FailedMessage message={failed} duration="3000" />}

//       <div className="mt-4">
//         <div className="grid grid-cols-3 gap-4 border rounded-xl bg-white p-4">
//           <div className="divide-y divide-gray-200 col-span-2">
//             <div className="flex w-full py-2">
//               <label className="w-32 text-gray-600">Kode Pelanggan</label>
//               <span>:</span>
//               <label className="ml-2 font-semibold text-gray-800">
//                 {customer.code}
//               </label>
//             </div>
//             <div className="flex w-full py-2">
//               <label className="w-32 text-gray-600">Nama Pelanggan</label>
//               <span>:</span>
//               <label className="ml-2 font-semibold text-gray-800">
//                 {customer.name}
//               </label>
//             </div>
//             <div className="flex w-full py-2">
//               <label className="w-32 text-gray-600">Nomor Hp.</label>
//               <span>:</span>
//               <label className="ml-2 font-semibold text-gray-800">
//                 {customer.phone || "-"}
//               </label>
//             </div>
//             <div className="flex w-full py-2">
//               <label className="w-32 text-gray-600">Email</label>
//               <span>:</span>
//               <label className="ml-2 font-semibold text-gray-800">
//                 {customer.email || "-"}
//               </label>
//             </div>
//             <div className="flex w-full py-2">
//               <label className="w-32 text-gray-600">Alamat</label>
//               <span>:</span>
//               <div className="ml-2 font-semibold text-gray-800 whitespace-pre-line">
//                 {customer.address || "-"}
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end items-center p-4 col-span-1">
//             <img className="h-32 object-contain" src={LogoBlack} alt="Logo" />
//           </div>
//         </div>

//         <div className="mt-10">
//           <HeaderIndex
//             title="Riwayat Data Pengukuran"
//             addTitle="Tambah Data Pengukuran"
//             addUrl={`/dashboard/customers/measurement-histories/create/${customer.ulid}`}
//           />
//           <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4 bg-white">
//             <table className="table-auto w-full divide-y divide-gray-200 text-left text-sm text-gray-500">
//               <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2 text-center w-12">No.</th>
//                   <th className="px-4 py-2 text-center w-28">Kategori</th>
//                   <th className="px-4 py-2 w-48">Jenis Pakaian</th>
//                   <th className="px-4 py-2 text-center w-36">Tanggal Ukur</th>
//                   <th className="px-4 py-2 w-48">Diukur Oleh</th>
//                   <th className="px-4 py-2">Detail Ukuran</th>
//                   <th className="px-4 py-2 text-center w-28">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {!customer.measurement_histories ||
//                 customer.measurement_histories.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="text-center py-4 text-gray-400">
//                       Belum ada riwayat pengukuran.
//                     </td>
//                   </tr>
//                 ) : (
//                   customer.measurement_histories.map((measurement, index) => {
//                     const isShow = showDetail.includes(index);
//                     let measurementDetails = [];
//                     try {
//                       measurementDetails =
//                         typeof measurement.measurement_details === "string"
//                           ? JSON.parse(measurement.measurement_details)
//                           : measurement.measurement_details || [];
//                     } catch (e) {
//                       measurementDetails = [];
//                     }

//                     return (
//                       <tr
//                         key={measurement.ulid || index}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-4 py-2 text-center">{index + 1}</td>
//                         <td className="px-4 py-2 text-center uppercase">
//                           {measurement.category}
//                         </td>
//                         <td className="px-4 py-2 uppercase">
//                           {measurement.clothing_type?.type || "-"}
//                         </td>
//                         <td className="px-4 py-2 text-center">
//                           {FormattedDateShort(measurement.measured_at)}
//                         </td>
//                         <td className="px-4 py-2">{measurement.measured_by}</td>
//                         <td className="px-4 py-2">
//                           <div className="flex w-full items-start justify-between">
//                             {isShow ? (
//                               <div className="w-full">
//                                 <div className="w-full border-b pb-1 font-semibold text-gray-700">
//                                   Detail Ukuran
//                                 </div>
//                                 <div className="mt-2 space-y-1">
//                                   {measurementDetails.map(
//                                     (itemDetail, indexDetail) =>
//                                       itemDetail.name && (
//                                         <div
//                                           key={indexDetail}
//                                           className="flex items-center text-xs"
//                                         >
//                                           <span className="w-6">
//                                             {indexDetail + 1}.
//                                           </span>
//                                           <span className="w-36">
//                                             {itemDetail.name}
//                                           </span>
//                                           <span className="mx-1">:</span>
//                                           <span className="font-medium">
//                                             {itemDetail.value
//                                               ? itemDetail.value
//                                               : "-"}{" "}
//                                             cm
//                                           </span>
//                                         </div>
//                                       ),
//                                   )}
//                                 </div>
//                               </div>
//                             ) : (
//                               <span className="text-xs text-gray-400">
//                                 Klik panah untuk melihat detail
//                               </span>
//                             )}

//                             <button
//                               type="button"
//                               className="ml-2 p-1 hover:text-stone-900 cursor-pointer"
//                               onClick={() => handleBtnDetail(index)}
//                             >
//                               <Svg
//                                 title="Arrow"
//                                 c={
//                                   isShow
//                                     ? "nav-svg w-5 fill-current rotate-180 transition-transform"
//                                     : "nav-svg w-5 fill-current transition-transform"
//                                 }
//                               >
//                                 <ArrowSvg />
//                               </Svg>
//                             </button>
//                           </div>
//                         </td>
//                         <td className="px-4 py-2 text-center">
//                           <TdAction
//                             showUrl={`/dashboard/customers/measurement-histories/${measurement.ulid}`}
//                             editUrl={`/dashboard/customers/measurement-histories/edit/${measurement.ulid}`}
//                             deleteUrl={`/api/measurement-histories`}
//                             deleteId={measurement.ulid}
//                             getToken={token}
//                             returnUrl={`/dashboard/customers/${customer.ulid}`}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
