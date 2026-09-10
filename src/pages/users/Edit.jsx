import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
import ErrorMessage from "@/components/ErrorMessage";
import ProfileSvg from "@/assets/Svg/ProfileSvg";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { id } = useParams();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const confirmPasswordRef = useRef();
  const nameRef = useRef();
  const errorRef = useRef();
  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState(null);
  const [oldUser, setOldUser] = useState(null);

  const [editUser, setEditUser] = useState({
    hashed_id: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    photo: null,
    is_active: null,
    password: null,
  });

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState({ status: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "photo") {
      const file = e.target.files[0];
      if (file) {
        setPhoto(file);
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      }
    } else {
      setEditUser({ ...editUser, [name]: value });
    }
  };

  const handleCbChange = (event) => {
    setChangePassword(event.target.checked);
    setErrorPassword(null);
    setEditUser({ ...editUser, ["password"]: null });
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorInfo({ status: null, message: "" });
      const response = await api.get("/api/users/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditUser(response.data.user);
      setOldUser(response.data.user);
      setPhotoPreview(response.data.user.photo);
    } catch (err) {
      if (!err?.response) {
        setErrorInfo({
          status: "NO_SERVER_RESPONSE",
          message: `Gagal memuat data, tidak ada respon dari server`,
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
  }, []);

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (editUser.password !== e.target.value) {
      setErrorPassword("Password tidak cocok");
    } else {
      setErrorPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");
    setErrorInfo({ status: null, message: "" });

    if (changePassword == true && editUser.password !== confirmPassword) {
      setErrorPassword("Password tidak cocok");
      alert("Konfirmasi password tidak cocok..!!");
      confirmPasswordRef.current.focus();
    } else {
      const formData = new FormData();
      formData.append("id", editUser.id);
      formData.append("name", editUser.name);
      formData.append("username", editUser.username);
      formData.append("email", editUser.email);
      formData.append("phone", editUser.phone);
      formData.append("is_active", editUser.is_active);
      if (editUser.password != null && editUser.password != "") {
        formData.append("password", editUser.password);
      }
      if (photo) {
        formData.append("photo", photo);
      }
      try {
        setProcessing(true);
        const response = await api.post(`/api/users/${id}/edit`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        });
        if (oldUser.hashed_id == editUser.hashed_id) {
          if (editUser.password != null && editUser.password != "") {
            logout();
          } else {
            navigate(`/dashboard/users/${id}`, {
              state: {
                message: "Berhasil mengubah data profile..!!",
              },
            });
          }
        } else {
          navigate("/dashboard/users", {
            state: { message: "Berhasil mengubah data user..!!" },
          });
        }
      } catch (err) {
        if (!err?.response) {
          setErrorInfo({
            status: "NO_SERVER_RESPONSE",
            message: `Gagal memuat data, tidak ada respon dari server`,
          });
        } else if (err.response?.status != 422) {
          setErrorInfo({
            status: err.response.status,
            message: `Gagal memuat data (${err.response.statusText})`,
          });
        } else {
          setGetErrors(err.response.data.errors);
          nameRef.current.focus();
          setErrorMessage("Update gagal..!!");
        }
      } finally {
        setProcessing(false);
      }
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
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pengguna"
            backUrl="/dashboard/users"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4 w-full">
            <div className="flex-all-center col-span-1">
              <div>
                <div className="flex-all-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt=""
                      className="flex w-64 h-64 border border-slate-200 shadow-xl rounded-full mx-2"
                    />
                  ) : (
                    <Svg title="Profile" c={"w-64 h-64 fill-current mx-2"}>
                      <ProfileSvg />
                    </Svg>
                  )}
                </div>
                <div className="flex-all-center mt-2">
                  <input
                    type="file"
                    name="photo"
                    ref={fileInputRef}
                    onChange={handleChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <button
                    type="button"
                    className="flex-all-center border border-slate-300 shadow-lg bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 mt-2 cursor-pointer"
                    onClick={handlePhotoClick}
                  >
                    Ganti Foto
                  </button>
                </div>
                {getErrors.photo && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.photo}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-2 border-slate-200 border shadow-xl rounded-xl p-4">
              <label className="flex">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                className="flex p-2 h-8 w-full"
                placeholder="Masukkan Nama Lengkap"
                autoComplete="off"
                ref={nameRef}
                onChange={handleChange}
                defaultValue={editUser.name}
                required
              />
              {getErrors.name && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.name}
                </span>
              )}
              <label className="flex mt-2">Username</label>
              <input
                type="text"
                name="Masukkan username (min. 6 karakter"
                className="flex p-2 h-8 w-full"
                placeholder="Username"
                autoComplete="off"
                onChange={handleChange}
                defaultValue={editUser.username}
                required
              />
              {getErrors.username && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.username}
                </span>
              )}
              <label className="flex mt-2">Nomor Hp.</label>
              <input
                type="text"
                name="phone"
                className="flex p-2 h-8 w-full"
                placeholder="Masukkan Nomor Hp."
                autoComplete="off"
                onChange={handleChange}
                defaultValue={editUser.phone}
                required
              />
              {getErrors.phone && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.phone}
                </span>
              )}
              <label className="flex mt-2">Email</label>
              <input
                type="text"
                name="email"
                className="flex p-2 h-8 w-full"
                placeholder="Masukkan email"
                autoComplete="off"
                onChange={handleChange}
                defaultValue={editUser.email}
                required
              />
              {getErrors.email && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.email}
                </span>
              )}
              <label className="flex mt-2">Pilih Status</label>
              <div className="flex">
                <input
                  value="1"
                  type="radio"
                  name="is_active"
                  onChange={handleChange}
                  checked={editUser.is_active == "1"}
                />
                <label className="ml-2">Aktif</label>
                <input
                  className="ml-4"
                  value="0"
                  type="radio"
                  name="is_active"
                  onChange={handleChange}
                  checked={editUser.is_active == "0"}
                />
                <label className="ml-2">Non Aktif</label>
              </div>
              {getErrors.is_active && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.is_active}
                </span>
              )}
              <div className="flex mt-2">
                <label className="flex">Ganti Password</label>
                <input
                  className="outline-none ml-4"
                  type="checkbox"
                  checked={changePassword}
                  onChange={handleCbChange}
                />
                <label className="ml-2 italic">yes</label>
              </div>
              {changePassword == true && (
                <>
                  <label className="flex mt-2">Password Baru</label>
                  <input
                    type="password"
                    name="password"
                    className="flex p-2 h-8 w-full"
                    placeholder="Input password baru"
                    onChange={handleChange}
                    required
                  />
                  <label className="flex mt-2">Konfirmasi Password</label>
                  <input
                    type="password"
                    className="flex p-2 h-8 w-full"
                    placeholder="Konfirmasi Password"
                    onChange={handleConfirmPasswordChange}
                    ref={confirmPasswordRef}
                    required
                  />
                </>
              )}
              {errorPassword && <p style={{ color: "red" }}>{errorPassword}</p>}
              {getErrors.password && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.password}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
