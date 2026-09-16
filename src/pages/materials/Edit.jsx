import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
import ImageSvg from "@/assets/Svg/ImageSvg";
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
  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [editMaterial, setEditMaterial] = useState({
    hashed_id: "",
    code: "",
    name: "",
    description: "",
    unit: "",
    initial_stock: 0,
    stock: 0,
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
    } else if (e.target.name == "unit") {
      const selectedIndex = e.target.selectedIndex;
      const unit = e.target.options[selectedIndex].value;
      setEditMaterial({ ...editMaterial, [e.target.name]: unit });
    } else {
      setEditMaterial({ ...editMaterial, [e.target.name]: e.target.value });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/materials/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditMaterial(response.data.material);
        setPhotoPreview(response.data.material.photo);
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

    if (editMaterial.unit == "pilih") {
      alert("Silahkan pilih satuan terlebih dahulu...!!!");
    } else {
      const formData = new FormData();
      formData.append("hashed_id", editMaterial.hashed_id);
      formData.append("code", editMaterial.code);
      formData.append("name", editMaterial.name);
      formData.append("description", editMaterial.description);
      formData.append("unit", editMaterial.unit);
      formData.append("initial_stock", editMaterial.initial_stock);
      formData.append("stock", editMaterial.stock);
      if (photo) {
        formData.append("photo", photo);
      }
      try {
        setProcessing(true);
        const response = await api.post(`/api/materials/${id}/edit`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        });
        navigate("/dashboard/settings/materials", {
          state: { message: "Berhasil mengubah data kain..!!" },
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
    }
  };

  return (
    <>
      <div className="w-250">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Kain"
            backUrl="/dashboard/settings/materials"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex-all-center col-span-1 border border-gray-200 shadow-lg rounded-xl p-10">
              <div>
                <div className="flex-all-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="" className="flex w-full" />
                  ) : (
                    <Svg title="Profile" c={"w-full fill-current"}>
                      <ImageSvg />
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
                    Ganti Foto Kain
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
            <div className="flex border border-gray-200 shadow-lg rounded-xl col-span-2 p-4">
              <div>
                <div className="flex items-center">
                  <label className="w-36">Nomor Kain</label>
                  <input
                    type="text"
                    name="code"
                    className="flex p-2 py-1 w-120"
                    placeholder="Masukkan nomor kain"
                    autoComplete="off"
                    ref={nameRef}
                    onChange={handleChange}
                    defaultValue={editMaterial.code}
                    required
                  />
                </div>
                {getErrors.code && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.code}
                  </span>
                )}
                <div className="flex items-center">
                  <label className="w-36">Nama Kain</label>
                  <input
                    type="text"
                    name="name"
                    className="flex p-2 py-1 w-120"
                    placeholder="Masukkan nama kain"
                    autoComplete="off"
                    ref={nameRef}
                    onChange={handleChange}
                    defaultValue={editMaterial.name}
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
                  <label className="w-36">PilihSatuan</label>
                  <select
                    className="py-1 w-36"
                    name="unit"
                    value={editMaterial.unit}
                    onChange={handleChange}
                  >
                    <option value="pilih">Pilih</option>
                    <option value="meter">Meter</option>
                    <option value="roll">Roll</option>
                    <option value="yard">Yard</option>
                  </select>
                </div>
                {getErrors.unit && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.unit}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-36">Stok Awal</label>
                  <input
                    type="number"
                    placeholder="0"
                    min={0}
                    name="initial_stock"
                    value={editMaterial.initial_stock}
                    className="flex px-2 py-1 w-20 text-right"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </div>
                {getErrors.initial_stock && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.initial_stock}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-36">Stok Saat ini</label>
                  <input
                    type="number"
                    placeholder="0"
                    min={0}
                    value={editMaterial.stock}
                    name="stock"
                    className="flex px-2 py-1 w-20 text-right"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </div>
                {getErrors.stock && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.stock}
                  </span>
                )}
                <div className="flex mt-2">
                  <label className="w-36">Deskripsi</label>
                  <textarea
                    name="description"
                    className="flex px-2 py-1 w-120"
                    rows={3}
                    onChange={handleChange}
                    defaultValue={editMaterial.description}
                  />
                </div>
                {getErrors.description && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.description}
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
