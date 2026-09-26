import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Show() {
  const { ulid } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialty, setSpecialty] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/tailors/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tailorData = response.data.tailor;
        setTailor(tailorData);

        if (Array.isArray(tailorData.specialty)) {
          setSpecialty(tailorData.specialty);
        } else if (typeof tailorData.specialty === "string") {
          setSpecialty(JSON.parse(tailorData.specialty));
        } else {
          setSpecialty([]);
        }
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response?.data?.message || "Data tidak ditemukan");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ulid, token]);

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <HeaderShow
        titleShow="Data Tukang Jahit"
        url="/tailors/tailors"
        deleteUrl="/api/tailors"
        getId={tailor.ulid}
        token={token}
      />
      {message && <SuccessMessage message={message} duration="3000" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Foto Profil Card */}
        <div className="flex flex-col items-center justify-center col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <span className="text-sm font-semibold text-slate-300 block mb-4">
            Foto Profil
          </span>
          <div className="w-60 h-60 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
            {tailor.photo ? (
              <img
                src={tailor.photo}
                alt={tailor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Svg title="Profile" c={"w-32 h-32 fill-slate-700"}>
                <ProfileSvg />
              </Svg>
            )}
          </div>
        </div>

        {/* Detail Informasi Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl col-span-2 p-6 shadow-xl">
          <div className="divide-y divide-slate-800/80 w-full text-sm">
            <div className="flex flex-col sm:flex-row py-3">
              <span className="w-36 text-slate-400 font-medium">
                ID Penjahit
              </span>
              <span className="hidden sm:inline text-slate-600 mr-2">:</span>
              <span className="font-semibold text-indigo-400 font-mono">
                {tailor.code || "-"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row py-3">
              <span className="w-36 text-slate-400 font-medium">
                Nama Penjahit
              </span>
              <span className="hidden sm:inline text-slate-600 mr-2">:</span>
              <span className="font-semibold text-white">
                {tailor.name || "-"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row py-3">
              <span className="w-36 text-slate-400 font-medium">Alamat</span>
              <span className="hidden sm:inline text-slate-600 mr-2">:</span>
              <span className="font-semibold text-slate-200">
                {tailor.address || "-"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row py-3">
              <span className="w-36 text-slate-400 font-medium">Nomor Hp.</span>
              <span className="hidden sm:inline text-slate-600 mr-2">:</span>
              <span className="font-semibold text-slate-200">
                {tailor.phone || "-"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row py-3">
              <span className="w-36 text-slate-400 font-medium">Email</span>
              <span className="hidden sm:inline text-slate-600 mr-2">:</span>
              <span className="font-semibold text-slate-200">
                {tailor.email || "-"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row py-3 items-start sm:items-center">
              <span className="w-36 text-slate-400 font-medium">Status</span>
              <span className="hidden sm:inline text-slate-600 mr-2">:</span>
              <div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    tailor.is_active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {tailor.is_active ? "Aktif" : "Non Aktif"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row py-4">
              <span className="w-36 text-slate-400 font-medium mb-2 sm:mb-0">
                Keahlian
              </span>
              <span className="hidden sm:inline text-slate-600 mr-2">:</span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specialty.length > 0 ? (
                  specialty.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center text-slate-200 font-medium bg-slate-950/50 px-3 py-1.5 rounded-xl border border-slate-800"
                    >
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 shadow-sm shadow-indigo-500"></span>
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 font-medium">-</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import api from "@/apiService";

// import Svg from "@/components/Svg";
// import HeaderShow from "@/components/HeaderShow";
// import SuccessMessage from "@/components/SuccessMessage";
// import LoadingData from "@/components/LoadingData";

// import ProfileSvg from "@/assets/Svg/ProfileSvg";

// export default function Show() {
//   const { ulid } = useParams();
//   const { token } = useAuth();
//   const location = useLocation();
//   const message = location.state?.message;

//   const [tailor, setTailor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [specialty, setSpecialty] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/api/tailors/${ulid}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const tailorData = response.data.tailor;
//         setTailor(tailorData);

//         if (Array.isArray(tailorData.specialty)) {
//           setSpecialty(tailorData.specialty);
//         } else if (typeof tailorData.specialty === "string") {
//           setSpecialty(JSON.parse(tailorData.specialty));
//         } else {
//           setSpecialty([]);
//         }
//       } catch (err) {
//         if (!err?.response) {
//           setError("No Server Response..!!");
//         } else if (err.response?.status === 401) {
//           setError("Unauthorized..!!");
//         } else {
//           setError(err.response?.data?.message || "Data tidak ditemukan");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [ulid, token]);

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="w-250">
//       <HeaderShow
//         titleShow="Data Tukang Jahit"
//         url="/tailors/tailors"
//         deleteUrl="/api/tailors"
//         getId={tailor.ulid}
//         token={token}
//       />
//       {message && <SuccessMessage message={message} duration="3000" />}

//       <div className="grid grid-cols-3 gap-2 mt-4">
//         <div className="flex-all-center col-span-1 border border-gray-200 shadow-lg rounded-xl px-8 py-6">
//           <div className="w-full text-center">
//             <span className="font-semibold block mb-4">Foto Profil</span>
//             {tailor.photo ? (
//               <img
//                 src={tailor.photo}
//                 alt={tailor.name}
//                 className="w-full object-cover rounded-lg shadow"
//               />
//             ) : (
//               <Svg title="Profile" c={"w-full fill-current mt-2"}>
//                 <ProfileSvg />
//               </Svg>
//             )}
//           </div>
//         </div>
//         <div className="flex border border-gray-200 shadow-lg rounded-xl col-span-2 p-8">
//           <div className="divide-y divide-gray-200 w-full">
//             <div className="flex w-full p-2">
//               <label className="flex w-32 text-gray-600">ID Penjahit</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">
//                 {tailor.code || "-"}
//               </label>
//             </div>
//             <div className="flex w-full p-2">
//               <label className="flex w-32 text-gray-600">Nama Penjahit</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">
//                 {tailor.name || "-"}
//               </label>
//             </div>
//             <div className="flex w-full p-2">
//               <label className="flex w-32 text-gray-600">Alamat</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">
//                 {tailor.address || "-"}
//               </label>
//             </div>
//             <div className="flex w-full p-2">
//               <label className="flex w-32 text-gray-600">Nomor Hp.</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">
//                 {tailor.phone || "-"}
//               </label>
//             </div>
//             <div className="flex w-full p-2">
//               <label className="flex w-32 text-gray-600">Email</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">
//                 {tailor.email || "-"}
//               </label>
//             </div>
//             <div className="flex w-full p-2">
//               <label className="flex w-32 text-gray-600">Status</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">
//                 {tailor.is_active ? "Aktif" : "Non Aktif"}
//               </label>
//             </div>
//             <div className="flex w-full px-2 py-3">
//               <label className="flex w-32 text-gray-600">Keahlian</label>
//               <label>:</label>
//               <div className="grid grid-cols-2 gap-2 ml-2">
//                 {specialty.length > 0 ? (
//                   specialty.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center font-semibold"
//                     >
//                       <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
//                       <span>{item}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <span className="text-gray-400 font-semibold">-</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
