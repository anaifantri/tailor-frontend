import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
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
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    if (e.target.name == "photo") {
      const file = e.target.files[0];
      if (file) {
        setPhoto(file);
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      }
    } else {
      setEditUser({ ...editUser, [e.target.name]: e.target.value });
    }
  };

  const handleCbChange = (event) => {
    setChangePassword(event.target.checked);
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Optional: Validate on change to provide instant feedback
    if (editUser.password !== e.target.value) {
      setErrorPassword("Passwords do not match");
    } else {
      setErrorPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    if (changePassword == true && editUser.password !== confirmPassword) {
      setErrorPassword("Passwords do not match");
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
          setErrorMessage("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setErrorMessage("Unauthorized..!!");
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

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pengguna"
            backUrl="/dashboard/users"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex-all-center col-span-1">
              <div>
                <div className="flex-all-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt=""
                      className="flex w-56 h-56 rounded-full mx-2"
                    />
                  ) : (
                    <Svg title="Profile" c={"w-56 h-56 fill-current mx-2"}>
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
            <div className="col-span-2 w-120 h-80 border rounded-xl p-2">
              <div className="flex items-center">
                <label className="w-44">Nama</label>
                <input
                  type="text"
                  name="name"
                  className="flex p-2 h-8 w-72"
                  placeholder="Input Nama Lengkap"
                  autoComplete="off"
                  ref={nameRef}
                  onChange={handleChange}
                  defaultValue={editUser.name}
                  required
                />
              </div>
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
              <div className="flex items-center mt-2">
                <label className="w-44">Username</label>
                <input
                  type="text"
                  name="Input username"
                  className="flex p-2 h-8 w-72"
                  placeholder="Username"
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editUser.username}
                  required
                />
              </div>
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
              <div className="flex items-center mt-2">
                <label className="w-44">Nomor Hp.</label>
                <input
                  type="text"
                  name="phone"
                  className="flex p-2 h-8 w-72"
                  placeholder="Input Nomor Hp."
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editUser.phone}
                  required
                />
              </div>
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
              <div className="flex items-center mt-2">
                <label className="w-44">Email</label>
                <input
                  type="text"
                  name="email"
                  className="flex p-2 h-8 w-72"
                  placeholder="Input email"
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editUser.email}
                  required
                />
              </div>
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
              <div className="flex items-center mt-2">
                <label className="w-44">Status</label>
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
              {/* {getErrors.email && (
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
              )} */}

              <div className="flex items-center mt-2">
                <label className="w-44">Ganti Password</label>
                <input
                  className="outline-none"
                  type="checkbox"
                  checked={changePassword}
                  onChange={handleCbChange}
                />
                <label className="ml-2 italic">yes</label>
              </div>
              {/* <div
                className={
                  changePassword == true
                    ? "flex items-center mt-2"
                    : "hidden items-center mt-2"
                }
              >
                {changePassword == true && user.id == editUser.id && (
                  <>
                    <label className="w-44">Old Password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      className="flex p-2 h-8 w-72"
                      placeholder="Input password lama"
                      onChange={handleChange}
                      required
                    />
                  </>
                )}
              </div>
              {getErrors.oldPassword && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.oldPassword}
                </span>
              )} */}
              <div
                className={
                  changePassword == true
                    ? "flex items-center mt-2"
                    : "hidden items-center mt-2"
                }
              >
                <label className="w-44">New Password</label>

                {changePassword == true && (
                  <input
                    type="password"
                    name="password"
                    className="flex p-2 h-8 w-72"
                    placeholder="Input password baru"
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
              <div
                className={
                  changePassword == true
                    ? "flex items-center mt-2"
                    : "hidden items-center mt-2"
                }
              >
                <label className="w-44">Konfirmasi Password</label>
                {changePassword == true && (
                  <input
                    type="password"
                    className="flex p-2 h-8 w-72"
                    placeholder="Konfirmasi Password"
                    onChange={handleConfirmPasswordChange}
                    ref={confirmPasswordRef}
                    required
                  />
                )}
              </div>
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
