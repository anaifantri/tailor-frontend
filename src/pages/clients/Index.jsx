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
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch data all client
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
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
      <div className="w-300">
        <HeaderIndex
          title="Daftar Pelanggan"
          addTitle="Tambah Pelanggan"
          addUrl="/dashboard/clients/create"
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
              <th className="th-center w-28">Kode</th>
              <th className="th-center w-40">Nama</th>
              <th className="th-center">Alamat</th>
              <th className="th-center w-60">Email</th>
              <th className="th-center w-28">No. Hp.</th>
              <th className="th-center w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr className="bg-white" key={index}>
                <td className="td-center">{index + 1}</td>
                <td className="td-center">{client.code}</td>
                <td className="td-center">{client.name}</td>
                <td className="td-left">{client.address}</td>
                <td className="td-center">{client.email}</td>
                <td className="td-center">{client.phone}</td>
                <td className="td-center">
                  <TdAction
                    showUrl={`/dashboard/clients/${client.hashed_id}`}
                    editUrl={`/dashboard/clients/edit/${client.hashed_id}`}
                    deleteUrl="/api/clients/delete/"
                    deleteId={client.hashed_id}
                    getToken={token}
                    returnUrl="/dashboard/clients"
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
