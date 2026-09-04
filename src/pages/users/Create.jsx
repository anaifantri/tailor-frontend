import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderCreate from "@/components/HeaderCreate";
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
  const [photoPreview, setPhotoPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    photo: null,
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
        [name]: e.target.value,
      }));
      if (errorPassword) setErrorPassword("");
    } else if (name == "confirm_password") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.value,
      }));
      if (formData.password !== e.target.value) {
        setErrorPassword("Passwords do not match");
      } else {
        setErrorPassword("");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.value,
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
      setErrorPassword("Passwords do not match");
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
      dataUser.append("is_active", "1");

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
        const registerToken = response?.data?.token;
        const registerUser = response?.data?.user;
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
          console.log(err.response.data.errors);
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
          <HeaderCreate
            titleCreate="Data Pengguna"
            backUrl="/dashboard/users"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex-all-center col-span-1">
              <div>
                <div className="flex-all-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="" className="flex w-36 mx-2" />
                  ) : (
                    <Svg title="Profile" c={"w-36 fill-current mx-2"}>
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
            <div className="flex w-120 h-80 p-2 border rounded-xl col-span-2">
              <div>
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
                    // value={formData.name}
                    required
                  />
                </div>
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
                <div className="flex items-center mt-2">
                  <label className="w-44">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="flex p-2 h-8 w-72"
                    placeholder="Input username"
                    autoComplete="off"
                    onChange={handleChange}
                    // value={formData.username}
                    required
                  />
                </div>
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

                <div className="flex items-center mt-2">
                  <label className="w-44">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="flex p-2 h-8 w-72"
                    placeholder="Input Password"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-44">Konfirmasi Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    className="flex p-2 h-8 w-72"
                    placeholder="Konfirmasi Password"
                    onChange={handleChange}
                    ref={confirmPasswordRef}
                    required
                  />
                </div>
                {errorPassword && (
                  <p style={{ color: "red" }}>{errorPassword}</p>
                )}
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
                <div className="flex items-center mt-2">
                  <label className="w-44">Nomor Hp.</label>
                  <input
                    type="text"
                    name="phone"
                    className="flex p-2 h-8 w-72"
                    placeholder="Input Nomor Hp."
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    // value={formData.phone}
                  />
                </div>
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
                <div className="flex items-center mt-2">
                  <label className="w-44">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="flex p-2 h-8 w-72"
                    placeholder="Input email"
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    // value={formData.email}
                  />
                </div>
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
                {/* <div className="flex-all-center mt-4 p-2 border-b border-t w-full">
                                <BtnSave p={loading} />
                                <BtnCancel backUrl="/users" />
                            </div> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
