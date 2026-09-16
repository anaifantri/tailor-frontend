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

  const [specialty, setSpecialty] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState("");

  const specialties = [
    "Jas",
    "Blazer",
    "Blouse",
    "Dress",
    "Safari",
    "PDH",
    "PDL",
    "PSH",
    "PSR",
    "Celana",
    "Rok",
    "Lainnya",
  ];

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    email: "",
    phone: "",
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
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.value,
      }));
    }
  };

  const handleCbChange = (e) => {
    if (e.target.checked === true) {
      setSpecialty((prevItems) => [e.target.value, ...prevItems]);
    } else {
      setSpecialty(specialty.filter((item) => item !== e.target.value));
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

    if (specialty.length == 0) {
      alert("Silahkan pilih minimal 1 keahlian");
    } else {
      const dataTailor = new FormData();
      dataTailor.append("code", formData.code);
      dataTailor.append("name", formData.name);
      dataTailor.append("email", formData.email);
      dataTailor.append("phone", formData.phone);
      dataTailor.append("address", formData.address);
      dataTailor.append("is_active", formData.is_active);
      dataTailor.append("specialty", JSON.stringify(specialty));

      if (formData.photo) {
        dataTailor.append("photo", formData.photo);
      }
      try {
        setProcessing(true);
        const response = await api.post("/api/tailors", dataTailor, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        });
        navigate("/dashboard/tailors", {
          state: {
            message: "Penambahan data tukang jahit berhasil..!!",
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
          console.log(err.response);
        }
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <>
      <div className="w-250">
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data Tukang Jahit"
            backUrl="/dashboard/tailors/tailors"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex-all-center col-span-1 border border-gray-200 shadow-lg rounded-xl p-10">
              <div>
                <div className="flex-all-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt=""
                      className="flex w-full mx-2"
                    />
                  ) : (
                    <Svg title="Profile" c={"w-full fill-current mx-2"}>
                      <ProfileSvg />
                    </Svg>
                  )}
                </div>
                <div className="flex-all-center mt-4">
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
            <div className="flex border border-gray-200 shadow-lg rounded-xl col-span-2 p-4">
              <div>
                <div className="flex items-center">
                  <label className="w-36">Nama</label>
                  <input
                    type="text"
                    name="name"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input Nama Lengkap"
                    autoComplete="off"
                    ref={nameRef}
                    onChange={handleChange}
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
                <div className="flex mt-2">
                  <label className="w-36">Alamat</label>
                  <textarea
                    name="address"
                    className="flex p-1 w-120"
                    placeholder="Input Alamat"
                    rows={3}
                    onChange={handleChange}
                  />
                </div>
                {getErrors.address && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.address}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-36">Nomor Hp.</label>
                  <input
                    type="text"
                    name="phone"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input Nomor Hp."
                    autoComplete="off"
                    onChange={handleChange}
                    required
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
                  <label className="w-36">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input email"
                    autoComplete="off"
                    onChange={handleChange}
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
                <div className="flex items-center mt-2">
                  <label className="w-36">Status</label>
                  <input
                    type="radio"
                    name="is_active"
                    value={1}
                    checked={true}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label className="ml-2">Aktif</label>
                  <input
                    type="radio"
                    name="is_active"
                    value={0}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-4"
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
                  <label className="w-36">Keahlian</label>
                  <div className="grid grid-cols-3 gap-4">
                    {specialties.map((item, index) => (
                      <div className="flex mt-2" key={index}>
                        <input
                          type="checkbox"
                          value={item}
                          checked={specialty.includes(item)}
                          onChange={handleCbChange}
                          className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                        />
                        <label className="ml-2">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {getErrors.specialty && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.specialty}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
