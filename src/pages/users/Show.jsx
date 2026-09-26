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

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/users/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data);
      } catch (err) {
        if (!err?.response) {
          setError("Tidak ada respon dari server.");
        } else if (err.response?.status === 401) {
          setError("Akses tidak diizinkan (Unauthorized).");
        } else {
          setError(
            err.response.data?.message || "Terjadi kesalahan saat memuat data.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ulid, token]);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderShow
        titleShow="Data Pengguna"
        url="/settings/users"
        deleteUrl="/api/users"
        getId={user?.ulid}
        token={token}
      />

      {message && <SuccessMessage message={message} duration="3000" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Sisi Kiri - Foto Profil */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
          <span className="text-sm font-semibold text-slate-400 mb-4 block">
            Foto Profil
          </span>
          {user?.photo ? (
            <img
              src={user.photo}
              alt="Foto Profil"
              className="w-60 h-60 rounded-full object-cover ring-4 ring-indigo-500/30 shadow-xl"
            />
          ) : (
            <div className="w-60 h-60 rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center ring-4 ring-indigo-500/20">
              <Svg title="Profile" c="w-24 h-24 fill-current">
                <ProfileSvg />
              </Svg>
            </div>
          )}
        </div>

        {/* Sisi Kanan - Informasi Pengguna */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl md:col-span-2 divide-y divide-slate-800 text-sm">
          <div className="pb-3">
            <span className="text-slate-500 block mb-1">Nama Lengkap</span>
            <span className="font-semibold text-base text-white">
              {user?.name}
            </span>
          </div>

          <div className="py-3">
            <span className="text-slate-500 block mb-1">Username</span>
            <span className="font-semibold text-slate-200">
              {user?.username}
            </span>
          </div>

          <div className="py-3">
            <span className="text-slate-500 block mb-1">Email</span>
            <span className="font-semibold text-slate-200">{user?.email}</span>
          </div>

          <div className="py-3">
            <span className="text-slate-500 block mb-1">Nomor HP</span>
            <span className="font-semibold text-slate-200">{user?.phone}</span>
          </div>

          <div className="pt-3">
            <span className="text-slate-500 block mb-1">Status</span>
            <span
              className={`inline-block px-3 py-1 rounded-lg text-[10px] font-semibold ${
                user?.is_active
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {user?.is_active ? "Aktif" : "Non Aktif"}
            </span>
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
//   const { ulid } = useParams(); // URL Param 'id' mewakili 'ulid'
//   const { token } = useAuth();
//   const location = useLocation();
//   const message = location.state?.message;

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/api/users/${ulid}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setUser(response.data.data);
//       } catch (err) {
//         if (!err?.response) {
//           setError("Tidak ada respon dari server.");
//         } else if (err.response?.status === 401) {
//           setError("Akses tidak diizinkan (Unauthorized).");
//         } else {
//           setError(
//             err.response.data?.message || "Terjadi kesalahan saat memuat data.",
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [ulid, token]);

//   if (loading) {
//     return <LoadingData />;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500 font-semibold">Error: {error}</div>;
//   }

//   return (
//     <div>
//       <HeaderShow
//         titleShow="Data Pengguna"
//         url="/settings/users"
//         deleteUrl="/api/users"
//         getId={user?.ulid}
//         token={token}
//       />

//       {message && <SuccessMessage message={message} duration="3000" />}

//       <div className="grid grid-cols-3 gap-4 mt-4 w-full">
//         {/* Sisi Kiri - Foto Profil */}
//         <div className="flex-all-center col-span-1">
//           <div>
//             <label className="flex-all-center w-full font-semibold">
//               Foto Profil
//             </label>
//             {user?.photo ? (
//               <img
//                 src={user.photo}
//                 alt="Foto Profil"
//                 className="flex border border-slate-200 shadow-xl w-56 h-56 mx-2 mt-2 rounded-full object-cover"
//               />
//             ) : (
//               <Svg title="Profile" c={"w-56 h-56 fill-current mx-2 mt-2"}>
//                 <ProfileSvg />
//               </Svg>
//             )}
//           </div>
//         </div>

//         {/* Sisi Kanan - Informasi Pengguna */}
//         <div className="divide-y divide-gray-200 border border-slate-200 shadow-xl rounded-xl p-4 col-span-2 w-full text-base">
//           <div className="pb-2">
//             <label className="flex w-full text-sm text-gray-500">
//               Nama Lengkap
//             </label>
//             <label className="flex font-semibold text-gray-800">
//               {user?.name}
//             </label>
//           </div>

//           <div className="py-2">
//             <label className="flex text-sm text-gray-500">Username</label>
//             <label className="flex font-semibold text-gray-800">
//               {user?.username}
//             </label>
//           </div>

//           <div className="py-2">
//             <label className="flex text-sm text-gray-500">Email</label>
//             <label className="flex font-semibold text-gray-800">
//               {user?.email}
//             </label>
//           </div>

//           <div className="py-2">
//             <label className="flex text-sm text-gray-500">Nomor HP</label>
//             <label className="flex font-semibold text-gray-800">
//               {user?.phone}
//             </label>
//           </div>

//           <div className="pt-2">
//             <label className="flex text-sm text-gray-500">Status</label>
//             <span
//               className={`inline-block px-2 py-0,5 rounded text-sm font-semibold mt-1 ${
//                 user?.is_active
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//               }`}
//             >
//               {user?.is_active ? "Aktif" : "Non Aktif"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
