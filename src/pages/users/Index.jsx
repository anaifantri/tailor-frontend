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
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch data all user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
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
        <HeaderIndex
          title="Daftar Pengguna"
          addTitle="Tambah Pengguna"
          addUrl="/dashboard/users/create"
        />
        {deleteMessage && (
          <SuccessMessage message={deleteMessage} duration="3000" />
        )}
        {failedDelete && (
          <FailedMessage message={failedDelete} duration="3000" />
        )}
        {message && <SuccessMessage message={message} duration="3000" />}
        {failed && <FailedMessage message={failed} duration="3000" />}
        <table className="table-auto mt-2">
          <thead>
            <tr className="h-10 bg-stone-200">
              <th className="th-center w-10">No.</th>
              <th className="th-center w-40">Nama</th>
              <th className="th-center w-28">Username</th>
              <th className="th-center w-60">Email</th>
              <th className="th-center w-24">No. Hp.</th>
              <th className="th-center w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr className="bg-white" key={index}>
                <td className="td-center">{index + 1}</td>
                <td className="td-center">{user.name}</td>
                <td className="td-center">{user.username}</td>
                <td className="td-center">{user.email}</td>
                <td className="td-center">{user.phone}</td>
                <td className="td-center">
                  <TdAction
                    showUrl={`/dashboard/users/${user.hashed_id}`}
                    editUrl={`/dashboard/users/edit/${user.hashed_id}`}
                    deleteUrl="/api/users/destroy/"
                    deleteId={user.hashed_id}
                    getToken={token}
                    returnUrl="/dashboard/users"
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
