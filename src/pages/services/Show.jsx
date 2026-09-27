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

  const categories = [
    {
      category: "tailoring",
      name: "Jahit",
    },
    {
      category: "material_sale",
      name: "Bahan",
    },
    {
      category: "other",
      name: "Lainnya",
    },
  ];

  const [service, setService] = useState({
    ulid: "",
    code: "",
    name: "",
    category: "",
    base_price: "",
    front_view_image: null,
    back_view_image: null,
  });

  const getCategory = categories.find(
    (category) => category.category === service?.category,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/services/${ulid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setService(response.data.data);
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

    if (ulid && token) fetchData();
  }, [ulid, token]);

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      <HeaderShow
        titleShow={`Jenis Layanan | ${service.name}`}
        url="/settings/services"
        deleteUrl="/api/services"
        getId={service.ulid}
        token={token}
      />

      {message && <SuccessMessage message={message} duration="3000" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
        <div className="border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-3 space-y-4 text-center">
          <h3 className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-sm font-semibold p-2.5 rounded-lg border uppercase tracking-wide">
            Referensi Desain
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 block mb-1">
                Tampak Depan
              </span>
              {service.front_view_image ? (
                <img
                  src={service.front_view_image}
                  alt="Depan"
                  className="w-full h-52 object-cover rounded-xl border border-slate-800"
                />
              ) : (
                <div className="w-full h-52 flex items-center justify-center text-xs text-slate-600 bg-slate-950 border border-slate-800 rounded-xl">
                  No Image
                </div>
              )}
            </div>
            <div>
              <span className="text-xs text-slate-500 block mb-1">
                Tampak Belakang
              </span>
              {service.back_view_image ? (
                <img
                  src={service.back_view_image}
                  alt="Belakang"
                  className="w-full h-52 object-cover rounded-xl border border-slate-800"
                />
              ) : (
                <div className="w-full h-52 flex items-center justify-center text-xs text-slate-600 bg-slate-950 border border-slate-800 rounded-xl">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80 border border-slate-800 bg-slate-900/50 shadow-xl rounded-2xl p-3 text-slate-300">
          <h3 className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-sm font-semibold p-2.5 rounded-lg border text-center uppercase tracking-wide">
            Informasi Detail Layanan
          </h3>
          <div className="flex w-full p-5">
            <label className="w-32 text-slate-400">Kode</label>
            <span className="font-semibold text-slate-100">{service.code}</span>
          </div>
          <div className="flex w-full p-5">
            <label className="w-32 text-slate-400">Jenis Layanan</label>
            <span className="font-semibold text-slate-100">{service.name}</span>
          </div>
          <div className="flex w-full p-5">
            <label className="w-32 text-slate-400">Kategori Pakaian</label>
            <span className="font-semibold text-slate-100 uppercase">
              {getCategory.name}
            </span>
          </div>
          <div className="flex w-full p-5">
            <label className="w-32 text-slate-400">Harga Dasar</label>
            <span className="font-semibold text-indigo-400">
              {Number(service.base_price) !== 0
                ? `Rp ${Number(service.base_price).toLocaleString()}`
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
