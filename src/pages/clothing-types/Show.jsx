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
        setMeasurements(response.data.clothing_type.measurements);
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
      <div>
        <HeaderShow
          titleShow="Data Jenis Kain"
          url="/clothing-types"
          getId={clothingType.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="flex-all-center mt-4">
          <div className=" border rounded-xl p-2 texl-lg w-160">
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
            <div className="p-1 mt-2">
              <div className="flex">
                <label className="flex w-48 font-semibold">
                  Bagian yang perlu di ukur
                </label>
                <label>:</label>
              </div>
              {measurements.map((measurement, index) => (
                <div key={index} className="flex items-center mt-2">
                  <label className="w-6">{index + 1}. </label>
                  <label>{measurement.measurement}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
