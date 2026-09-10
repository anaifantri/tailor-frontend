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
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/customers", {
          params: {
            page: currentPage,
            per_page: perPage,
            search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, perPage, search]);

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getRowNumber = (index) => (currentPage - 1) * perPage + index + 1;

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
          addUrl="/dashboard/customers/create"
        />
        <div className="flex items-center">
          <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-2 mt-2">
            <span className="text-sm text-gray-600">Tampilkan</span>
            <select
              value={perPage}
              onChange={handlePerPageChange}
              className="w-14 px-2 ml-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 ml-1">data</span>
          </div>
          <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-2 mt-2 ml-6">
            <label className="flex w-20">Pencarian</label>
            <input
              type="text"
              placeholder="search"
              value={search}
              onChange={handleSearchChange}
              className="px-2"
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
              <th className="th-center w-24">Kode</th>
              <th className="th-center w-44">Nama</th>
              <th className="th-center">Alamat</th>
              <th className="th-center w-56">Email</th>
              <th className="th-center w-36">No. Hp.</th>
              <th className="th-center w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr className="bg-white" key={index}>
                <td className="td-center">{getRowNumber(index)}</td>
                <td className="td-center">{customer.code}</td>
                <td className="td-center">{customer.name}</td>
                <td className="td-left">{customer.address}</td>
                <td className="td-center">{customer.email}</td>
                <td className="td-center">{customer.phone}</td>
                <td className="td-center">
                  <TdAction
                    showUrl={`/dashboard/customers/${customer.hashed_id}`}
                    editUrl={`/dashboard/customers/edit/${customer.hashed_id}`}
                    deleteUrl="/api/customers/delete/"
                    deleteId={customer.hashed_id}
                    getToken={token}
                    returnUrl="/dashboard/customers"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={(page) => setCurrentPage(page)}
          loading={loading}
        />
      </div>
    </>
  );
}
