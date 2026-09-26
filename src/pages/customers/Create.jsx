import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";
import HeaderCreate from "@/components/HeaderCreate";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const nameRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    try {
      setProcessing(true);
      const response = await api.post("/api/customers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const customer = response.data.customer;
      navigate("/dashboard/customers/" + customer.ulid, {
        state: {
          message: `Penambahan data pelanggan dengan nama ${customer.name} berhasil..!!`,
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
        nameRef.current?.focus();
      } else {
        setErrorMessage(
          err.response?.data?.message || "Terjadi kesalahan server",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Pelanggan"
          backUrl="/dashboard/customers"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 my-4 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-4 shadow-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Nama Pelanggan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Masukkan Nama Pelanggan"
              autoComplete="off"
              ref={nameRef}
              onChange={handleChange}
              required
            />
            {getErrors?.name && (
              <span className="text-rose-400 text-xs block mt-1">
                {getErrors.name[0]}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Alamat
            </label>
            <textarea
              name="address"
              value={formData.address}
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Masukkan Alamat"
              rows={3}
              onChange={handleChange}
            />
            {getErrors?.address && (
              <span className="text-rose-400 text-xs block mt-1">
                {getErrors.address[0]}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Nomor Hp. <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Contoh: 08123456789"
              autoComplete="off"
              onChange={handleChange}
              required
            />
            {getErrors?.phone && (
              <span className="text-rose-400 text-xs block mt-1">
                {getErrors.phone[0]}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Masukkan email"
              autoComplete="off"
              onChange={handleChange}
            />
            {getErrors?.email && (
              <span className="text-rose-400 text-xs block mt-1">
                {getErrors.email[0]}
              </span>
            )}
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

//   const nameRef = useRef(null);

//   const [errorMessage, setErrorMessage] = useState("");
//   const [getErrors, setGetErrors] = useState({});

//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     email: "",
//     phone: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     nameRef.current?.focus();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGetErrors({});
//     setErrorMessage("");

//     try {
//       setProcessing(true);
//       const response = await api.post("/api/customers", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const customer = response.data.customer;
//       navigate("/dashboard/customers/" + customer.ulid, {
//         state: {
//           message: `Penambahan data pelanggan dengan nama ${customer.name} berhasil..!!`,
//         },
//       });
//     } catch (err) {
//       if (!err?.response) {
//         setErrorMessage("No Server Response..!!");
//       } else if (err.response?.status === 401) {
//         setErrorMessage("Unauthorized..!!");
//       } else if (err.response?.status === 422) {
//         setGetErrors(err.response.data.errors || {});
//         nameRef.current?.focus();
//       } else {
//         setErrorMessage(
//           err.response?.data?.message || "Terjadi kesalahan server",
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
//           titleCreate="Data Pelanggan"
//           backUrl="/dashboard/customers"
//           getProcessing={processing}
//         />

//         {errorMessage && (
//           <div className="p-3 mt-3 text-sm text-red-700 bg-red-100 rounded-lg">
//             {errorMessage}
//           </div>
//         )}

//         <div className="border border-slate-200 shadow-xl rounded-xl p-4 mt-4 bg-white">
//           <label className="block text-sm font-medium text-gray-700">
//             Nama Pelanggan *
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             className="flex p-2 h-9 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             placeholder="Masukkan Nama Pelanggan"
//             autoComplete="off"
//             ref={nameRef}
//             onChange={handleChange}
//             required
//           />
//           {getErrors?.name && (
//             <span className="flex w-full text-red-500 text-xs mt-1">
//               {getErrors.name[0]}
//             </span>
//           )}

//           <label className="flex mt-4 text-sm font-medium text-gray-700">
//             Alamat
//           </label>
//           <textarea
//             name="address"
//             value={formData.address}
//             className="flex p-2 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             placeholder="Masukkan Alamat"
//             rows={3}
//             onChange={handleChange}
//           />
//           {getErrors?.address && (
//             <span className="flex w-full text-red-500 text-xs mt-1">
//               {getErrors.address[0]}
//             </span>
//           )}

//           <label className="flex mt-4 text-sm font-medium text-gray-700">
//             Nomor Hp.
//           </label>
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             className="flex p-2 h-9 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             placeholder="Contoh: 08123456789"
//             autoComplete="off"
//             onChange={handleChange}
//             required
//           />
//           {getErrors?.phone && (
//             <span className="flex w-full text-red-500 text-xs mt-1">
//               {getErrors.phone[0]}
//             </span>
//           )}

//           <label className="flex mt-4 text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             className="flex p-2 h-9 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             placeholder="Masukkan email"
//             autoComplete="off"
//             onChange={handleChange}
//           />
//           {getErrors?.email && (
//             <span className="flex w-full text-red-500 text-xs mt-1">
//               {getErrors.email[0]}
//             </span>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }
