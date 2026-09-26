import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";
import ImageSvg from "@/assets/Svg/ImageSvg";

export default function Show() {
  const { ulid } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/materials/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMaterial(response.data.material);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized!");
        } else {
          setError(err.response?.data?.message || "Gagal memuat data kain");
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
      <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: {error}
      </div>
    );
  if (!material) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <HeaderShow
        titleShow="Data Bahan"
        url="/settings/materials"
        deleteUrl={`/api/materials`}
        getId={material.ulid}
        token={token}
      />
      {message && <SuccessMessage message={message} duration="3000" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="flex flex-col items-center justify-center col-span-1 border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-6">
          <div className="text-center w-full">
            <span className="block font-semibold text-lg text-slate-200">
              Foto Kain
            </span>
            {material.photo ? (
              <img
                src={material.photo}
                alt={material.name}
                className="w-56 h-56 object-cover mx-auto rounded-full mt-6 border-2 border-slate-700 shadow-md"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-950 rounded-full mx-auto mt-6 border border-slate-800">
                <Svg
                  title="Profile"
                  c={"w-36 h-36 fill-current text-slate-600"}
                >
                  <ImageSvg />
                </Svg>
              </div>
            )}
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl col-span-1 md:col-span-2 p-6 text-sm sm:text-base">
          <div className="divide-y divide-slate-800/80 w-full text-slate-300">
            <div className="flex w-full py-3">
              <label className="w-36 text-slate-400 font-medium">
                Nomor Kain
              </label>
              <span className="mr-3 text-slate-500">:</span>
              <span className="font-semibold text-slate-100 font-mono">
                {material.code}
              </span>
            </div>
            <div className="flex w-full py-3">
              <label className="w-36 text-slate-400 font-medium">
                Nama Kain
              </label>
              <span className="mr-3 text-slate-500">:</span>
              <span className="font-semibold text-slate-100">
                {material.name}
              </span>
            </div>
            <div className="flex w-full py-3">
              <label className="w-36 text-slate-400 font-medium">Satuan</label>
              <span className="mr-3 text-slate-500">:</span>
              <span className="font-semibold text-slate-100 capitalize">
                {material.unit}
              </span>
            </div>
            <div className="flex w-full py-3">
              <label className="w-36 text-slate-400 font-medium">
                Stok Kain
              </label>
              <span className="mr-3 text-slate-500">:</span>
              <span className="font-semibold text-indigo-400">
                {material.stock} {material.unit}
              </span>
            </div>
            <div className="flex w-full py-3">
              <label className="w-36 text-slate-400 font-medium">
                Deskripsi
              </label>
              <span className="mr-3 text-slate-500">:</span>
              <span className="font-medium text-slate-300 flex-1">
                {material.description || "-"}
              </span>
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
// import ImageSvg from "@/assets/Svg/ImageSvg";

// export default function Show() {
//   const { ulid } = useParams();
//   const { token } = useAuth();
//   const location = useLocation();
//   const message = location.state?.message;

//   const [material, setMaterial] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/api/materials/${ulid}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setMaterial(response.data.material);
//       } catch (err) {
//         if (!err?.response) {
//           setError("No Server Response!");
//         } else if (err.response?.status === 401) {
//           setError("Unauthorized!");
//         } else {
//           setError(err.response?.data?.message || "Gagal memuat data kain");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [ulid, token]);

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
//   if (!material) return null;

//   return (
//     <div className="w-250">
//       <HeaderShow
//         titleShow="Data Kain"
//         url="/settings/materials"
//         deleteUrl={`/api/materials`}
//         getId={material.ulid}
//         token={token}
//       />
//       {message && <SuccessMessage message={message} duration="3000" />}

//       <div className="grid grid-cols-3 gap-2 mt-4">
//         <div className="flex-all-center col-span-1 border border-gray-200 shadow-lg rounded-xl px-6 py-2">
//           <div>
//             <span className="flex justify-center w-full font-semibold text-lg">
//               Foto Kain
//             </span>
//             {material.photo ? (
//               <img
//                 src={material.photo}
//                 alt={material.name}
//                 className="flex w-56 h-56 object-cover mx-auto rounded-full mt-4"
//               />
//             ) : (
//               <Svg title="Profile" c={"w-56 h-56 fill-current mt-4"}>
//                 <ImageSvg />
//               </Svg>
//             )}
//           </div>
//         </div>

//         <div className="flex border border-gray-200 shadow-lg rounded-xl col-span-2 p-8 text-md">
//           <div className="divide-y divide-gray-400 w-full">
//             <div className="flex w-full p-1">
//               <label className="flex w-32">Nomor Kain</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">{material.code}</label>
//             </div>
//             <div className="flex w-full p-1">
//               <label className="flex w-32">Nama Kain</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">{material.name}</label>
//             </div>
//             <div className="flex w-full p-1">
//               <label className="flex w-32">Satuan</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">{material.unit}</label>
//             </div>
//             <div className="flex w-full p-1">
//               <label className="flex w-32">Stok Kain</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold">
//                 {material.stock} {material.unit}
//               </label>
//             </div>
//             <div className="flex w-full p-1">
//               <label className="flex w-32">Deskripsi</label>
//               <label>:</label>
//               <label className="flex ml-2 font-semibold w-80">
//                 {material.description || "-"}
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
