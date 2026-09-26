import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
import TdAction from "@/components/TdAction";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "@/components/LoadingData";
import Pagination from "@/components/Pagination";

export default function Index() {
  const [searchParams] = useSearchParams();
  const deleteMessage = searchParams.get("message");
  const failedDelete = searchParams.get("failed");
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
        setLoading(true);
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

// import React, { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useLocation, useSearchParams } from "react-router-dom";

// import api from "@/apiService";

// import HeaderIndex from "@/components/HeaderIndex";
// import TdAction from "@/components/TdAction";
// import SuccessMessage from "@/components/SuccessMessage";
// import FailedMessage from "@/components/FailedMessage";
// import LoadingData from "@/components/LoadingData";
// import Pagination from "@/components/Pagination";

// export default function Index() {
//   const [searchParams] = useSearchParams();
//   const deleteMessage = searchParams.get("message");
//   const failedDelete = searchParams.get("failed");
//   const location = useLocation();
//   const { token } = useAuth();

//   const message = location.state?.message;
//   const failed = location.state?.failed;

//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);

//   const handleSearchChange = (event) => {
//     setSearch(event.target.value);
//     setCurrentPage(1);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/api/materials", {
//           params: {
//             page: currentPage,
//             per_page: perPage,
//             search,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setMaterials(response.data.data || []);
//         setCurrentPage(response.data.current_page || 1);
//         setTotalPages(response.data.last_page || 1);
//         setTotalItems(response.data.total || 0);
//       } catch (err) {
//         setError(err.response?.data?.message || "Gagal memuat data kain.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, perPage, search, token, message]);

//   const handlePerPageChange = (e) => {
//     setPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const getRowNumber = (index) => (currentPage - 1) * perPage + index + 1;

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

//   return (
//     <div className="w-full px-10">
//       <HeaderIndex
//         title="Daftar Kain"
//         addTitle="Tambah Data Kain"
//         addUrl="/dashboard/settings/materials/create"
//       />

//       <div className="flex items-center">
//         <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-2 mt-2">
//           <span className="text-sm text-gray-600">Tampilkan</span>
//           <select
//             value={perPage}
//             onChange={handlePerPageChange}
//             className="w-14 px-2 ml-2"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//           </select>
//           <span className="text-sm text-gray-600 ml-1">data</span>
//         </div>

//         <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-2 mt-2 ml-6">
//           <label className="flex w-20">Pencarian</label>
//           <input
//             type="text"
//             placeholder="Cari kain..."
//             value={search}
//             onChange={handleSearchChange}
//             className="px-2 border rounded"
//           />
//         </div>
//       </div>

//       {message && <SuccessMessage message={message} duration="3000" />}
//       {failed && <FailedMessage message={failed} duration="3000" />}

//       <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mt-4">
//         <table className="table-auto w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
//           <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
//             <tr>
//               <th className="px-4 py-2 text-center">No.</th>
//               <th className="px-4 py-2 text-center">Nomor Kain</th>
//               <th className="px-4 py-2">Nama Kain</th>
//               <th className="px-4 py-2 text-center">Stok Awal</th>
//               <th className="px-4 py-2 text-center">Stok Saat Ini</th>
//               <th className="px-4 py-2">Deskripsi</th>
//               <th className="px-4 py-2 text-center">Aksi</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {materials.length > 0 ? (
//               materials.map((material, index) => (
//                 <tr
//                   key={material.ulid}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="px-4 py-1 text-center">
//                     {getRowNumber(index)}
//                   </td>
//                   <td className="px-4 py-1 text-center">{material.code}</td>
//                   <td className="px-4 py-1 font-medium text-gray-900">
//                     {material.name}
//                   </td>
//                   <td className="px-4 py-1 text-center">
//                     {material.initial_stock} {material.unit}
//                   </td>
//                   <td className="px-4 py-1 text-center">
//                     {material.stock} {material.unit}
//                   </td>
//                   <td className="px-4 py-1">{material.description || "-"}</td>
//                   <td className="px-4 py-1 text-center">
//                     <TdAction
//                       showUrl={`/dashboard/settings/materials/${material.ulid}`}
//                       editUrl={`/dashboard/settings/materials/edit/${material.ulid}`}
//                       deleteUrl={`/api/materials`}
//                       deleteId={material.ulid}
//                       getToken={token}
//                       returnUrl="/dashboard/settings/materials"
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="text-center py-4 text-gray-500">
//                   Data tidak ditemukan.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalItems={totalItems}
//         onPageChange={(page) => setCurrentPage(page)}
//         loading={loading}
//       />
//     </div>
//   );
// }
