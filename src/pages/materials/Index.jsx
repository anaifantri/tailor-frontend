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
  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  // fetch data all material
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/materials", {
          params: { search },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMaterials(response.data);
      } catch (error) {
        setError(error);
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
          title="Daftar Kain"
          addTitle="Tambah Data Kain"
          addUrl="/dashboard/materials/create"
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
              <th className="th-center w-28">Kode</th>
              <th className="th-center w-72">Nama Kain</th>
              <th className="th-center">Description</th>
              <th className="th-center w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
              <tr className="bg-white" key={index}>
                <td className="td-center">{index + 1}</td>
                <td className="td-center">{material.code}</td>
                <td className="td-center">{material.name}</td>
                <td className="td-left">{material.description}</td>
                <td className="td-center">
                  <TdAction
                    showUrl={`/dashboard/materials/${material.hashed_id}`}
                    editUrl={`/dashboard/materials/edit/${material.hashed_id}`}
                    deleteUrl="/api/materials/delete/"
                    deleteId={material.hashed_id}
                    getToken={token}
                    returnUrl="/dashboard/materials"
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
