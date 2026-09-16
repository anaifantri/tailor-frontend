import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [clothingType, setClothingType] = useState({
    hashed_id: "",
    code: "",
    type: "",
    base_price: "",
  });
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/clothing-types/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClothingType(response.data.clothing_type);
        setMeasurements(response.data.clothing_type.measurement_details);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
          console.log(err.response.data);
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

  return (
    <>
      <div className="w-160">
        <HeaderShow
          titleShow="Data Jenis Kain"
          url="/settings/clothing-types"
          deleteUrl="/clothing-types"
          getId={clothingType.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="border border-gray-200 shadow-lg rounded-xl px-6 py-2 mt-4">
          <div className="flex w-full p-1">
            <label className="flex w-48">Kode</label>
            <label>:</label>
            <label className="flex ml-2 font-semibold">
              {clothingType.code}
            </label>
          </div>
          <div className="flex w-full p-1">
            <label className="flex w-48">Jenis Pakaian</label>
            <label>:</label>
            <label className="flex ml-2 font-semibold">
              {clothingType.type}
            </label>
          </div>
          <div className="flex w-full p-1">
            <label className="flex w-48">Harga</label>
            <label>:</label>
            <label className="flex ml-2 font-semibold">
              {clothingType.base_price != 0
                ? Number(clothingType.base_price).toLocaleString()
                : "-"}
            </label>
          </div>
          <div className="flex mt-6">
            <label className="flex w-48 font-semibold">
              Bagian yang perlu di ukur
            </label>
            <label>:</label>
          </div>
          <div className="divide-y divide-gray-200">
            {measurements?.map((measurement, index) => (
              <div key={index} className="flex items-center mt-2">
                <label className="w-6">{index + 1}. </label>
                <label>{measurement.measurement}</label>
              </div>
            ))}
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
