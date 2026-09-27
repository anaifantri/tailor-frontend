import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";
import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const navigate = useNavigate();
  const { ulid } = useParams();
  const { token } = useAuth();
  const codeRef = useRef(null);
  const backFileInputRef = useRef(null);
  const frontFileInputRef = useRef(null);

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [service, setService] = useState({
    ulid: "",
    code: "",
    name: "",
    category: "",
    base_price: 0,
    front_view_image: null,
    back_view_image: null,
  });

  const [previews, setPreviews] = useState({ front: null, back: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/services/${ulid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setService({
          ulid: data.ulid || "",
          code: data.code || "",
          name: data.name || "",
          category: data.category || "",
          base_price: data.base_price || 0,
          front_view_image: null,
          back_view_image: null,
        });
        setPreviews({
          front: data.front_view_image,
          back: data.back_view_image,
        });
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response?.data?.message || "Data tidak ditemukan");
        }
      } finally {
        setLoading(false);
      }
    };

    if (ulid && token) fetchData();
  }, [ulid, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBackPhotoClick = () => {
    backFileInputRef.current?.click();
  };

  const handleFrontPhotoClick = () => {
    frontFileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setService((prevData) => ({ ...prevData, [name]: file }));
      setPreviews((prev) => ({
        ...prev,
        [name === "front_view_image" ? "front" : "back"]:
          URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    try {
      setProcessing(true);
      const payload = new FormData();
      payload.append("_method", "PUT");
      payload.append("code", service.code);
      payload.append("name", service.name);
      payload.append("category", service.category);
      payload.append("base_price", service.base_price);
      if (service.front_view_image)
        payload.append("front_view_image", service.front_view_image);
      if (service.back_view_image)
        payload.append("back_view_image", service.back_view_image);

      const response = await api.post(`/api/services/${ulid}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/dashboard/settings/services/${ulid}`, {
        state: {
          message: `Perubahan data jenis layanan dengan nama ${service.name} berhasil..!!`,
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else if (err.response?.data?.errors) {
        setGetErrors(err.response.data.errors);
        codeRef.current?.focus();
        setErrorMessage("Update gagal, periksa kembali inputan Anda..!!");
      } else {
        setErrorMessage(
          err.response?.data?.message || "Gagal memperbarui data..!!",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full mx-auto mb-10">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Jenis layanan"
          backUrl="/dashboard/settings/services"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
          <div className="border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-6 space-y-4 text-slate-300">
            <div>
              <div className="flex justify-between w-full px-24">
                <label className="flex items-end text-sm font-medium text-slate-300">
                  Gambar Tampak Depan
                </label>
                <button
                  type="button"
                  onClick={handleFrontPhotoClick}
                  className="border rounded-md bg-brand-secondary hover:bg-brand-secondary/80 cursor-pointer text-white px-1 w-20"
                >
                  Pilih Foto
                </button>
              </div>
              <div className="flex-1 space-y-2 px-20 mt-2">
                <input
                  type="file"
                  ref={frontFileInputRef}
                  name="front_view_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
                {previews.front && (
                  <img
                    src={previews.front}
                    alt="Depan"
                    className="w-full h-56 object-cover rounded-xl border border-slate-800 bg-slate-950 p-1"
                  />
                )}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between w-full px-24">
                <label className="flex items-end text-sm font-medium text-slate-300">
                  Gambar Tampak Belakang
                </label>
                <button
                  type="button"
                  onClick={handleBackPhotoClick}
                  className="border rounded-md bg-brand-secondary hover:bg-brand-secondary/80 cursor-pointer text-white px-1 w-20"
                >
                  Pilih Foto
                </button>
              </div>
              <div className="flex-1 space-y-2 mt-2 px-20">
                <input
                  type="file"
                  ref={backFileInputRef}
                  name="back_view_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
                {previews.back && (
                  <img
                    src={previews.back}
                    alt="Belakang"
                    className="w-full h-56 object-cover rounded-xl border border-slate-800 bg-slate-950 p-1"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-6 space-y-4 text-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-44 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                Kode
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  name="code"
                  value={service.code}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  ref={codeRef}
                  onChange={handleChange}
                  required
                />
                {getErrors.code && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {getErrors.code[0]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-44 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                Jenis layanan
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  name="name"
                  value={service.name}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  onChange={handleChange}
                  required
                />
                {getErrors.name && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {getErrors.name[0]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-44 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                Harga
              </label>
              <div className="flex-1">
                <input
                  type="number"
                  name="base_price"
                  value={Number(service.base_price)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  onChange={handleChange}
                />
                {getErrors.base_price && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {getErrors.base_price[0]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="w-44 text-sm font-medium text-slate-300 mb-2 sm:mb-0">
                Kategori Pakaian
              </label>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="tailoring"
                      onChange={handleChange}
                      checked={service.category === "tailoring"}
                      required
                      className="accent-indigo-600 w-4 h-4"
                    />
                    <span>JAHIT</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="material_sale"
                      onChange={handleChange}
                      checked={service.category === "material_sale"}
                      required
                      className="accent-indigo-600 w-4 h-4"
                    />
                    <span>PENJUALAN BAHAN</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="other"
                      onChange={handleChange}
                      checked={service.category === "other"}
                      required
                      className="accent-indigo-600 w-4 h-4"
                    />
                    <span>LAINNYA</span>
                  </label>
                </div>
                {getErrors.category && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {getErrors.category[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
