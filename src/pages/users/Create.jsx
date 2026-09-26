import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import HeaderCreate from "@/components/HeaderCreate";
import Svg from "@/components/Svg";
import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const nameRef = useRef(null);
  const fileInputRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [errorPassword, setErrorPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    photo: null,
    is_active: 1,
  });

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, photo: file }));
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else if (name === "password") {
      setFormData((prev) => ({ ...prev, password: value }));
      if (errorPassword) setErrorPassword("");
    } else if (name === "confirm_password") {
      setFormData((prev) => ({ ...prev, confirm_password: value }));
      if (formData.password !== value) {
        setErrorPassword("Password tidak cocok");
      } else {
        setErrorPassword("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    if (formData.password !== formData.confirm_password) {
      setErrorPassword("Password tidak cocok");
      alert("Konfirmasi password tidak cocok..!!");
      confirmPasswordRef.current?.focus();
      return;
    }

    setErrorPassword("");

    const dataUser = new FormData();
    dataUser.append("name", formData.name);
    dataUser.append("username", formData.username);
    dataUser.append("email", formData.email);
    dataUser.append("phone", formData.phone);
    dataUser.append("password", formData.password);
    dataUser.append("is_active", formData.is_active);

    if (formData.photo) {
      dataUser.append("photo", formData.photo);
    }

    try {
      setProcessing(true);

      const response = await api.post("/api/users", dataUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newUlid = response.data.data.ulid;

      navigate("/dashboard/settings/users/" + newUlid, {
        state: {
          message: "Penambahan user baru berhasil..!!",
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("Tidak ada respon dari server..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Sesi habis, silakan login kembali..!!");
      } else if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
        nameRef.current?.focus();
      } else {
        setErrorMessage(
          err.response.data?.message || "Terjadi kesalahan server.",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Pengguna"
          backUrl="/dashboard/settings/users"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Sisi Kiri - Foto Profil */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview Foto"
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

            <input
              type="file"
              name="photo"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: "none" }}
              accept="image/jpeg,image/png,image/jpg"
            />

            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              onClick={handlePhotoClick}
            >
              Pilih Foto
            </button>

            {getErrors.photo && (
              <span className="text-red-400 text-sm mt-2 block">
                {getErrors.photo[0]}
              </span>
            )}
          </div>

          {/* Sisi Kanan - Form Fields */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Masukkan Nama Lengkap"
                autoComplete="off"
                ref={nameRef}
                value={formData.name}
                onChange={handleChange}
                required
              />
              {getErrors.name && (
                <span className="text-red-400 text-sm mt-1 block">
                  {getErrors.name[0]}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Masukkan username (min. 6 karakter)"
                autoComplete="off"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {getErrors.username && (
                <span className="text-red-400 text-sm mt-1 block">
                  {getErrors.username[0]}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Input Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Konfirmasi Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  ref={confirmPasswordRef}
                  required
                />
              </div>
            </div>
            {errorPassword && (
              <p className="text-red-400 text-sm mt-1">{errorPassword}</p>
            )}
            {getErrors.password && (
              <span className="text-red-400 text-sm mt-1 block">
                {getErrors.password[0]}
              </span>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nomor HP
                </label>
                <input
                  type="text"
                  name="phone"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan Nomor HP"
                  autoComplete="off"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {getErrors.phone && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {getErrors.phone[0]}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Masukkan email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {getErrors.email && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {getErrors.email[0]}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Pilih Status
              </label>
              <div className="flex items-center gap-6 mt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="is_active"
                    id="active_1"
                    value={1}
                    onChange={handleChange}
                    checked={Number(formData.is_active) === 1}
                    className="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                  />
                  <span>Aktif</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    name="is_active"
                    id="active_0"
                    value={0}
                    onChange={handleChange}
                    checked={Number(formData.is_active) === 0}
                    className="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                  />
                  <span>Tidak Aktif</span>
                </label>
              </div>
              {getErrors.is_active && (
                <span className="text-red-400 text-sm mt-1 block">
                  {getErrors.is_active[0]}
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
// import Svg from "@/components/Svg";
// import ProfileSvg from "@/assets/Svg/ProfileSvg";

// export default function Create() {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [processing, setProcessing] = useState(false);

//   const nameRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const confirmPasswordRef = useRef(null);

//   const [errorPassword, setErrorPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [getErrors, setGetErrors] = useState({});
//   const [photoPreview, setPhotoPreview] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm_password: "",
//     photo: null,
//     is_active: 1,
//   });

//   useEffect(() => {
//     if (nameRef.current) {
//       nameRef.current.focus();
//     }
//   }, []);

//   // Clean up object URL memory leak saat preview berubah atau unmount
//   useEffect(() => {
//     return () => {
//       if (photoPreview) {
//         URL.revokeObjectURL(photoPreview);
//       }
//     };
//   }, [photoPreview]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       const file = files[0];
//       if (file) {
//         setFormData((prev) => ({ ...prev, photo: file }));
//         setPhotoPreview(URL.createObjectURL(file));
//       }
//     } else if (name === "password") {
//       setFormData((prev) => ({ ...prev, password: value }));
//       if (errorPassword) setErrorPassword("");
//     } else if (name === "confirm_password") {
//       setFormData((prev) => ({ ...prev, confirm_password: value }));
//       if (formData.password !== value) {
//         setErrorPassword("Password tidak cocok");
//       } else {
//         setErrorPassword("");
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handlePhotoClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGetErrors({});
//     setErrorMessage("");

//     if (formData.password !== formData.confirm_password) {
//       setErrorPassword("Password tidak cocok");
//       alert("Konfirmasi password tidak cocok..!!");
//       confirmPasswordRef.current?.focus();
//       return;
//     }

//     setErrorPassword("");

//     // Menggunakan FormData untuk pengiriman berkas/foto
//     const dataUser = new FormData();
//     dataUser.append("name", formData.name);
//     dataUser.append("username", formData.username);
//     dataUser.append("email", formData.email);
//     dataUser.append("phone", formData.phone);
//     dataUser.append("password", formData.password);
//     dataUser.append("is_active", formData.is_active);

//     if (formData.photo) {
//       dataUser.append("photo", formData.photo);
//     }

//     try {
//       setProcessing(true);

//       // Endpoint disesuaikan dengan Route::apiResource('users', UserController::class)
//       const response = await api.post("/api/users", dataUser, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // Header Content-Type otomatis diatur Axios untuk FormData
//         },
//       });

//       // Struktur response disesuaikan dengan UserController store()
//       const newUlid = response.data.data.ulid;

//       navigate("/dashboard/settings/users/" + newUlid, {
//         state: {
//           message: "Penambahan user baru berhasil..!!",
//         },
//       });
//     } catch (err) {
//       if (!err?.response) {
//         setErrorMessage("Tidak ada respon dari server..!!");
//       } else if (err.response?.status === 401) {
//         setErrorMessage("Sesi habis, silakan login kembali..!!");
//       } else if (err.response?.status === 422) {
//         // Validation error Laravel (Unprocessable Entity)
//         setGetErrors(err.response.data.errors || {});
//         nameRef.current?.focus();
//       } else {
//         setErrorMessage(
//           err.response.data?.message || "Terjadi kesalahan server.",
//         );
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <HeaderCreate
//           titleCreate="Data Pengguna"
//           backUrl="/dashboard/settings/users"
//           getProcessing={processing}
//         />

//         {errorMessage && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-2 text-sm">
//             {errorMessage}
//           </div>
//         )}

//         <div className="grid grid-cols-3 gap-2 mt-4 w-full">
//           {/* Sisi Kiri - Foto Profil */}
//           <div className="flex-all-center col-span-1 p-2">
//             <div>
//               <div className="flex-all-center">
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Preview Foto"
//                     className="flex w-64 h-64 rounded-full mx-2 object-cover"
//                   />
//                 ) : (
//                   <Svg
//                     title="Profile"
//                     c={"w-64 h-64 rounded-full fill-current mx-2"}
//                   >
//                     <ProfileSvg />
//                   </Svg>
//                 )}
//               </div>
//               <div className="flex-all-center">
//                 <input
//                   type="file"
//                   name="photo"
//                   ref={fileInputRef}
//                   onChange={handleChange}
//                   style={{ display: "none" }}
//                   accept="image/jpeg,image/png,image/jpg"
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
//                 <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                   {getErrors.photo[0]}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Sisi Kanan - Form Fields */}
//           <div className="p-4 border rounded-xl col-span-2">
//             <label className="flex">Nama Lengkap</label>
//             <input
//               type="text"
//               name="name"
//               className="flex p-2 h-8 w-full border rounded"
//               placeholder="Masukkan Nama Lengkap"
//               autoComplete="off"
//               ref={nameRef}
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.name && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.name[0]}
//               </span>
//             )}

//             <label className="flex mt-2">Username</label>
//             <input
//               type="text"
//               name="username"
//               className="flex p-2 h-8 w-full border rounded"
//               placeholder="Masukkan username (min. 6 karakter)"
//               autoComplete="off"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.username && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.username[0]}
//               </span>
//             )}

//             <label className="flex mt-2">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="flex p-2 h-8 w-full border rounded"
//               placeholder="Input Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />

//             <label className="flex mt-2">Konfirmasi Password</label>
//             <input
//               type="password"
//               name="confirm_password"
//               className="flex p-2 h-8 w-full border rounded"
//               placeholder="Konfirmasi Password"
//               value={formData.confirm_password}
//               onChange={handleChange}
//               ref={confirmPasswordRef}
//               required
//             />
//             {errorPassword && (
//               <p className="text-red-500 text-sm mt-1">{errorPassword}</p>
//             )}
//             {getErrors.password && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.password[0]}
//               </span>
//             )}

//             <label className="flex mt-2">Nomor HP</label>
//             <input
//               type="text"
//               name="phone"
//               className="flex p-2 h-8 w-full border rounded"
//               placeholder="Masukkan Nomor HP"
//               autoComplete="off"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.phone && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.phone[0]}
//               </span>
//             )}

//             <label className="flex mt-2">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="flex p-2 h-8 w-full border rounded"
//               placeholder="Masukkan email"
//               autoComplete="off"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.email && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.email[0]}
//               </span>
//             )}

//             <label className="flex mt-2">Pilih Status</label>
//             <div className="flex items-center mt-1">
//               <input
//                 name="is_active"
//                 type="radio"
//                 id="active_1"
//                 value={1}
//                 onChange={handleChange}
//                 checked={Number(formData.is_active) === 1}
//               />
//               <label htmlFor="active_1" className="ml-1 cursor-pointer">
//                 Aktif
//               </label>

//               <input
//                 name="is_active"
//                 className="ml-8"
//                 type="radio"
//                 id="active_0"
//                 value={0}
//                 onChange={handleChange}
//                 checked={Number(formData.is_active) === 0}
//               />
//               <label htmlFor="active_0" className="ml-1 cursor-pointer">
//                 Tidak Aktif
//               </label>
//             </div>
//             {getErrors.is_active && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.is_active[0]}
//               </span>
//             )}
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
