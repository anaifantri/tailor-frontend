import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { ulid } = useParams(); // id mewakili ULID pelanggan
  const { token } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [editCustomer, setEditCustomer] = useState({
    ulid: "",
    code: "",
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCustomer((prev) => ({ ...prev, [name]: value }));
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
        const data = response.data.customer;
        setEditCustomer({
          ulid: data.ulid || "",
          code: data.code || "",
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
          phone: data.phone || "",
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

    fetchData();
  }, [ulid, token]);

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
        Error: {error}
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    const payload = {
      name: editCustomer.name,
      address: editCustomer.address,
      email: editCustomer.email,
      phone: editCustomer.phone,
    };

    try {
      setProcessing(true);
      // RESTful PUT method
      const response = await api.put(`/api/customers/${ulid}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const customer = response.data;
      navigate("/dashboard/customers/" + customer.ulid, {
        state: {
          message: `Berhasil mengubah data pelanggan dengan nama ${customer.name}..!!`,
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
        setErrorMessage("Update gagal, periksa inputan Anda..!!");
      } else {
        setErrorMessage(err.response?.data?.message || "Update gagal..!!");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Pelanggan"
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
            <label className="block text-sm font-medium text-slate-400">
              Kode Pelanggan
            </label>
            <input
              type="text"
              disabled
              value={editCustomer.code}
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950/50 border border-slate-800/80 rounded-xl text-slate-500 font-mono text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Nama Pelanggan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan nama pelanggan"
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              autoComplete="off"
              ref={nameRef}
              onChange={handleChange}
              value={editCustomer.name}
              required
            />
            {getErrors.name && (
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
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Masukkan alamat"
              rows={3}
              onChange={handleChange}
              value={editCustomer.address}
            />
            {getErrors.address && (
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
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Masukkan Nomor Hp."
              autoComplete="off"
              onChange={handleChange}
              value={editCustomer.phone}
              required
            />
            {getErrors.phone && (
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
              className="mt-1.5 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Masukkan alamat email"
              autoComplete="off"
              onChange={handleChange}
              value={editCustomer.email}
            />
            {getErrors.email && (
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

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "@/apiService";
// import { useAuth } from "@/context/AuthContext";

// import HeaderEdit from "@/components/HeaderEdit";
// import LoadingData from "@/components/LoadingData";

// export default function Edit() {
//   const { ulid } = useParams(); // id mewakili ULID pelanggan
//   const { token } = useAuth();
//   const navigate = useNavigate();
//   const nameRef = useRef(null);

//   const [getErrors, setGetErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");

//   const [editCustomer, setEditCustomer] = useState({
//     ulid: "",
//     code: "",
//     name: "",
//     address: "",
//     email: "",
//     phone: "",
//   });

//   const [processing, setProcessing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditCustomer((prev) => ({ ...prev, [name]: value }));
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
//         const data = response.data.customer;
//         setEditCustomer({
//           ulid: data.ulid || "",
//           code: data.code || "",
//           name: data.name || "",
//           address: data.address || "",
//           email: data.email || "",
//           phone: data.phone || "",
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

//     fetchData();
//   }, [ulid, token]);

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGetErrors({});
//     setErrorMessage("");

//     const payload = {
//       name: editCustomer.name,
//       address: editCustomer.address,
//       email: editCustomer.email,
//       phone: editCustomer.phone,
//     };

//     try {
//       setProcessing(true);
//       // RESTful PUT method
//       const response = await api.put(`/api/customers/${ulid}`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const customer = response.data;
//       navigate("/dashboard/customers/" + customer.ulid, {
//         state: {
//           message: `Berhasil mengubah data pelanggan dengan nama ${customer.name}..!!`,
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
//         setErrorMessage("Update gagal, periksa inputan Anda..!!");
//       } else {
//         setErrorMessage(err.response?.data?.message || "Update gagal..!!");
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="w-160">
//       <form onSubmit={handleSubmit}>
//         <HeaderEdit
//           titleEdit="Data Pelanggan"
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
//             Kode Pelanggan
//           </label>
//           <input
//             type="text"
//             disabled
//             value={editCustomer.code}
//             className="flex p-2 h-9 w-full mt-1 bg-gray-100 border rounded-md text-gray-500 cursor-not-allowed"
//           />

//           <label className="block text-sm font-medium text-gray-700 mt-4">
//             Nama Pelanggan *
//           </label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Masukkan nama pelanggan"
//             className="flex p-2 h-9 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             autoComplete="off"
//             ref={nameRef}
//             onChange={handleChange}
//             value={editCustomer.name}
//             required
//           />
//           {getErrors.name && (
//             <span className="flex w-full text-red-500 text-xs mt-1">
//               {getErrors.name[0]}
//             </span>
//           )}

//           <label className="flex mt-4 text-sm font-medium text-gray-700">
//             Alamat
//           </label>
//           <textarea
//             name="address"
//             className="flex p-2 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             placeholder="Masukkan alamat"
//             rows={3}
//             onChange={handleChange}
//             value={editCustomer.address}
//           />
//           {getErrors.address && (
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
//             className="flex p-2 h-9 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             placeholder="Masukkan Nomor Hp."
//             autoComplete="off"
//             onChange={handleChange}
//             value={editCustomer.phone}
//             required
//           />
//           {getErrors.phone && (
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
//             className="flex p-2 h-9 w-full mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//             placeholder="Masukkan alamat email"
//             autoComplete="off"
//             onChange={handleChange}
//             value={editCustomer.email}
//           />
//           {getErrors.email && (
//             <span className="flex w-full text-red-500 text-xs mt-1">
//               {getErrors.email[0]}
//             </span>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }
