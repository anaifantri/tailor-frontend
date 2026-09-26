import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";
import HeaderCreate from "@/components/HeaderCreate";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const codeRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    base_price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    codeRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    try {
      setProcessing(true);
      const response = await api.post("/api/services", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const service = response.data.service;
      navigate(`/dashboard/settings/services/${service.ulid}`, {
        state: {
          message: `Penambahan data jenis Layanan dengan nama ${service.name} berhasil..!!`,
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
      } else {
        setErrorMessage(
          err.response?.data?.message || "Gagal menyimpan data..!!",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Jenis Layanan"
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Masukkan kode"
                autoComplete="off"
                ref={codeRef}
                value={formData.code}
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
              Jenis Layanan
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Masukkan jenis Layanan"
                autoComplete="off"
                value={formData.name}
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors spinner-disabled"
                autoComplete="off"
                placeholder="Masukkan harga dasar"
                value={formData.base_price}
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
                    checked={formData.category === "tailoring"}
                    onChange={handleChange}
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
                    checked={formData.category === "material_sale"}
                    onChange={handleChange}
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
                    checked={formData.category === "other"}
                    onChange={handleChange}
                    required
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <span>LAINNYA</span>
                </label>
              </div>
              {getErrors.category && (
                <span className="text-red-400 text-xs mt-1 block">
                  {getErrors.category[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import api from "@/apiService";
// import HeaderCreate from "@/components/HeaderCreate";

// export default function Create() {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [processing, setProcessing] = useState(false);

//   const codeRef = useRef(null);

//   const [errorMessage, setErrorMessage] = useState("");
//   const [getErrors, setGetErrors] = useState({});

//   const [formData, setFormData] = useState({
//     code: "",
//     name: "",
//     category: "",
//     base_price: 0,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     codeRef.current?.focus();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGetErrors({});
//     setErrorMessage("");

//     try {
//       setProcessing(true);
//       const response = await api.post("/api/services", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const service = response.data.service;
//       navigate(`/dashboard/settings/services/${service.ulid}`, {
//         state: {
//           message: `Penambahan data jenis Layanan dengan nama ${service.name} berhasil..!!`,
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
//       } else {
//         setErrorMessage(
//           err.response?.data?.message || "Gagal menyimpan data..!!",
//         );
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="w-160">
//       <form onSubmit={handleSubmit}>
//         <HeaderCreate
//           titleCreate="Data Jenis Layanan"
//           backUrl="/dashboard/settings/services"
//           getProcessing={processing}
//         />

//         {errorMessage && (
//           <div className="p-2 mt-2 text-sm text-red-600 bg-red-100 rounded">
//             {errorMessage}
//           </div>
//         )}

//         <div className="border border-gray-200 shadow-lg rounded-xl p-4 mt-4">
//           <div className="flex items-center">
//             <label className="w-44">Kode</label>
//             <input
//               type="text"
//               name="code"
//               className="flex p-2 h-8 w-100 border rounded"
//               placeholder="Masukkan kode"
//               autoComplete="off"
//               ref={codeRef}
//               value={formData.code}
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
//             <label className="w-44">Jenis Layanan</label>
//             <input
//               type="text"
//               name="name"
//               className="flex p-2 h-8 w-100 border rounded"
//               placeholder="Masukkan jenis Layanan"
//               autoComplete="off"
//               value={formData.name}
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
//               className="flex p-2 h-8 w-100 border rounded spinner-disabled"
//               autoComplete="off"
//               placeholder="Masukkan harga dasar"
//               value={formData.base_price}
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
//               checked={formData.category === "tailoring"}
//               onChange={handleChange}
//               required
//             />
//             <label className="ml-1">JAHIT</label>
//             <input
//               className="ml-4"
//               type="radio"
//               name="category"
//               value="material_sale"
//               checked={formData.category === "material_sale"}
//               onChange={handleChange}
//               required
//             />
//             <label className="ml-1">PENJUALAN BAHAN</label>
//             <input
//               className="ml-4"
//               type="radio"
//               name="category"
//               value="other"
//               checked={formData.category === "other"}
//               onChange={handleChange}
//               required
//             />
//             <label className="ml-1">LAINNYA</label>
//           </div>
//           {getErrors.category && (
//             <span className="flex w-full text-red-500 text-xs items-center mt-1">
//               {getErrors.category[0]}
//             </span>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }
