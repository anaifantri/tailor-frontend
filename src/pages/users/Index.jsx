import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
import Pagination from "@/components/Pagination";
import TdAction from "@/components/TdAction";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "@/components/LoadingData";

export default function Index() {
  const [searchParams] = useSearchParams();
  const deleteMessage = searchParams.get("message");
  const failedDelete = searchParams.get("failed");
  const location = useLocation();
  const { token } = useAuth();
  const message = location.state?.message;
  const failed = location.state?.failed;

  const [users, setUsers] = useState([]);
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
        setLoading(true);
        const response = await api.get("/api/users", {
          params: {
            page: currentPage,
            per_page: perPage,
            search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data.data || []);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Gagal mengambil data dari server.",
        );
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

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div className="p-4 text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <HeaderIndex
        title="Daftar Pengguna"
        addTitle="Tambah Pengguna"
        addUrl="/dashboard/settings/users/create"
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-2">
          <span className="text-sm text-gray-600">Tampilkan</span>
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className="w-14 px-2 ml-2 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span className="text-sm text-gray-600 ml-1">data</span>
        </div>

        <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-2">
          <label className="flex text-sm text-gray-600 mr-2">Pencarian</label>
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={handleSearchChange}
            className="px-2 py-0,5 border rounded text-sm focus:outline-none"
          />
        </div>
      </div>

      {message && <SuccessMessage message={message} duration="3000" />}
      {failed && <FailedMessage message={failed} duration="3000" />}

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4">
        <table className="table-auto w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700">
            <tr>
              <th className="p-3 text-center">No.</th>
              <th className="p-3">Nama</th>
              <th className="p-3 text-center">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">No. HP</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((item, index) => (
                <tr
                  key={item.ulid || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2 text-center">
                    {getRowNumber(index)}
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-3 py-2 text-center">{item.username}</td>
                  <td className="px-3 py-2">{item.email}</td>
                  <td className="px-3 py-2 text-center">{item.phone}</td>
                  <td className="px-3 py-2 text-center">
                    <TdAction
                      showUrl={`/dashboard/settings/users/${item.ulid}`}
                      editUrl={`/dashboard/settings/users/edit/${item.ulid}`}
                      deleteUrl="/api/users"
                      deleteId={item.ulid}
                      getToken={token}
                      returnUrl="/dashboard/settings/users"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  Tidak ada data pengguna.
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
