import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
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
  const [tailors, setTailors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  // fetch data all tailor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/tailors", {
          params: { search },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTailors(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="w-300">
        <HeaderIndex
          title="Daftar Tukang Jahit"
          addTitle="Tambah Tukang Jahit"
          addUrl="/dashboard/tailors/create"
        />
        <div className="flex items-center">
          <div className="flex items-center mt-2">
            <label className="flex w-20">Pencarian</label>
            <input
              type="text"
              placeholder="search"
              value={search}
              onChange={handleSearchChange}
              className="py-1 px-2"
            />
          </div>
        </div>
        {deleteMessage && (
          <SuccessMessage message={deleteMessage} duration="3000" />
        )}
        {failedDelete && (
          <FailedMessage message={failedDelete} duration="3000" />
        )}
        {message && <SuccessMessage message={message} duration="3000" />}
        {failed && <FailedMessage message={failed} duration="3000" />}
        <table className="table-auto mt-2 w-full">
          <thead>
            <tr className="h-10 bg-stone-200">
              <th className="th-center w-10">No.</th>
              <th className="th-center w-20">Kode</th>
              <th className="th-center w-40">Nama</th>
              <th className="th-center">Alamat</th>
              <th className="th-center w-60">Email</th>
              <th className="th-center w-28">No. Hp.</th>
              <th className="th-center w-20">Status</th>
              <th className="th-center w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {tailors.map((tailor, index) => (
              <tr className="bg-white" key={index}>
                <td className="td-center">{index + 1}</td>
                <td className="td-center">{tailor.code}</td>
                <td className="td-center">{tailor.name}</td>
                <td className="td-left">{tailor.address}</td>
                <td className="td-center">{tailor.email}</td>
                <td className="td-center">{tailor.phone}</td>
                <td className="td-center">
                  {tailor.is_active ? "Aktif" : "Non Aktif"}
                </td>
                <td className="td-center">
                  <TdAction
                    showUrl={`/dashboard/tailors/${tailor.hashed_id}`}
                    editUrl={`/dashboard/tailors/edit/${tailor.hashed_id}`}
                    deleteUrl="/api/tailors/delete/"
                    deleteId={tailor.hashed_id}
                    getToken={token}
                    returnUrl="/dashboard/tailors"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
