import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderCreate from "@/components/HeaderCreate";
import ImageSvg from "@/assets/Svg/ImageSvg";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const nameRef = useRef();
  const fileInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    unit: "",
    initial_stock: 0,
    stock: 0,
    description: "",
    photo: null,
  });

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          photo: file,
        }));
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    if (formData.unit === "pilih") {
      alert("Silakan pilih satuan terlebih dahulu!");
      return;
    }

    const dataMaterial = new FormData();
    dataMaterial.append("code", formData.code);
    dataMaterial.append("name", formData.name);
    dataMaterial.append("description", formData.description || "");
    dataMaterial.append("unit", formData.unit);
    dataMaterial.append("initial_stock", formData.initial_stock);
    dataMaterial.append("stock", formData.stock);

    if (formData.photo) {
      dataMaterial.append("photo", formData.photo);
    }

    try {
      setProcessing(true);
      await api.post("/api/materials", dataMaterial, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboard/settings/materials", {
        state: { message: "Penambahan data kain berhasil!" },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized!");
      } else if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
      } else {
        setErrorMessage(
          err.response.data.message || "Terjadi kesalahan server",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-250">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Kain"
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
                    className="flex w-56 h-56 mx-2 object-cover rounded-md"
                  />
                ) : (
                  <Svg title="Profile" c={"w-56 h-56 fill-current mx-2"}>
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
                  Pilih Foto Kain
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
                  value={formData.code}
                  className="flex p-2 px-2 py-1 w-120 border rounded"
                  placeholder="Masukkan nomor kain"
                  autoComplete="off"
                  onChange={handleChange}
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
                  value={formData.name}
                  className="flex p-2 px-2 py-1 w-120 border rounded"
                  placeholder="Masukkan nama kain"
                  autoComplete="off"
                  ref={nameRef}
                  onChange={handleChange}
                  required
                />
              </div>
              {getErrors.name && (
                <span className="flex text-red-500 text-xs mt-1 ml-36">
                  {getErrors.name[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Satuan</label>
                <select
                  className="px-2 py-1 w-40 border rounded"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih satuan</option>
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
                  value={formData.initial_stock}
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
                <label className="w-36">Stok Saat Ini</label>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  step="0.01"
                  name="stock"
                  value={formData.stock}
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
                  value={formData.description}
                  className="flex p-1 w-120 border rounded"
                  placeholder="Masukkan deskripsi kain"
                  rows={3}
                  onChange={handleChange}
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
