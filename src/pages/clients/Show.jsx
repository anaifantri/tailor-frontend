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

import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [client, setclient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/clients/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setclient(response.data.client);
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
          titleShow="Data Pelanggan"
          url="/clients"
          getId={client.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="flex-all-center mt-4">
          <div className=" border rounded-xl p-2 texl-lg w-160 h-60">
            <div className="flex w-full p-1">
              <label className="flex w-32">Nama</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{client.code}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Nama</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{client.name}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Alamat</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {client.address}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Nomor Hp.</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{client.phone}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Email</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{client.email}</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
