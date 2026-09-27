import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
import ProfileSvg from "@/assets/Svg/ProfileSvg";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { ulid } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const nameRef = useRef();

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [specialty, setSpecialty] = useState([]);
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [editTailor, setEditTailor] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    is_active: 1,
  });

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClothingTypes = async () => {
      try {
        setLoadingSpecialties(true);
        const response = await api.get("/api/clothing-types", {
          params: { per_page: 100 },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.data || response.data || [];
        const types = data.map((item) => item.type).filter(Boolean);
        setSpecialtiesList(types);
      } catch (err) {
        console.error("Gagal memuat jenis pakaian:", err);
      } finally {
        setLoadingSpecialties(false);
      }
    };

    if (token) {
      fetchClothingTypes();
    }
  }, [token]);

  const handleCbChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSpecialty((prev) => [...prev, value]);
    } else {
      setSpecialty((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setEditTailor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/tailors/${ulid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.tailor;

        setEditTailor({
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
          phone: data.phone || "",
          is_active: data.is_active ? 1 : 0,
        });

        setPhotoPreview(data.photo || "");
        if (Array.isArray(data.specialty)) {
          setSpecialty(data.specialty);
        } else if (typeof data.specialty === "string") {
          setSpecialty(JSON.parse(data.specialty));
        } else {
          setSpecialty([]);
        }
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data?.message || "Data tidak ditemukan");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ulid, token]);

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
        Error: {error}
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", editTailor.name);
    if (editTailor.address) formData.append("address", editTailor.address);
    if (editTailor.email) formData.append("email", editTailor.email);
    formData.append("phone", editTailor.phone);
    formData.append("is_active", editTailor.is_active);

    specialty.forEach((item, index) => {
      formData.append(`specialty[${index}]`, item);
    });

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      setProcessing(true);
      const response = await api.post(`/api/tailors/${ulid}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTailor = response.data;
      navigate(`/dashboard/tailors/tailors/${updatedTailor.ulid}`, {
        state: { message: "Berhasil mengubah data tukang jahit..!!" },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else if (err.response?.data?.errors) {
        setGetErrors(err.response.data.errors);
        nameRef.current?.focus();
        setErrorMessage("Update gagal, periksa inputan Anda..!!");
      } else {
        setErrorMessage("Gagal memperbarui data..!!");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Tukang Jahit"
          backUrl="/dashboard/tailors/tailors"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 my-4 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="flex flex-col items-center justify-center col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="w-full flex flex-col items-center">
              <div className="w-60 h-60 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Svg title="Profile" c={"w-32 h-32 fill-slate-700"}>
                    <ProfileSvg />
                  </Svg>
                )}
              </div>
              {getErrors?.photo && (
                <span className="text-rose-400 text-xs mt-2 text-center">
                  {getErrors.photo[0]}
                </span>
              )}
              <div className="mt-4">
                <input
                  type="file"
                  name="photo"
                  ref={fileInputRef}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  accept="image/jpeg,image/jpg,image/png"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  Ganti Foto
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl col-span-2 p-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Nama <span className="text-rose-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Input Nama Lengkap"
                    autoComplete="off"
                    ref={nameRef}
                    value={editTailor.name}
                    onChange={handleChange}
                    required
                  />
                  {getErrors?.name && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.name[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start">
                <label className="w-36 text-sm font-medium text-slate-300 mt-2 mb-1 sm:mb-0">
                  Alamat
                </label>
                <div className="flex-1">
                  <textarea
                    name="address"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    rows={3}
                    value={editTailor.address}
                    onChange={handleChange}
                  />
                  {getErrors?.address && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.address[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Nomor Hp. <span className="text-rose-500">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    name="phone"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Input Nomor Hp."
                    autoComplete="off"
                    value={editTailor.phone}
                    onChange={handleChange}
                    required
                  />
                  {getErrors?.phone && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.phone[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Email
                </label>
                <div className="flex-1">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Input email"
                    autoComplete="off"
                    value={editTailor.email}
                    onChange={handleChange}
                  />
                  {getErrors?.email && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.email[0]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-36 text-sm font-medium text-slate-300 mb-1 sm:mb-0">
                  Status
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input
                      type="radio"
                      name="is_active"
                      value={1}
                      checked={Number(editTailor.is_active) === 1}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-slate-700 bg-slate-950 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input
                      type="radio"
                      name="is_active"
                      value={0}
                      checked={Number(editTailor.is_active) === 0}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-slate-700 bg-slate-950 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    <span>Non Aktif</span>
                  </label>
                </div>
              </div>
              {getErrors?.is_active && (
                <span className="text-rose-400 text-xs block mt-1">
                  {getErrors.is_active[0]}
                </span>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start pt-2">
                <label className="w-36 text-sm font-medium text-slate-300 mt-1 mb-1 sm:mb-0">
                  Keahlian
                </label>
                <div className="flex-1">
                  {loadingSpecialties ? (
                    <span className="text-slate-500 text-sm">
                      Memuat keahlian...
                    </span>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/50 p-4 border border-slate-800 rounded-xl">
                      {specialtiesList.map((item, index) => (
                        <label
                          className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            value={item}
                            checked={specialty.includes(item)}
                            onChange={handleCbChange}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {getErrors?.specialty && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {getErrors.specialty[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
