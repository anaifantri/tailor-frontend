import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
import ImageSvg from "@/assets/Svg/ImageSvg";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { ulid } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const nameRef = useRef();

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [editMaterial, setEditMaterial] = useState({
    ulid: "",
    code: "",
    name: "",
    description: "",
    unit: "",
    initial_stock: 0,
    stock: 0,
  });

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/materials/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const materialData = response.data.material;
        setEditMaterial({
          ulid: materialData.ulid || "",
          code: materialData.code || "",
          name: materialData.name || "",
          description: materialData.description || "",
          unit: materialData.unit || "pilih",
          initial_stock: materialData.initial_stock || 0,
          stock: materialData.stock || 0,
        });
        setPhotoPreview(materialData.photo || "");
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized!");
        } else {
          setError(err.response?.data?.message || "Gagal mengambil data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ulid, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      if (file) {
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setEditMaterial((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    if (editMaterial.unit === "") {
      alert("Silakan pilih satuan terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT"); // Method spoofing untuk multipart/form-data Laravel
    formData.append("code", editMaterial.code);
    formData.append("name", editMaterial.name);
    formData.append("description", editMaterial.description || "");
    formData.append("unit", editMaterial.unit);
    formData.append("initial_stock", editMaterial.initial_stock);
    formData.append("stock", editMaterial.stock);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      setProcessing(true);
      await api.post(`/api/materials/${ulid}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard/settings/materials", {
        state: { message: "Berhasil mengubah data kain!" },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized!");
      } else if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
      } else {
        setErrorMessage(err.response?.data?.message || "Update gagal!");
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingData />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="w-250">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Kain"
          backUrl="/dashboard/settings/materials"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="mt-2 text-red-600 text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex-all-center col-span-1 border border-gray-200 shadow-lg rounded-xl p-10">
            <div>
              <div className="flex-all-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="flex w-56 h-56 object-cover rounded-md"
                  />
                ) : (
                  <Svg title="Profile" c={"w-56 h-56 fill-current"}>
                    <ImageSvg />
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
                  accept="image/jpeg,image/png,image/jpg"
                />
                <button
                  type="button"
                  className="bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  Ganti Foto Kain
                </button>
              </div>
              {getErrors.photo && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.photo[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex border border-gray-200 shadow-lg rounded-xl col-span-2 p-4">
            <div className="w-full">
              <div className="flex items-center">
                <label className="w-36">Nomor Kain</label>
                <input
                  type="text"
                  name="code"
                  className="flex p-2 py-1 w-120 border rounded"
                  placeholder="Masukkan nomor kain"
                  autoComplete="off"
                  onChange={handleChange}
                  value={editMaterial.code}
                  required
                />
              </div>
              {getErrors.code && (
                <span className="flex text-red-500 text-xs mt-1 ml-36">
                  {getErrors.code[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Nama Kain</label>
                <input
                  type="text"
                  name="name"
                  className="flex p-2 py-1 w-120 border rounded"
                  placeholder="Masukkan nama kain"
                  autoComplete="off"
                  ref={nameRef}
                  onChange={handleChange}
                  value={editMaterial.name}
                  required
                />
              </div>
              {getErrors.name && (
                <span className="flex text-red-500 text-xs mt-1 ml-36">
                  {getErrors.name[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Pilih Satuan</label>
                <select
                  className="py-1 w-36 border rounded px-2"
                  name="unit"
                  value={editMaterial.unit}
                  onChange={handleChange}
                >
                  <option value="">Pilih</option>
                  <option value="meter">Meter</option>
                  <option value="roll">Roll</option>
                  <option value="yard">Yard</option>
                </select>
              </div>
              {getErrors.unit && (
                <span className="flex text-red-500 text-xs mt-1 ml-36">
                  {getErrors.unit[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Stok Awal</label>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  step="0.01"
                  name="initial_stock"
                  value={editMaterial.initial_stock}
                  className="flex px-2 py-1 w-28 text-right border rounded"
                  autoComplete="off"
                  onChange={handleChange}
                />
              </div>
              {getErrors.initial_stock && (
                <span className="flex text-red-500 text-xs mt-1 ml-36">
                  {getErrors.initial_stock[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Stok Saat ini</label>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  step="0.01"
                  value={editMaterial.stock}
                  name="stock"
                  className="flex px-2 py-1 w-28 text-right border rounded"
                  autoComplete="off"
                  onChange={handleChange}
                />
              </div>
              {getErrors.stock && (
                <span className="flex text-red-500 text-xs mt-1 ml-36">
                  {getErrors.stock[0]}
                </span>
              )}

              <div className="flex mt-2">
                <label className="w-36">Deskripsi</label>
                <textarea
                  name="description"
                  className="flex px-2 py-1 w-120 border rounded"
                  rows={3}
                  onChange={handleChange}
                  value={editMaterial.description}
                />
              </div>
              {getErrors.description && (
                <span className="flex text-red-500 text-xs mt-1 ml-36">
                  {getErrors.description[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
