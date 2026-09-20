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
  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialty, setSpecialty] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/tailors/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTailor(response.data.tailor);
        setSpecialty(JSON.parse(response.data.tailor.specialty));
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
          console.log(err.response.data.message);
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
      <div className="w-250">
        <HeaderShow
          titleShow="Data Tukang Jahit"
          url="/tailors/tailors"
          deleteUrl="/tailors"
          getId={tailor.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex-all-center col-span-1 border border-gray-200 shadow-lg rounded-xl px-8">
            <div>
              <span className="flex justify-center w-full">Foto Profil</span>
              {tailor.photo ? (
                <img src={tailor.photo} alt="" className="flex w-full mt-6" />
              ) : (
                <Svg title="Profile" c={"w-full fill-current mt-6"}>
                  <ProfileSvg />
                </Svg>
              )}
            </div>
          </div>
          <div className="flex border border-gray-200 shadow-lg rounded-xl col-span-2 p-8">
            <div className="divide-y divide-gray-400 w-full">
              <div className="flex w-full p-2">
                <label className="flex w-32">ID Penjahit</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {tailor.code ? tailor.code : "-"}
                </label>
              </div>
              <div className="flex w-full p-2">
                <label className="flex w-32">Nama Penjahit</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {tailor.name ? tailor.name : "-"}
                </label>
              </div>
              <div className="flex w-full p-2">
                <label className="flex w-32">Alamat</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {tailor.address ? tailor.address : "-"}
                </label>
              </div>
              <div className="flex w-full p-2">
                <label className="flex w-32">Nomor Hp.</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {tailor.phone ? tailor.phone : "-"}
                </label>
              </div>
              <div className="flex w-full p-2">
                <label className="flex w-32">Email</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {tailor.email ? tailor.email : "-"}
                </label>
              </div>
              <div className="flex w-full p-2">
                <label className="flex w-32">Status</label>
                <label>:</label>
                <label className="flex ml-2 font-semibold">
                  {tailor.is_active ? "Aktif" : "Non Aktif"}
                </label>
              </div>
              <div className="flex w-full px-1">
                <label className="flex w-32 mt-2">Keahlian</label>
                <label className="mt-2">:</label>
                <div className="grid grid-cols-3 gap-4 ml-2">
                  {specialty.map((item, index) => (
                    <div key={index} className="flex mt-2 font-semibold">
                      <input
                        type="checkbox"
                        readOnly
                        checked={specialty.includes(item)}
                        className="w-5 h-5 rounded-md border-gray-300 text-indigo-600"
                      />
                      <label className="ml-2">{item}</label>
                    </div>
                  ))}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
