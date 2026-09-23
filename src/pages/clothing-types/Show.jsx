import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

export default function Show() {
  const { ulid } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const [clothingType, setClothingType] = useState({
    ulid: "",
    code: "",
    type: "",
    category: "",
    base_price: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/clothing-types/${ulid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClothingType(response.data.clothing_type);
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

  if (loading) return <LoadingData />;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="w-200">
      <HeaderShow
        titleShow={`Jenis Pakaian ${clothingType.type}`}
        url="/settings/clothing-types"
        deleteUrl="/api/clothing-types"
        getId={clothingType.ulid}
        token={token}
      />

      {message && <SuccessMessage message={message} duration="3000" />}

      <div className="divide-y divide-gray-200 border border-gray-200 shadow-lg rounded-xl px-6 py-2 mt-4">
        <div className="w-full p-2">
          <label className="flex w-48">Kode</label>
          <label className="flex font-semibold">{clothingType.code}</label>
        </div>
        <div className="w-full p-2">
          <label className="flex w-48">Jenis Pakaian</label>
          <label className="flex font-semibold">{clothingType.type}</label>
        </div>
        <div className="w-full p-2">
          <label className="flex w-48">Kategori Pakaian</label>
          <label className="flex font-semibold uppercase">
            {clothingType.category}
          </label>
        </div>
        <div className="w-full p-2">
          <label className="flex w-48">Harga Dasar</label>
          <label className="flex font-semibold">
            {Number(clothingType.base_price) !== 0
              ? Number(clothingType.base_price).toLocaleString()
              : "-"}
          </label>
        </div>
      </div>
    </div>
  );
}
