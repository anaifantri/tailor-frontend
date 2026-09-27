import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
import TdAction from "@/components/TdAction";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "@/components/LoadingData";
import Pagination from "@/components/Pagination";

export default function Index() {
  const location = useLocation();
  const { token } = useAuth();

  const message = location.state?.message;
  const failed = location.state?.failed;

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/materials", {
          params: {
            page: currentPage,
            per_page: perPage,
            search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMaterials(response.data.data || []);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data kain.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage, search, token, message]);

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getRowNumber = (index) => (currentPage - 1) * perPage + index + 1;

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full px-4 sm:px-8">
      <HeaderIndex
        title="Daftar Bahan"
        addTitle="Tambah Data Kain"
        addUrl="/dashboard/settings/materials/create"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <div className="flex items-center border border-slate-800 bg-slate-900/50 rounded-xl py-2 px-3">
          <span className="text-sm text-slate-400">Tampilkan</span>
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-2 py-1 mx-2 focus:outline-none focus:border-indigo-500"
          >
            <option value={5} className="bg-slate-900 text-slate-300">
              5
            </option>
            <option value={10} className="bg-slate-900 text-slate-300">
              10
            </option>
            <option value={25} className="bg-slate-900 text-slate-300">
              25
            </option>
            <option value={50} className="bg-slate-900 text-slate-300">
              50
            </option>
            <option value={100} className="bg-slate-900 text-slate-300">
              100
            </option>
          </select>
          <span className="text-sm text-slate-400">data</span>
        </div>

        <div className="flex items-center border border-slate-800 bg-slate-900/50 rounded-xl py-2 px-3">
          <label className="text-sm text-slate-400 mr-3">Pencarian</label>
          <input
            type="text"
            placeholder="Cari kain..."
            value={search}
            onChange={handleSearchChange}
            className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {message && <SuccessMessage message={message} duration="3000" />}
      {failed && <FailedMessage message={failed} duration="3000" />}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl mt-6">
        <table className="table-auto w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3.5 text-center">No.</th>
              <th className="px-4 py-3.5 text-center">Kode Kain / Bahan</th>
              <th className="px-4 py-3.5">Nama Kain / Bahan</th>
              <th className="px-4 py-3.5 text-center">Stok</th>
              <th className="px-4 py-3.5">Deskripsi</th>
              <th className="px-4 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {materials.length > 0 ? (
              materials.map((material, index) => (
                <tr
                  key={material.ulid}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 text-center text-slate-400">
                    {getRowNumber(index)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300">
                    {material.code}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-100">
                    {material.name}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-indigo-400">
                    {material.stock} {material.unit}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {material.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TdAction
                      showUrl={`/dashboard/settings/materials/${material.ulid}`}
                      editUrl={`/dashboard/settings/materials/edit/${material.ulid}`}
                      deleteUrl={`/api/materials`}
                      deleteId={material.ulid}
                      getToken={token}
                      returnUrl="/dashboard/settings/materials"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-500">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
        loading={loading}
      />
    </div>
  );
}
