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
  const [clothingTypes, setClothingTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/clothing-types", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClothingTypes(response.data);
      } catch (error) {
        setError(error);
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
      <div className="w-150">
        <HeaderIndex
          title="Daftar Jenis Pakaian"
          addTitle="Tambah Jenis Pakaian"
          addUrl="/dashboard/clothing-types/create"
        />
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
              <th className="th-center">Jenis Pakaian</th>
              <th className="th-center w-24">Harga</th>
              <th className="th-center w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {clothingTypes.map((type, index) => (
              <tr className="bg-white" key={index}>
                <td className="td-center">{index + 1}</td>
                <td className="td-center">{type.code}</td>
                <td className="td-left">{type.type}</td>
                <td className="td-right">
                  {Number(type.base_price).toLocaleString()}
                </td>
                <td className="td-center">
                  <TdAction
                    showUrl={`/dashboard/clothing-types/${type.hashed_id}`}
                    editUrl={`/dashboard/clothing-types/edit/${type.hashed_id}`}
                    deleteUrl="/api/clothing-types/delete/"
                    deleteId={type.hashed_id}
                    getToken={token}
                    returnUrl="/dashboard/clothing-types"
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
