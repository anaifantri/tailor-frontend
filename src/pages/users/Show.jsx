import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderShow from "@/components/HeaderShow";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Show() {
  const { id } = useParams(); // URL Param 'id' mewakili 'ulid'
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data);
      } catch (err) {
        if (!err?.response) {
          setError("Tidak ada respon dari server.");
        } else if (err.response?.status === 401) {
          setError("Akses tidak diizinkan (Unauthorized).");
        } else {
          setError(
            err.response.data?.message || "Terjadi kesalahan saat memuat data.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div className="p-4 text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <div>
      <HeaderShow
        titleShow="Data Pengguna"
        url="/settings/users"
        deleteUrl="/api/users"
        getId={user?.ulid}
        token={token}
      />

      {message && <SuccessMessage message={message} duration="3000" />}

      <div className="grid grid-cols-3 gap-4 mt-4 w-full">
        {/* Sisi Kiri - Foto Profil */}
        <div className="flex-all-center col-span-1">
          <div>
            <label className="flex-all-center w-full font-semibold">
              Foto Profil
            </label>
            {user?.photo ? (
              <img
                src={user.photo}
                alt="Foto Profil"
                className="flex border border-slate-200 shadow-xl w-56 h-56 mx-2 mt-2 rounded-full object-cover"
              />
            ) : (
              <Svg title="Profile" c={"w-56 h-56 fill-current mx-2 mt-2"}>
                <ProfileSvg />
              </Svg>
            )}
          </div>
        </div>

        {/* Sisi Kanan - Informasi Pengguna */}
        <div className="divide-y divide-gray-200 border border-slate-200 shadow-xl rounded-xl p-4 col-span-2 w-full text-base">
          <div className="pb-2">
            <label className="flex w-full text-sm text-gray-500">
              Nama Lengkap
            </label>
            <label className="flex font-semibold text-gray-800">
              {user?.name}
            </label>
          </div>

          <div className="py-2">
            <label className="flex text-sm text-gray-500">Username</label>
            <label className="flex font-semibold text-gray-800">
              {user?.username}
            </label>
          </div>

          <div className="py-2">
            <label className="flex text-sm text-gray-500">Email</label>
            <label className="flex font-semibold text-gray-800">
              {user?.email}
            </label>
          </div>

          <div className="py-2">
            <label className="flex text-sm text-gray-500">Nomor HP</label>
            <label className="flex font-semibold text-gray-800">
              {user?.phone}
            </label>
          </div>

          <div className="pt-2">
            <label className="flex text-sm text-gray-500">Status</label>
            <span
              className={`inline-block px-2 py-0,5 rounded text-xs font-semibold mt-1 ${
                user?.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user?.is_active ? "Aktif" : "Non Aktif"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
