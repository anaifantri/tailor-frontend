import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

export default function Show() {
  const { ulid } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const [service, setService] = useState({
    ulid: "",
    code: "",
    name: "",
    category: "",
    base_price: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/services/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setService(response.data.service);
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

    if (ulid && token) {
      fetchData();
    }
  }, [ulid, token]);

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <HeaderShow
        titleShow={`Jenis Layanan ${service.name}`}
        url="/settings/services"
        deleteUrl="/api/services"
        getId={service.ulid}
        token={token}
      />

      {message && <SuccessMessage message={message} duration="3000" />}

      <div className="divide-y divide-slate-800/80 border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-6 mt-6 text-sm sm:text-base text-slate-300">
        <div className="flex w-full py-3">
          <label className="w-48 text-slate-400 font-medium">Kode</label>
          <span className="font-semibold text-slate-100 font-mono">
            {service.code}
          </span>
        </div>
        <div className="flex w-full py-3">
          <label className="w-48 text-slate-400 font-medium">
            Jenis Layanan
          </label>
          <span className="font-semibold text-slate-100">{service.name}</span>
        </div>
        <div className="flex w-full py-3">
          <label className="w-48 text-slate-400 font-medium">
            Kategori Pakaian
          </label>
          <span className="font-semibold text-slate-100 uppercase">
            {service.category}
          </span>
        </div>
        <div className="flex w-full py-3">
          <label className="w-48 text-slate-400 font-medium">Harga Dasar</label>
          <span className="font-semibold text-indigo-400">
            {Number(service.base_price) !== 0
              ? Number(service.base_price).toLocaleString()
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import api from "@/apiService";

// import HeaderShow from "@/components/HeaderShow";
// import SuccessMessage from "@/components/SuccessMessage";
// import LoadingData from "@/components/LoadingData";

// export default function Show() {
//   const { ulid } = useParams();
//   const { token } = useAuth();
//   const location = useLocation();
//   const message = location.state?.message;

//   const [service, setService] = useState({
//     ulid: "",
//     code: "",
//     name: "",
//     category: "",
//     base_price: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/api/services/${ulid}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setService(response.data.service);
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

//     if (ulid && token) {
//       fetchData();
//     }
//   }, [ulid, token]);

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="w-200">
//       <HeaderShow
//         titleShow={`Jenis Layanan ${service.name}`}
//         url="/settings/services"
//         deleteUrl="/api/services"
//         getId={service.ulid}
//         token={token}
//       />

//       {message && <SuccessMessage message={message} duration="3000" />}

//       <div className="divide-y divide-gray-200 border border-gray-200 shadow-lg rounded-xl px-6 py-2 mt-4">
//         <div className="w-full p-2">
//           <label className="flex w-48">Kode</label>
//           <label className="flex font-semibold">{service.code}</label>
//         </div>
//         <div className="w-full p-2">
//           <label className="flex w-48">Jenis Layanan</label>
//           <label className="flex font-semibold">{service.name}</label>
//         </div>
//         <div className="w-full p-2">
//           <label className="flex w-48">Kategori Pakaian</label>
//           <label className="flex font-semibold uppercase">
//             {service.category}
//           </label>
//         </div>
//         <div className="w-full p-2">
//           <label className="flex w-48">Harga Dasar</label>
//           <label className="flex font-semibold">
//             {Number(service.base_price) !== 0
//               ? Number(service.base_price).toLocaleString()
//               : "-"}
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// }
