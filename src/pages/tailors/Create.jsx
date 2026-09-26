import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderCreate from "@/components/HeaderCreate";
import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const nameRef = useRef();
  const fileInputRef = useRef(null);

  const [specialty, setSpecialty] = useState([]);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    photo: null,
    is_active: 1,
  });

  // Fetch daftar Jenis Pakaian (Clothing Types) dari Database
  useEffect(() => {
    const fetchClothingTypes = async () => {
      try {
        setLoadingSpecialties(true);
        const response = await api.get("/api/clothing-types", {
          params: { per_page: 100 },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.data || response.data || [];
        const types = data.map((item) => item.type).filter(Boolean);
        setSpecialtiesList(types);
      } catch (err) {
        console.error("Gagal memuat jenis pakaian:", err);
      } finally {
        setLoadingSpecialties(false);
      }
    };

    if (token) {
      fetchClothingTypes();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [name]: file }));
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCbChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSpecialty((prev) => [...prev, value]);
    } else {
      setSpecialty((prev) => prev.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    if (specialty.length === 0) {
      alert("Silakan pilih minimal 1 keahlian");
      return;
    }

    const dataTailor = new FormData();
    dataTailor.append("name", formData.name);
    if (formData.email) dataTailor.append("email", formData.email);
    dataTailor.append("phone", formData.phone);
    if (formData.address) dataTailor.append("address", formData.address);
    dataTailor.append("is_active", formData.is_active);

    specialty.forEach((item, index) => {
      dataTailor.append(`specialty[${index}]`, item);
    });

    if (formData.photo) {
      dataTailor.append("photo", formData.photo);
    }

    try {
      setProcessing(true);
      const response = await api.post("/api/tailors", dataTailor, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const tailor = response.data.tailor;
      navigate(`/dashboard/tailors/tailors/${tailor.ulid}`, {
        state: {
          message: "Penambahan data tukang jahit berhasil..!!",
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else if (err.response?.data?.errors) {
        setGetErrors(err.response.data.errors);
        nameRef.current?.focus();
      } else {
        setErrorMessage("Gagal menyimpan data..!!");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Tukang Jahit"
          backUrl="/dashboard/tailors/tailors"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 my-4 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Card Photo Preview */}
          <div className="flex flex-col items-center justify-center col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="w-full flex flex-col items-center">
              <div className="w-60 h-60 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Svg title="Profile" c={"w-32 h-32 fill-slate-700"}>
                    <ProfileSvg />
                  </Svg>
                )}
              </div>
              <div className="mt-4">
                <input
                  type="file"
                  name="photo"
                  ref={fileInputRef}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/jpg,image/png"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  Pilih Foto
                </button>
              </div>
              {getErrors.photo && (
                <span className="text-rose-400 text-xs mt-2 text-center">
                  {getErrors.photo[0]}
                </span>
              )}
            </div>
          </div>

          {/* Card Input Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl col-span-2 p-6 shadow-xl">
            <div className="space-y-4">
              {/* Nama */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Nama <span className="text-rose-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Input Nama Lengkap"
                    autoComplete="off"
                    ref={nameRef}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {getErrors.name && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.name[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Alamat */}
              <div className="flex flex-col sm:flex-row sm:items-start">
                <label className="w-36 text-sm font-medium text-slate-300 mt-2 mb-1 sm:mb-0">
                  Alamat
                </label>
                <div className="flex-1">
                  <textarea
                    name="address"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Input Alamat"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {getErrors.address && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.address[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Nomor Hp */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Nomor Hp. <span className="text-rose-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="phone"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Input Nomor Hp."
                    autoComplete="off"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {getErrors.phone && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.phone[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Email
                </label>
                <div className="flex-1">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Input email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {getErrors.email && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.email[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Status
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input
                      type="radio"
                      name="is_active"
                      value={1}
                      checked={Number(formData.is_active) === 1}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-slate-700 bg-slate-950 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input
                      type="radio"
                      name="is_active"
                      value={0}
                      checked={Number(formData.is_active) === 0}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-slate-700 bg-slate-950 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    <span>Non Aktif</span>
                  </label>
                </div>
              </div>
              {getErrors.is_active && (
                <span className="text-rose-400 text-xs block mt-1">
                  {getErrors.is_active[0]}
                </span>
              )}

              {/* Keahlian */}
              <div className="flex flex-col sm:flex-row sm:items-start pt-2">
                <label className="w-36 text-sm font-medium text-slate-300 mt-1 mb-1 sm:mb-0">
                  Keahlian
                </label>
                <div className="flex-1">
                  {loadingSpecialties ? (
                    <span className="text-slate-500 text-sm">
                      Memuat keahlian...
                    </span>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/50 p-4 border border-slate-800 rounded-xl">
                      {specialtiesList.map((item, index) => (
                        <label
                          className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            value={item}
                            checked={specialty.includes(item)}
                            onChange={handleCbChange}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {getErrors.specialty && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.specialty[0]}
                    </span>
                  )}
                </div>
              </div>
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

// import Svg from "@/components/Svg";
// import HeaderCreate from "@/components/HeaderCreate";
// import ProfileSvg from "@/assets/Svg/ProfileSvg";

// export default function Create() {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [processing, setProcessing] = useState(false);

//   const nameRef = useRef();
//   const fileInputRef = useRef(null);

//   const [specialty, setSpecialty] = useState([]);
//   const [specialtiesList, setSpecialtiesList] = useState([]);
//   const [loadingSpecialties, setLoadingSpecialties] = useState(true);

//   const [errorMessage, setErrorMessage] = useState("");
//   const [getErrors, setGetErrors] = useState({});
//   const [photoPreview, setPhotoPreview] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     email: "",
//     phone: "",
//     photo: null,
//     is_active: 1,
//   });

//   // Fetch daftar Jenis Pakaian (Clothing Types) dari Database
//   useEffect(() => {
//     const fetchClothingTypes = async () => {
//       try {
//         setLoadingSpecialties(true);
//         const response = await api.get("/api/clothing-types", {
//           params: { per_page: 100 }, // Mengambil seluruh daftar jenis pakaian
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = response.data?.data || response.data || [];
//         // Mengambil kolom 'type' dari setiap record clothingType
//         const types = data.map((item) => item.type).filter(Boolean);
//         setSpecialtiesList(types);
//       } catch (err) {
//         console.error("Gagal memuat jenis pakaian:", err);
//       } finally {
//         setLoadingSpecialties(false);
//       }
//     };

//     if (token) {
//       fetchClothingTypes();
//     }
//   }, [token]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file") {
//       const file = files[0];
//       if (file) {
//         setFormData((prev) => ({ ...prev, [name]: file }));
//         setPhotoPreview(URL.createObjectURL(file));
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCbChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSpecialty((prev) => [...prev, value]);
//     } else {
//       setSpecialty((prev) => prev.filter((item) => item !== value));
//     }
//   };

//   useEffect(() => {
//     nameRef.current?.focus();
//   }, []);

//   const handlePhotoClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGetErrors({});
//     setErrorMessage("");

//     if (specialty.length === 0) {
//       alert("Silakan pilih minimal 1 keahlian");
//       return;
//     }

//     const dataTailor = new FormData();
//     dataTailor.append("name", formData.name);
//     if (formData.email) dataTailor.append("email", formData.email);
//     dataTailor.append("phone", formData.phone);
//     if (formData.address) dataTailor.append("address", formData.address);
//     dataTailor.append("is_active", formData.is_active);

//     specialty.forEach((item, index) => {
//       dataTailor.append(`specialty[${index}]`, item);
//     });

//     if (formData.photo) {
//       dataTailor.append("photo", formData.photo);
//     }

//     try {
//       setProcessing(true);
//       const response = await api.post("/api/tailors", dataTailor, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const tailor = response.data.tailor;
//       navigate(`/dashboard/tailors/tailors/${tailor.ulid}`, {
//         state: {
//           message: "Penambahan data tukang jahit berhasil..!!",
//         },
//       });
//     } catch (err) {
//       if (!err?.response) {
//         setErrorMessage("No Server Response..!!");
//       } else if (err.response?.status === 401) {
//         setErrorMessage("Unauthorized..!!");
//       } else if (err.response?.data?.errors) {
//         setGetErrors(err.response.data.errors);
//         nameRef.current?.focus();
//       } else {
//         setErrorMessage("Gagal menyimpan data..!!");
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="w-250">
//       <form onSubmit={handleSubmit}>
//         <HeaderCreate
//           titleCreate="Data Tukang Jahit"
//           backUrl="/dashboard/tailors/tailors"
//           getProcessing={processing}
//         />
//         {errorMessage && (
//           <div className="p-2 mb-2 text-sm text-red-600 bg-red-100 rounded">
//             {errorMessage}
//           </div>
//         )}
//         <div className="grid grid-cols-3 gap-2 mt-4">
//           <div className="flex-all-center col-span-1 border border-gray-200 shadow-lg rounded-xl p-10">
//             <div>
//               <div className="flex-all-center">
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Foto Profil"
//                     className="flex w-full mx-2 rounded"
//                   />
//                 ) : (
//                   <Svg title="Profile" c={"w-full fill-current mx-2"}>
//                     <ProfileSvg />
//                   </Svg>
//                 )}
//               </div>
//               <div className="flex-all-center mt-4">
//                 <input
//                   type="file"
//                   name="photo"
//                   ref={fileInputRef}
//                   onChange={handleChange}
//                   style={{ display: "none" }}
//                   accept="image/jpeg,image/jpg,image/png"
//                 />
//                 <button
//                   type="button"
//                   className="flex-all-center bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 mt-2 cursor-pointer"
//                   onClick={handlePhotoClick}
//                 >
//                   Pilih Foto
//                 </button>
//               </div>
//               {getErrors.photo && (
//                 <span className="flex w-full text-red-500 text-xs items-center mt-2">
//                   {getErrors.photo[0]}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="flex border border-gray-200 shadow-lg rounded-xl col-span-2 p-4">
//             <div>
//               <div className="flex items-center">
//                 <label className="w-36">Nama</label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="flex p-2 h-8 w-120 border rounded"
//                   placeholder="Input Nama Lengkap"
//                   autoComplete="off"
//                   ref={nameRef}
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               {getErrors.name && (
//                 <span className="flex w-full text-red-500 text-xs items-center mt-1">
//                   {getErrors.name[0]}
//                 </span>
//               )}

//               <div className="flex mt-2">
//                 <label className="w-36">Alamat</label>
//                 <textarea
//                   name="address"
//                   className="flex p-1 w-120 border rounded"
//                   placeholder="Input Alamat"
//                   rows={3}
//                   value={formData.address}
//                   onChange={handleChange}
//                 />
//               </div>
//               {getErrors.address && (
//                 <span className="flex w-full text-red-500 text-xs items-center mt-1">
//                   {getErrors.address[0]}
//                 </span>
//               )}

//               <div className="flex items-center mt-2">
//                 <label className="w-36">Nomor Hp.</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   className="flex p-2 h-8 w-120 border rounded"
//                   placeholder="Input Nomor Hp."
//                   autoComplete="off"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               {getErrors.phone && (
//                 <span className="flex w-full text-red-500 text-xs items-center mt-1">
//                   {getErrors.phone[0]}
//                 </span>
//               )}

//               <div className="flex items-center mt-2">
//                 <label className="w-36">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   className="flex p-2 h-8 w-120 border rounded"
//                   placeholder="Input email"
//                   autoComplete="off"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </div>
//               {getErrors.email && (
//                 <span className="flex w-full text-red-500 text-xs items-center mt-1">
//                   {getErrors.email[0]}
//                 </span>
//               )}

//               <div className="flex items-center mt-2">
//                 <label className="w-36">Status</label>
//                 <input
//                   type="radio"
//                   name="is_active"
//                   value={1}
//                   checked={Number(formData.is_active) === 1}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                 />
//                 <label className="ml-2">Aktif</label>
//                 <input
//                   type="radio"
//                   name="is_active"
//                   value={0}
//                   checked={Number(formData.is_active) === 0}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-4"
//                 />
//                 <label className="ml-2">Non Aktif</label>
//               </div>
//               {getErrors.is_active && (
//                 <span className="flex w-full text-red-500 text-xs items-center mt-1">
//                   {getErrors.is_active[0]}
//                 </span>
//               )}

//               <div className="flex mt-2">
//                 <label className="w-36">Keahlian</label>
//                 {loadingSpecialties ? (
//                   <span className="text-gray-400 text-sm">
//                     Memuat keahlian...
//                   </span>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-4">
//                     {specialtiesList.map((item, index) => (
//                       <div className="flex mt-2" key={index}>
//                         <input
//                           type="checkbox"
//                           value={item}
//                           checked={specialty.includes(item)}
//                           onChange={handleCbChange}
//                           className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
//                         />
//                         <label className="ml-2">{item}</label>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {getErrors.specialty && (
//                 <span className="flex w-full text-red-500 text-xs items-center mt-1">
//                   {getErrors.specialty[0]}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
