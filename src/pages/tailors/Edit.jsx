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

  // Fetch daftar Jenis Pakaian (Clothing Types) dari Database
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
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

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
    <div className="w-250">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Tukang Jahit"
          backUrl="/dashboard/tailors/tailors"
          getProcessing={processing}
        />
        {errorMessage && (
          <div className="p-2 mb-2 text-sm text-red-600 bg-red-100 rounded">
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
                    alt="Foto Profil"
                    className="flex w-full mx-2 rounded"
                  />
                ) : (
                  <Svg title="Profile" c={"w-full fill-current mx-2"}>
                    <ProfileSvg />
                  </Svg>
                )}
              </div>
              {getErrors?.photo && (
                <span className="flex w-full text-red-500 text-xs items-center mt-2">
                  {getErrors.photo[0]}
                </span>
              )}
              <div className="flex-all-center mt-4">
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
                  className="flex p-2 h-8 w-120 border rounded"
                  placeholder="Input Nama Lengkap"
                  autoComplete="off"
                  ref={nameRef}
                  value={editTailor.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {getErrors?.name && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.name[0]}
                </span>
              )}

              <div className="flex mt-2">
                <label className="w-36">Alamat</label>
                <textarea
                  name="address"
                  className="flex p-1 w-120 border rounded"
                  rows={3}
                  value={editTailor.address}
                  onChange={handleChange}
                />
              </div>
              {getErrors?.address && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.address[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Nomor Hp.</label>
                <input
                  type="text"
                  name="phone"
                  className="flex p-2 h-8 w-120 border rounded"
                  placeholder="Input Nomor Hp."
                  autoComplete="off"
                  value={editTailor.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              {getErrors?.phone && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.phone[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Email</label>
                <input
                  type="email"
                  name="email"
                  className="flex p-2 h-8 w-120 border rounded"
                  placeholder="Input email"
                  autoComplete="off"
                  value={editTailor.email}
                  onChange={handleChange}
                />
              </div>
              {getErrors?.email && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.email[0]}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-36">Status</label>
                <input
                  type="radio"
                  name="is_active"
                  value={1}
                  checked={Number(editTailor.is_active) === 1}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label className="ml-2">Aktif</label>
                <input
                  type="radio"
                  name="is_active"
                  value={0}
                  checked={Number(editTailor.is_active) === 0}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ml-4"
                />
                <label className="ml-2">Non Aktif</label>
              </div>
              {getErrors?.is_active && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.is_active[0]}
                </span>
              )}

              <div className="flex mt-2">
                <label className="w-36">Keahlian</label>
                {loadingSpecialties ? (
                  <span className="text-gray-400 text-sm">
                    Memuat keahlian...
                  </span>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {specialtiesList.map((item, index) => (
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
                )}
              </div>
              {getErrors?.specialty && (
                <span className="flex w-full text-red-500 text-xs items-center mt-1">
                  {getErrors.specialty[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
