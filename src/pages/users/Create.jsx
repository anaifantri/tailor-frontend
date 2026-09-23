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

  // Clean up object URL memory leak saat preview berubah atau unmount
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

    // Menggunakan FormData untuk pengiriman berkas/foto
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

      // Endpoint disesuaikan dengan Route::apiResource('users', UserController::class)
      const response = await api.post("/api/users", dataUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Header Content-Type otomatis diatur Axios untuk FormData
        },
      });

      // Struktur response disesuaikan dengan UserController store()
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
        // Validation error Laravel (Unprocessable Entity)
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
    <div>
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Pengguna"
          backUrl="/dashboard/settings/users"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-2 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4 w-full">
          {/* Sisi Kiri - Foto Profil */}
          <div className="flex-all-center col-span-1 p-2">
            <div>
              <div className="flex-all-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview Foto"
                    className="flex w-64 h-64 rounded-full mx-2 object-cover"
                  />
                ) : (
                  <Svg
                    title="Profile"
                    c={"w-64 h-64 rounded-full fill-current mx-2"}
                  >
                    <ProfileSvg />
                  </Svg>
                )}
              </div>
              <div className="flex-all-center">
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
                  className="flex-all-center bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 mt-2 cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  Pilih Foto
                </button>
              </div>
              {getErrors.photo && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.photo[0]}
                </span>
              )}
            </div>
          </div>

          {/* Sisi Kanan - Form Fields */}
          <div className="p-4 border rounded-xl col-span-2">
            <label className="flex">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              className="flex p-2 h-8 w-full border rounded"
              placeholder="Masukkan Nama Lengkap"
              autoComplete="off"
              ref={nameRef}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {getErrors.name && (
              <span className="flex w-full text-red-500 text-xs items-center mt-1">
                {getErrors.name[0]}
              </span>
            )}

            <label className="flex mt-2">Username</label>
            <input
              type="text"
              name="username"
              className="flex p-2 h-8 w-full border rounded"
              placeholder="Masukkan username (min. 6 karakter)"
              autoComplete="off"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {getErrors.username && (
              <span className="flex w-full text-red-500 text-xs items-center mt-1">
                {getErrors.username[0]}
              </span>
            )}

            <label className="flex mt-2">Password</label>
            <input
              type="password"
              name="password"
              className="flex p-2 h-8 w-full border rounded"
              placeholder="Input Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label className="flex mt-2">Konfirmasi Password</label>
            <input
              type="password"
              name="confirm_password"
              className="flex p-2 h-8 w-full border rounded"
              placeholder="Konfirmasi Password"
              value={formData.confirm_password}
              onChange={handleChange}
              ref={confirmPasswordRef}
              required
            />
            {errorPassword && (
              <p className="text-red-500 text-xs mt-1">{errorPassword}</p>
            )}
            {getErrors.password && (
              <span className="flex w-full text-red-500 text-xs items-center mt-1">
                {getErrors.password[0]}
              </span>
            )}

            <label className="flex mt-2">Nomor HP</label>
            <input
              type="text"
              name="phone"
              className="flex p-2 h-8 w-full border rounded"
              placeholder="Masukkan Nomor HP"
              autoComplete="off"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {getErrors.phone && (
              <span className="flex w-full text-red-500 text-xs items-center mt-1">
                {getErrors.phone[0]}
              </span>
            )}

            <label className="flex mt-2">Email</label>
            <input
              type="email"
              name="email"
              className="flex p-2 h-8 w-full border rounded"
              placeholder="Masukkan email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {getErrors.email && (
              <span className="flex w-full text-red-500 text-xs items-center mt-1">
                {getErrors.email[0]}
              </span>
            )}

            <label className="flex mt-2">Pilih Status</label>
            <div className="flex items-center mt-1">
              <input
                name="is_active"
                type="radio"
                id="active_1"
                value={1}
                onChange={handleChange}
                checked={Number(formData.is_active) === 1}
              />
              <label htmlFor="active_1" className="ml-1 cursor-pointer">
                Aktif
              </label>

              <input
                name="is_active"
                className="ml-8"
                type="radio"
                id="active_0"
                value={0}
                onChange={handleChange}
                checked={Number(formData.is_active) === 0}
              />
              <label htmlFor="active_0" className="ml-1 cursor-pointer">
                Tidak Aktif
              </label>
            </div>
            {getErrors.is_active && (
              <span className="flex w-full text-red-500 text-xs items-center mt-1">
                {getErrors.is_active[0]}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
