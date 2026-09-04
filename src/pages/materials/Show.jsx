import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderShow from "@/components/HeaderShow";
import BtnBack from "@/components/BtnBack";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

import ImageSvg from "@/assets/Svg/ImageSvg";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/materials/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMaterial(response.data.material);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
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
          titleShow="Data Kain"
          url="/materials"
          getId={material.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex-all-center col-span-1">
            {material.photo ? (
              <img
                src={material.photo}
                alt=""
                className="flex w-56 h-56 mx-2 rounded-full"
              />
            ) : (
              <Svg title="Profile" c={"w-36 fill-current mx-2"}>
                <ImageSvg />
              </Svg>
            )}
          </div>
          <div className=" border rounded-xl p-2 col-span-2 texl-lg w-120 h-60">
            <div className="flex w-full p-1">
              <label className="flex w-32">Kode Kain</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{material.code}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Nama Kain</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{material.name}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Deskripsi</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold w-80">
                {material.description}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Satuan</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{material.unit}</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
