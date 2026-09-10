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

  const errorRef = useRef();
  const nameRef = useRef();
  const fileInputRef = useRef(null);
  const confirmPasswordRef = useRef();

  const [errorPassword, setErrorPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "photo") {
      const file = e.target.files[0];
      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
        }));
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      }
    } else if (name == "password") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      if (errorPassword) setErrorPassword("");
    } else if (name == "confirm_password") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      if (formData.password !== value) {
        setErrorPassword("Password tidak cocok");
      } else {
        setErrorPassword("");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    if (formData.password !== formData.confirm_password) {
      setErrorPassword("Password tidak cocok");
      alert("Konfirmasi password tidak cocok..!!");
      confirmPasswordRef.current.focus();
    } else {
      setErrorPassword("");
      const dataUser = new FormData();
      dataUser.append("name", formData.name);
      dataUser.append("username", formData.username);
      dataUser.append("email", formData.email);
      dataUser.append("phone", formData.phone);
      dataUser.append("gender", formData.gender);
      dataUser.append("password", formData.password);
      dataUser.append("is_active", formData.is_active);

      if (formData.photo) {
        dataUser.append("photo", formData.photo);
      }
      try {
        setProcessing(true);
        const response = await api.post("/api/users/register", dataUser, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        });
        navigate("/dashboard/users", {
          state: {
            message: "Penambahan user baru berhasil..!!",
          },
        });
      } catch (err) {
        if (!err?.response) {
          setErrorMessage("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setErrorMessage("Unauthorized..!!");
        } else {
          setGetErrors(err.response.data.errors);
          nameRef.current.focus();
        }
      } finally {
        setProcessing(false);
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data Pengguna"
            backUrl="/dashboard/users"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4 w-full">
            <div className="flex-all-center col-span-1 p-2">
              <div>
                <div className="flex-all-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt=""
                      className="flex w-64 h-64 rounded-full mx-2"
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
                    accept="image/*"
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
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.photo}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 border rounded-xl col-span-2">
              <label className="flex">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                className="flex p-2 h-8 w-full"
                placeholder="Masukkan Nama Lengkap"
                autoComplete="off"
                ref={nameRef}
                onChange={handleChange}
                // value={formData.name}
                required
              />
              {getErrors.name && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
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
                name="username"
                className="flex p-2 h-8 w-full"
                placeholder="Masukkan username (min. 6 karakter)"
                autoComplete="off"
                onChange={handleChange}
                required
              />
              {getErrors.username && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.username}
                </span>
              )}

              <label className="flex mt-2">Password</label>
              <input
                type="password"
                name="password"
                className="flex p-2 h-8 w-full"
                placeholder="Input Password"
                onChange={handleChange}
                required
              />

              <label className="mt-2">Konfirmasi Password</label>
              <input
                type="password"
                name="confirm_password"
                className="flex p-2 h-8 w-full"
                placeholder="Konfirmasi Password"
                onChange={handleChange}
                ref={confirmPasswordRef}
                required
              />
              {errorPassword && <p style={{ color: "red" }}>{errorPassword}</p>}
              {getErrors.password && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.password}
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
                required
              />
              {getErrors.phone && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.phone}
                </span>
              )}
              <label className="flex mt-2">Email</label>
              <input
                type="email"
                name="email"
                className="flex p-2 h-8 w-full"
                placeholder="Masukkan email"
                autoComplete="off"
                onChange={handleChange}
                required
              />
              {getErrors.email && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
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
                  name="is_active"
                  type="radio"
                  value={1}
                  onClick={handleChange}
                  checked={formData.is_active}
                />
                <label className="flex ml-1">Aktif</label>
                <input
                  name="is_active"
                  className="flex ml-8"
                  type="radio"
                  value={0}
                  onClick={handleChange}
                />
                <label className="flex ml-1">Tidak Aktif</label>
              </div>
              {getErrors.is_active && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.is_active}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
