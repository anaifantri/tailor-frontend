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

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [clothingType, setClothingType] = useState({
    ulid: "",
    code: "",
    type: "",
    category: "",
    base_price: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/clothing-types/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.clothing_type;
        setClothingType({
          ulid: data.ulid || "",
          code: data.code || "",
          type: data.type || "",
          category: data.category || "",
          base_price: data.base_price || 0,
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

    if (ulid && token) {
      fetchData();
    }
  }, [ulid, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClothingType((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    try {
      setProcessing(true);
      const response = await api.put(
        `/api/clothing-types/${ulid}`,
        clothingType,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedType = response.data.clothing_type || response.data;
      navigate(`/dashboard/settings/clothing-types/${ulid}`, {
        state: {
          message: `Perubahan data jenis pakaian dengan nama ${updatedType.type || clothingType.type} berhasil..!!`,
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
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="w-160">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Data Jenis Pakaian"
          backUrl="/dashboard/settings/clothing-types"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-2 mt-2 text-sm text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <div className="border border-gray-200 shadow-lg rounded-xl px-6 py-4 mt-4">
          <div className="flex items-center">
            <label className="w-44">Kode</label>
            <input
              type="text"
              name="code"
              value={clothingType.code}
              className="flex p-2 h-8 w-100 border rounded"
              placeholder="Masukkan Kode"
              autoComplete="off"
              ref={codeRef}
              onChange={handleChange}
              required
            />
          </div>
          {getErrors.code && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.code[0]}
            </span>
          )}

          <div className="flex items-center mt-2">
            <label className="w-44">Jenis Pakaian</label>
            <input
              type="text"
              name="type"
              value={clothingType.type}
              className="flex p-2 h-8 w-100 border rounded"
              placeholder="Masukkan jenis pakaian"
              autoComplete="off"
              onChange={handleChange}
              required
            />
          </div>
          {getErrors.type && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.type[0]}
            </span>
          )}

          <div className="flex items-center mt-2">
            <label className="w-44">Harga</label>
            <input
              type="number"
              name="base_price"
              value={Number(clothingType.base_price)}
              className="flex p-2 h-8 w-100 border rounded spinner-disabled"
              autoComplete="off"
              placeholder="Masukkan harga"
              onChange={handleChange}
            />
          </div>
          {getErrors.base_price && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.base_price[0]}
            </span>
          )}

          <div className="flex items-center mt-2">
            <label className="w-44">Kategori Pakaian</label>
            <input
              type="radio"
              name="category"
              value="baju"
              onChange={handleChange}
              checked={clothingType.category === "baju"}
              required
            />
            <label className="ml-1">BAJU</label>
            <input
              className="ml-4"
              type="radio"
              name="category"
              value="celana"
              onChange={handleChange}
              checked={clothingType.category === "celana"}
              required
            />
            <label className="ml-1">CELANA</label>
            <input
              className="ml-4"
              type="radio"
              name="category"
              value="rok"
              onChange={handleChange}
              checked={clothingType.category === "rok"}
              required
            />
            <label className="ml-1">ROK</label>
          </div>
          {getErrors.category && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.category[0]}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
