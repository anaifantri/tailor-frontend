import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
import ErrorMessage from "@/components/ErrorMessage";
import ProfileSvg from "@/assets/Svg/ProfileSvg";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { ulid } = useParams();
  const { user: currentUser, token, logout } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const nameRef = useRef(null);

  const [photoPreview, setPhotoPreview] = useState("");
  const [photo, setPhoto] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [editUser, setEditUser] = useState({
    ulid: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    photo: "",
    is_active: 1,
    password: "",
  });

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState({ status: null, message: "" });

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorInfo({ status: null, message: "" });
      const response = await api.get(`/api/users/${ulid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data.data;
      setEditUser({
        ulid: userData.ulid,
        name: userData.name || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        is_active: userData.is_active ? 1 : 0,
        password: "",
      });

      setPhotoPreview(userData.photo || "");
    } catch (err) {
      if (!err?.response) {
        setErrorInfo({
          status: "NO_SERVER_RESPONSE",
          message: "Gagal memuat data, tidak ada respon dari server.",
        });
      } else {
        setErrorInfo({
          status: err.response.status,
          message: `Gagal memuat data (${err.response.statusText})`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ulid, token]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setEditUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCbChange = (e) => {
    const checked = e.target.checked;
    setChangePassword(checked);
    setErrorPassword("");
    setConfirmPassword("");
    setEditUser((prev) => ({ ...prev, password: "" }));
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (editUser.password !== val) {
      setErrorPassword("Password tidak cocok");
    } else {
      setErrorPassword("");
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    if (changePassword && editUser.password !== confirmPassword) {
      setErrorPassword("Password tidak cocok");
      alert("Konfirmasi password tidak cocok..!!");
      confirmPasswordRef.current?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", editUser.name);
    formData.append("username", editUser.username);
    formData.append("email", editUser.email);
    formData.append("phone", editUser.phone);
    formData.append("is_active", editUser.is_active);

    if (changePassword && editUser.password) {
      formData.append("password", editUser.password);
    }

    if (photo) {
      formData.append("photo", photo, photo.name);
    }

    try {
      setProcessing(true);
      await api.post(`/api/users/${ulid}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        currentUser?.ulid === editUser.ulid &&
        changePassword &&
        editUser.password
      ) {
        logout();
      } else {
        navigate(`/dashboard/settings/users/${ulid}`, {
          state: { message: "Berhasil mengubah data pengguna..!!" },
        });
      }
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("Gagal menyimpan data, tidak ada respon dari server.");
      } else if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
        nameRef.current?.focus();
        setErrorMessage("Update gagal, periksa inputan Anda.");
      } else {
        setErrorMessage(
          err.response.data?.message || "Terjadi kesalahan server.",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingData />;
  }

  if (errorInfo.status) {
    return (
      <ErrorMessage
        status={errorInfo.status}
        message={errorInfo.message}
        onRetry={fetchData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Pengguna"
          backUrl="/dashboard/settings/users"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Sisi Kiri - Foto */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              {photoPreview ? (
                <img
                  src={photoPreview}
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
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-600/30 cursor-pointer"
              onClick={handlePhotoClick}
            >
              Ganti Foto
            </button>

            {getErrors.photo && (
              <span className="text-red-400 text-sm mt-2 block">
                {getErrors.photo[0]}
              </span>
            )}
          </div>

          {/* Sisi Kanan - Form Detail */}
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
                value={editUser.name}
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
                placeholder="Masukkan username"
                autoComplete="off"
                value={editUser.username}
                onChange={handleChange}
                required
              />
              {getErrors.username && (
                <span className="text-red-400 text-sm mt-1 block">
                  {getErrors.username[0]}
                </span>
              )}
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
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
                value={editUser.phone}
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
                value={editUser.email}
                onChange={handleChange}
                required
              />
              {getErrors.email && (
                <span className="text-red-400 text-sm mt-1 block">
                  {getErrors.email[0]}
                </span>
              )}
            </div>
            {/* </div> */}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Pilih Status
              </label>
              <div className="flex items-center gap-6 mt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    id="edit_active_1"
                    name="is_active"
                    value="1"
                    onChange={handleChange}
                    checked={Number(editUser.is_active) === 1}
                    className="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                  />
                  <span>Aktif</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                  <input
                    type="radio"
                    id="edit_active_0"
                    name="is_active"
                    value="0"
                    onChange={handleChange}
                    checked={Number(editUser.is_active) === 0}
                    className="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500"
                  />
                  <span>Non Aktif</span>
                </label>
              </div>
              {getErrors.is_active && (
                <span className="text-red-400 text-sm mt-1 block">
                  {getErrors.is_active[0]}
                </span>
              )}
            </div>

            {/* Checkbox Ganti Password */}
            <div className="pt-4 border-t border-slate-800">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-200">
                <input
                  id="change_password_cb"
                  type="checkbox"
                  checked={changePassword}
                  onChange={handleCbChange}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-950 border-slate-800 focus:ring-indigo-500"
                />
                <span>Ganti Password</span>
              </label>
            </div>

            {changePassword && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3 mt-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Input password baru"
                    value={editUser.password}
                    onChange={handleChange}
                    required={changePassword}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Konfirmasi Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    ref={confirmPasswordRef}
                    required={changePassword}
                  />
                </div>

                {errorPassword && (
                  <p className="text-red-400 text-sm mt-1">{errorPassword}</p>
                )}
                {getErrors.password && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {getErrors.password[0]}
                  </span>
                )}
              </div>
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

// import Svg from "@/components/Svg";
// import HeaderEdit from "@/components/HeaderEdit";
// import ErrorMessage from "@/components/ErrorMessage";
// import ProfileSvg from "@/assets/Svg/ProfileSvg";
// import LoadingData from "@/components/LoadingData";

// export default function Edit() {
//   const { id } = useParams(); // URL Param 'id' mewakili 'ulid'
//   const { user: currentUser, token, logout } = useAuth();
//   const navigate = useNavigate();

//   const fileInputRef = useRef(null);
//   const confirmPasswordRef = useRef(null);
//   const nameRef = useRef(null);

//   const [photoPreview, setPhotoPreview] = useState("");
//   const [photo, setPhoto] = useState(null);
//   const [changePassword, setChangePassword] = useState(false);
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [getErrors, setGetErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const [errorPassword, setErrorPassword] = useState("");

//   const [editUser, setEditUser] = useState({
//     ulid: "",
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//     photo: "",
//     is_active: 1,
//     password: "",
//   });

//   const [processing, setProcessing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [errorInfo, setErrorInfo] = useState({ status: null, message: "" });

//   // Clean up URL preview memory leak
//   useEffect(() => {
//     return () => {
//       if (photoPreview && photoPreview.startsWith("blob:")) {
//         URL.revokeObjectURL(photoPreview);
//       }
//     };
//   }, [photoPreview]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setErrorInfo({ status: null, message: "" });
//       const response = await api.get(`/api/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const userData = response.data.data;
//       setEditUser({
//         ulid: userData.ulid,
//         name: userData.name || "",
//         username: userData.username || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         is_active: userData.is_active ? 1 : 0,
//         password: "",
//       });

//       setPhotoPreview(userData.photo || "");
//     } catch (err) {
//       if (!err?.response) {
//         setErrorInfo({
//           status: "NO_SERVER_RESPONSE",
//           message: "Gagal memuat data, tidak ada respon dari server.",
//         });
//       } else {
//         setErrorInfo({
//           status: err.response.status,
//           message: `Gagal memuat data (${err.response.statusText})`,
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [id, token]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       const file = files[0];
//       if (file) {
//         setPhoto(file);
//         setPhotoPreview(URL.createObjectURL(file));
//       }
//     } else {
//       setEditUser((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCbChange = (e) => {
//     const checked = e.target.checked;
//     setChangePassword(checked);
//     setErrorPassword("");
//     setConfirmPassword("");
//     setEditUser((prev) => ({ ...prev, password: "" }));
//   };

//   const handleConfirmPasswordChange = (e) => {
//     const val = e.target.value;
//     setConfirmPassword(val);
//     if (editUser.password !== val) {
//       setErrorPassword("Password tidak cocok");
//     } else {
//       setErrorPassword("");
//     }
//   };

//   const handlePhotoClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setGetErrors({});
//     setErrorMessage("");

//     if (changePassword && editUser.password !== confirmPassword) {
//       setErrorPassword("Password tidak cocok");
//       alert("Konfirmasi password tidak cocok..!!");
//       confirmPasswordRef.current?.focus();
//       return;
//     }

//     const formData = new FormData();
//     formData.append("_method", "PUT"); // Method spoofing untuk Laravel multipart update
//     formData.append("name", editUser.name);
//     formData.append("username", editUser.username);
//     formData.append("email", editUser.email);
//     formData.append("phone", editUser.phone);
//     formData.append("is_active", editUser.is_active);

//     if (changePassword && editUser.password) {
//       formData.append("password", editUser.password);
//     }

//     if (photo) {
//       formData.append("photo", photo, photo.name);
//     }
//     console.log(photo);

//     try {
//       setProcessing(true);
//       await api.post(`/api/users/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // "Content-Type": "mulipart/form-data",
//         },
//       });

//       // Jika user mengubah profilnya sendiri dan memperbarui password
//       if (
//         currentUser?.ulid === editUser.ulid &&
//         changePassword &&
//         editUser.password
//       ) {
//         logout();
//       } else {
//         navigate(`/dashboard/settings/users/${id}`, {
//           state: { message: "Berhasil mengubah data pengguna..!!" },
//         });
//       }
//     } catch (err) {
//       if (!err?.response) {
//         setErrorMessage("Gagal menyimpan data, tidak ada respon dari server.");
//       } else if (err.response?.status === 422) {
//         setGetErrors(err.response.data.errors || {});
//         nameRef.current?.focus();
//         setErrorMessage("Update gagal, periksa inputan Anda.");
//       } else {
//         setErrorMessage(
//           err.response.data?.message || "Terjadi kesalahan server.",
//         );
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return <LoadingData />;
//   }

//   if (errorInfo.status) {
//     return (
//       <ErrorMessage
//         status={errorInfo.status}
//         message={errorInfo.message}
//         onRetry={fetchData}
//       />
//     );
//   }

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <HeaderEdit
//           titleEdit="Data Pengguna"
//           backUrl="/dashboard/settings/users"
//           getProcessing={processing}
//         />

//         {errorMessage && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded my-2 text-sm">
//             {errorMessage}
//           </div>
//         )}

//         <div className="grid grid-cols-3 gap-4 mt-4 w-full">
//           {/* Sisi Kiri - Foto */}
//           <div className="flex-all-center col-span-1">
//             <div>
//               <div className="flex-all-center">
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Foto Profil"
//                     className="flex w-64 h-64 border border-slate-200 shadow-xl rounded-full mx-2 object-cover"
//                   />
//                 ) : (
//                   <Svg title="Profile" c={"w-64 h-64 fill-current mx-2"}>
//                     <ProfileSvg />
//                   </Svg>
//                 )}
//               </div>
//               <div className="flex-all-center mt-2">
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
//                   className="flex-all-center border border-slate-300 shadow-lg bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 mt-2 cursor-pointer"
//                   onClick={handlePhotoClick}
//                 >
//                   Ganti Foto
//                 </button>
//               </div>
//               {getErrors.photo && (
//                 <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                   {getErrors.photo[0]}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Sisi Kanan - Form Detail */}
//           <div className="col-span-2 border-slate-200 border shadow-xl rounded-xl p-4">
//             <label className="flex font-medium">Nama Lengkap</label>
//             <input
//               type="text"
//               name="name"
//               className="flex p-2 h-8 w-full border rounded mt-1"
//               placeholder="Masukkan Nama Lengkap"
//               autoComplete="off"
//               ref={nameRef}
//               value={editUser.name}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.name && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.name[0]}
//               </span>
//             )}

//             <label className="flex font-medium mt-3">Username</label>
//             <input
//               type="text"
//               name="username"
//               className="flex p-2 h-8 w-full border rounded mt-1"
//               placeholder="Masukkan username"
//               autoComplete="off"
//               value={editUser.username}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.username && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.username[0]}
//               </span>
//             )}

//             <label className="flex font-medium mt-3">Nomor HP</label>
//             <input
//               type="text"
//               name="phone"
//               className="flex p-2 h-8 w-full border rounded mt-1"
//               placeholder="Masukkan Nomor HP"
//               autoComplete="off"
//               value={editUser.phone}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.phone && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.phone[0]}
//               </span>
//             )}

//             <label className="flex font-medium mt-3">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="flex p-2 h-8 w-full border rounded mt-1"
//               placeholder="Masukkan email"
//               autoComplete="off"
//               value={editUser.email}
//               onChange={handleChange}
//               required
//             />
//             {getErrors.email && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.email[0]}
//               </span>
//             )}

//             <label className="flex font-medium mt-3">Pilih Status</label>
//             <div className="flex items-center mt-1">
//               <input
//                 type="radio"
//                 id="edit_active_1"
//                 name="is_active"
//                 value="1"
//                 onChange={handleChange}
//                 checked={Number(editUser.is_active) === 1}
//               />
//               <label htmlFor="edit_active_1" className="ml-1 cursor-pointer">
//                 Aktif
//               </label>

//               <input
//                 type="radio"
//                 id="edit_active_0"
//                 name="is_active"
//                 className="ml-6"
//                 value="0"
//                 onChange={handleChange}
//                 checked={Number(editUser.is_active) === 0}
//               />
//               <label htmlFor="edit_active_0" className="ml-1 cursor-pointer">
//                 Non Aktif
//               </label>
//             </div>
//             {getErrors.is_active && (
//               <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                 {getErrors.is_active[0]}
//               </span>
//             )}

//             <div className="flex items-center mt-4 border-t pt-3">
//               <input
//                 id="change_password_cb"
//                 className="cursor-pointer"
//                 type="checkbox"
//                 checked={changePassword}
//                 onChange={handleCbChange}
//               />
//               <label
//                 htmlFor="change_password_cb"
//                 className="ml-2 font-medium cursor-pointer"
//               >
//                 Ganti Password
//               </label>
//             </div>

//             {changePassword && (
//               <div className="bg-gray-50 p-3 rounded-lg border mt-2">
//                 <label className="flex font-medium text-sm">
//                   Password Baru
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   className="flex p-2 h-8 w-full border rounded mt-1"
//                   placeholder="Input password baru"
//                   value={editUser.password}
//                   onChange={handleChange}
//                   required={changePassword}
//                 />

//                 <label className="flex font-medium text-sm mt-2">
//                   Konfirmasi Password
//                 </label>
//                 <input
//                   type="password"
//                   className="flex p-2 h-8 w-full border rounded mt-1"
//                   placeholder="Konfirmasi Password"
//                   value={confirmPassword}
//                   onChange={handleConfirmPasswordChange}
//                   ref={confirmPasswordRef}
//                   required={changePassword}
//                 />

//                 {errorPassword && (
//                   <p className="text-red-500 text-sm mt-1">{errorPassword}</p>
//                 )}
//                 {getErrors.password && (
//                   <span className="flex w-full text-red-500 text-sm items-center mt-1">
//                     {getErrors.password[0]}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
