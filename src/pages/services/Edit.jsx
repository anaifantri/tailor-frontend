import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const navigate = useNavigate();
  const { ulid } = useParams();
  const { token } = useAuth();

  const codeRef = useRef(null);

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [service, setService] = useState({
    ulid: "",
    code: "",
    name: "",
    category: "",
    base_price: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/services/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.service;
        setService({
          ulid: data.ulid || "",
          code: data.code || "",
          name: data.name || "",
          category: data.category || "",
          base_price: data.base_price || 0,
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    try {
      setProcessing(true);
      const response = await api.put(`/api/services/${ulid}`, service, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedType = response.data.service || response.data;
      navigate(`/dashboard/settings/services/${ulid}`, {
        state: {
          message: `Perubahan data jenis layanan dengan nama ${updatedType.name || service.name} berhasil..!!`,
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else if (err.response?.data?.errors) {
        setGetErrors(err.response.data.errors);
        codeRef.current?.focus();
        setErrorMessage("Update gagal, periksa kembali inputan Anda..!!");
      } else {
        setErrorMessage(
          err.response?.data?.message || "Gagal memperbarui data..!!",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Jenis layanan"
          backUrl="/dashboard/settings/services"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <div className="border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-6 mt-6 space-y-4 text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="w-44 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
              Kode
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="code"
                value={service.code}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Masukkan Kode"
                autoComplete="off"
                ref={codeRef}
                onChange={handleChange}
                required
              />
              {getErrors.code && (
                <span className="text-red-400 text-xs mt-1 block">
                  {getErrors.code[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="w-44 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
              Jenis layanan
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="name"
                value={service.name}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Masukkan jenis layanan"
                autoComplete="off"
                onChange={handleChange}
                required
              />
              {getErrors.name && (
                <span className="text-red-400 text-xs mt-1 block">
                  {getErrors.name[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="w-44 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
              Harga
            </label>
            <div className="flex-1">
              <input
                type="number"
                name="base_price"
                value={Number(service.base_price)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors spinner-disabled"
                autoComplete="off"
                placeholder="Masukkan harga"
                onChange={handleChange}
              />
              {getErrors.base_price && (
                <span className="text-red-400 text-xs mt-1 block">
                  {getErrors.base_price[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="w-44 text-sm font-medium text-slate-300 mb-2 sm:mb-0">
              Kategori Pakaian
            </label>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="tailoring"
                    onChange={handleChange}
                    checked={service.category === "tailoring"}
                    required
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <span>JAHIT</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="material_sale"
                    onChange={handleChange}
                    checked={service.category === "material_sale"}
                    required
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <span>PENJUALAN BAHAN</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="other"
                    onChange={handleChange}
                    checked={service.category === "other"}
                    required
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <span>LAINNYA</span>
                </label>
              </div>
              {getErrors.category && (
                <span className="text-red-400 text-xs mt-1 block">
                  {getErrors.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import api from "@/apiService";

// import HeaderEdit from "@/components/HeaderEdit";
// import LoadingData from "@/components/LoadingData";

// export default function Edit() {
//   const navigate = useNavigate();
//   const { ulid } = useParams();
//   const { token } = useAuth();

//   const codeRef = useRef(null);

//   const [processing, setProcessing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [getErrors, setGetErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");

//   const [service, setService] = useState({
//     ulid: "",
//     code: "",
//     name: "",
//     category: "",
//     base_price: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/api/services/${ulid}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = response.data.service;
//         setService({
//           ulid: data.ulid || "",
//           code: data.code || "",
//           name: data.name || "",
//           category: data.category || "",
//           base_price: data.base_price || 0,
//         });
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setService((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGetErrors({});
//     setErrorMessage("");

//     try {
//       setProcessing(true);
//       const response = await api.put(`/api/services/${ulid}`, service, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const updatedType = response.data.service || response.data;
//       navigate(`/dashboard/settings/services/${ulid}`, {
//         state: {
//           message: `Perubahan data jenis layanan dengan nama ${updatedType.name || service.name} berhasil..!!`,
//         },
//       });
//     } catch (err) {
//       if (!err?.response) {
//         setErrorMessage("No Server Response..!!");
//       } else if (err.response?.status === 401) {
//         setErrorMessage("Unauthorized..!!");
//       } else if (err.response?.data?.errors) {
//         setGetErrors(err.response.data.errors);
//         codeRef.current?.focus();
//         setErrorMessage("Update gagal, periksa kembali inputan Anda..!!");
//       } else {
//         setErrorMessage(
//           err.response?.data?.message || "Gagal memperbarui data..!!",
//         );
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="w-160">
//       <form onSubmit={handleSubmit}>
//         <HeaderEdit
//           titleEdit="Data Jenis layanan"
//           backUrl="/dashboard/settings/services"
//           getProcessing={processing}
//         />

//         {errorMessage && (
//           <div className="p-2 mt-2 text-sm text-red-600 bg-red-100 rounded">
//             {errorMessage}
//           </div>
//         )}

//         <div className="border border-gray-200 shadow-lg rounded-xl px-6 py-4 mt-4">
//           <div className="flex items-center">
//             <label className="w-44">Kode</label>
//             <input
//               type="text"
//               name="code"
//               value={service.code}
//               className="flex p-2 h-8 w-100 border rounded"
//               placeholder="Masukkan Kode"
//               autoComplete="off"
//               ref={codeRef}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {getErrors.code && (
//             <span className="flex w-full text-red-500 text-xs items-center mt-1">
//               {getErrors.code[0]}
//             </span>
//           )}

//           <div className="flex items-center mt-2">
//             <label className="w-44">Jenis layanan</label>
//             <input
//               type="text"
//               name="name"
//               value={service.name}
//               className="flex p-2 h-8 w-100 border rounded"
//               placeholder="Masukkan jenis layanan"
//               autoComplete="off"
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {getErrors.name && (
//             <span className="flex w-full text-red-500 text-xs items-center mt-1">
//               {getErrors.name[0]}
//             </span>
//           )}

//           <div className="flex items-center mt-2">
//             <label className="w-44">Harga</label>
//             <input
//               type="number"
//               name="base_price"
//               value={Number(service.base_price)}
//               className="flex p-2 h-8 w-100 border rounded spinner-disabled"
//               autoComplete="off"
//               placeholder="Masukkan harga"
//               onChange={handleChange}
//             />
//           </div>
//           {getErrors.base_price && (
//             <span className="flex w-full text-red-500 text-xs items-center mt-1">
//               {getErrors.base_price[0]}
//             </span>
//           )}

//           <div className="flex items-center mt-2">
//             <label className="w-44">Kategori Pakaian</label>
//             <input
//               type="radio"
//               name="category"
//               value="tailoring"
//               onChange={handleChange}
//               checked={service.category === "tailoring"}
//               required
//             />
//             <label className="ml-1">JAHIT</label>
//             <input
//               className="ml-4"
//               type="radio"
//               name="category"
//               value="material_sale"
//               onChange={handleChange}
//               checked={service.category === "material_sale"}
//               required
//             />
//             <label className="ml-1">PENJUALAN BAHAN</label>
//             <input
//               className="ml-4"
//               type="radio"
//               name="category"
//               value="other"
//               onChange={handleChange}
//               checked={service.category === "other"}
//               required
//             />
//             <label className="ml-1">LAINNYA</label>
//           </div>
//           {getErrors.category && (
//             <span className="flex w-full text-red-500 text-xs items-center mt-1">
//               {getErrors.category}
//             </span>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }
