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
  const { token } = useAuth();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const nameRef = useRef();
  const errorRef = useRef();
  const [specialty, setSpecialty] = useState([]);
  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

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

  const [editTailor, setEditTailor] = useState(null);

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCbChange = (e) => {
    if (e.target.checked === true) {
      setSpecialty((prevItems) => [e.target.value, ...prevItems]);
    } else {
      setSpecialty(specialty.filter((item) => item !== e.target.value));
    }
  };

  const handleChange = (e) => {
    if (e.target.name == "photo") {
      const file = e.target.files[0];
      if (file) {
        setPhoto(file);
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      }
    } else {
      setEditTailor({ ...editTailor, [e.target.name]: e.target.value });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/tailors/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditTailor(response.data.tailor);
        setPhotoPreview(response.data.tailor.photo);
        setSpecialty(JSON.parse(response.data.tailor.specialty));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const formData = new FormData();
    formData.append("hashed_id", editTailor.hashed_id);
    formData.append("code", editTailor.code);
    formData.append("name", editTailor.name);
    formData.append("address", editTailor.address);
    formData.append("email", editTailor.email);
    formData.append("phone", editTailor.phone);
    formData.append("is_active", editTailor.is_active);
    formData.append("specialty", JSON.stringify(specialty));
    if (photo) {
      formData.append("photo", photo);
    }
    try {
      setProcessing(true);
      const response = await api.post(`/api/tailors/${id}/edit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      const tailor = response.data;
      navigate("/dashboard/tailors/tailors/" + tailor.hashed_id, {
        state: { message: "Berhasil mengubah data tukang jahit..!!" },
      });
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
  };

  return (
    <>
      <div className="w-250">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Tukang Jahit"
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
                {getErrors?.photo && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center mt-2"
                        : "hidden"
                    }
                  >
                    {getErrors?.photo}
                  </span>
                )}
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
                    Ganti Foto
                  </button>
                </div>
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
                    defaultValue={editTailor?.name}
                    required
                  />
                </div>
                {getErrors?.name && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors?.name}
                  </span>
                )}
                <div className="flex mt-2">
                  <label className="w-36">Alamat</label>
                  <textarea
                    name="address"
                    className="flex p-1 w-120"
                    rows={3}
                    onChange={handleChange}
                    defaultValue={editTailor?.address}
                  />
                </div>
                {getErrors?.address && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors?.address}
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
                    defaultValue={editTailor?.phone}
                    required
                  />
                </div>
                {getErrors?.phone && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors?.phone}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-36">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input email"
                    autoComplete="off"
                    onChange={handleChange}
                    defaultValue={editTailor?.email}
                  />
                </div>
                {getErrors?.email && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors?.email}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-36">Status</label>
                  <input
                    type="radio"
                    name="is_active"
                    value={1}
                    checked={editTailor?.is_active == 1}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label className="ml-2">Aktif</label>
                  <input
                    type="radio"
                    name="is_active"
                    value={0}
                    checked={editTailor?.is_active == 0}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-4"
                  />
                  <label className="ml-2">Non Aktif</label>
                </div>
                {getErrors?.is_active && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors?.is_active}
                  </span>
                )}
                <div className="flex mt-2">
                  <label className="w-36">Keahlian</label>
                  <div className="grid grid-cols-3 gap-4">
                    {specialties?.map((item, index) => (
                      <div className="flex mt-2" key={index}>
                        <input
                          type="checkbox"
                          value={item}
                          checked={specialty?.includes(item)}
                          onChange={handleCbChange}
                          className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                        />
                        <label className="ml-2">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {getErrors?.specialty && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors?.specialty}
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
