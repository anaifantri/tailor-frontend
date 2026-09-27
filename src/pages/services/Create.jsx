import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";
import HeaderCreate from "@/components/HeaderCreate";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const codeRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    base_price: 0,
    front_view_image: null,
    back_view_image: null,
  });

  const [previews, setPreviews] = useState({ front: null, back: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, [name]: file }));
      setPreviews((prev) => ({
        ...prev,
        [name === "front_view_image" ? "front" : "back"]:
          URL.createObjectURL(file),
      }));
    }
  };

  useEffect(() => {
    codeRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    try {
      setProcessing(true);
      const payload = new FormData();
      payload.append("code", formData.code);
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("base_price", formData.base_price);
      if (formData.front_view_image)
        payload.append("front_view_image", formData.front_view_image);
      if (formData.back_view_image)
        payload.append("back_view_image", formData.back_view_image);

      const response = await api.post("/api/services", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const service = response.data.data;
      navigate(`/dashboard/settings/services/${service.ulid}`, {
        state: {
          message: `Penambahan data jenis Layanan dengan nama ${service.name} berhasil..!!`,
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
      } else {
        setErrorMessage(
          err.response?.data?.message || "Gagal menyimpan data..!!",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Jenis Layanan"
          backUrl="/dashboard/settings/services"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        <div className="border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-6 mt-6 space-y-4 text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="w-44 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
              Kode
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="code"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Masukkan kode"
                ref={codeRef}
                value={formData.code}
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
              Jenis Layanan
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Masukkan jenis Layanan"
                value={formData.name}
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
              Harga Dasar
            </label>
            <div className="flex-1">
              <input
                type="number"
                name="base_price"
                className="spinner-disabled w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Masukkan harga dasar"
                value={formData.base_price}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
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
                    checked={formData.category === "tailoring"}
                    onChange={handleChange}
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
                    checked={formData.category === "material_sale"}
                    onChange={handleChange}
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
                    checked={formData.category === "other"}
                    onChange={handleChange}
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

          <div className="flex flex-col sm:flex-row sm:items-start pt-2">
            <label className="w-44 text-sm font-medium text-slate-300 mt-2">
              Gambar Tampak Depan
            </label>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                name="front_view_image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
              />
              {previews.front && (
                <img
                  src={previews.front}
                  alt="Depan"
                  className="w-32 h-32 object-cover rounded-xl border border-slate-800 bg-slate-950 p-1"
                />
              )}
              {getErrors.front_view_image && (
                <span className="text-red-400 text-xs block">
                  {getErrors.front_view_image[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start pt-2">
            <label className="w-44 text-sm font-medium text-slate-300 mt-2">
              Gambar Tampak Belakang
            </label>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                name="back_view_image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
              />
              {previews.back && (
                <img
                  src={previews.back}
                  alt="Belakang"
                  className="w-32 h-32 object-cover rounded-xl border border-slate-800 bg-slate-950 p-1"
                />
              )}
              {getErrors.back_view_image && (
                <span className="text-red-400 text-xs block">
                  {getErrors.back_view_image[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
