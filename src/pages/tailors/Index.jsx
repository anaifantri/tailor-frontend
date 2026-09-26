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
  const [tailors, setTailors] = useState([]);
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
        const response = await api.get("/api/tailors", {
          params: {
            page: currentPage,
            per_page: perPage,
            search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTailors(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
      } catch (err) {
        setError("Gagal memuat data tukang jahit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, perPage, search, token]);

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getRowNumber = (index) => (currentPage - 1) * perPage + index + 1;

  if (loading) return <LoadingData />;
  if (error)
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full space-y-4">
      <HeaderIndex
        title="Daftar Tukang Jahit"
        addTitle="Tambah Tukang Jahit"
        addUrl="/dashboard/tailors/tailors/create"
      />

      {/* Control Bar: Limit & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Tampilkan</span>
          <select
            value={perPage}
            onChange={handlePerPageChange}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-slate-400">data</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm text-slate-400">Pencarian:</label>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-64 px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {message && <SuccessMessage message={message} duration="3000" />}
      {failed && <FailedMessage message={failed} duration="3000" />}

      {/* Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 text-center">No.</th>
              <th className="px-4 py-3 text-center">Kode</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Alamat</th>
              <th className="px-4 py-3 text-center">No. Hp.</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tailors.length > 0 ? (
              tailors.map((tailor, index) => (
                <tr
                  key={tailor.ulid}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-center text-slate-400">
                    {getRowNumber(index)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-indigo-400">
                    {tailor.code}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {tailor.name}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {tailor.address || "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">
                    {tailor.phone}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        tailor.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {tailor.is_active ? "Aktif" : "Non Aktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TdAction
                      showUrl={`/dashboard/tailors/tailors/${tailor.ulid}`}
                      editUrl={`/dashboard/tailors/tailors/edit/${tailor.ulid}`}
                      deleteUrl="/api/tailors"
                      deleteId={tailor.ulid}
                      getToken={token}
                      returnUrl="/dashboard/tailors/tailors"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-500">
                  Tidak ada data tukang jahit.
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
//   const [tailors, setTailors] = useState([]);
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
//         const response = await api.get("/api/tailors", {
//           params: {
//             page: currentPage,
//             per_page: perPage,
//             search,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setTailors(response.data.data);
//         setCurrentPage(response.data.current_page);
//         setTotalPages(response.data.last_page);
//         setTotalItems(response.data.total);
//       } catch (err) {
//         setError("Gagal memuat data tukang jahit");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentPage, perPage, search, token]);

//   const handlePerPageChange = (e) => {
//     setPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const getRowNumber = (index) => (currentPage - 1) * perPage + index + 1;

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="w-full p-4">
//       <HeaderIndex
//         title="Daftar Tukang Jahit"
//         addTitle="Tambah Tukang Jahit"
//         addUrl="/dashboard/tailors/tailors/create"
//       />
//       <div className="flex items-center">
//         <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-2 mt-2">
//           <span className="text-sm text-gray-600">Tampilkan</span>
//           <select
//             value={perPage}
//             onChange={handlePerPageChange}
//             className="w-14 px-2 ml-2"
//           >
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
//             placeholder="Search..."
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
//               <th className="px-4 py-2 text-center">Kode</th>
//               <th className="px-4 py-2">Nama</th>
//               <th className="px-4 py-2">Alamat</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2 text-center">No. Hp.</th>
//               <th className="px-4 py-2 text-center">Status</th>
//               <th className="px-4 py-2 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {tailors.length > 0 ? (
//               tailors.map((tailor, index) => (
//                 <tr
//                   key={tailor.ulid}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="px-4 py-1 text-center">
//                     {getRowNumber(index)}
//                   </td>
//                   <td className="px-4 py-1 text-center">{tailor.code}</td>
//                   <td className="px-4 py-1">{tailor.name}</td>
//                   <td className="px-4 py-1">{tailor.address || "-"}</td>
//                   <td className="px-4 py-1">{tailor.email || "-"}</td>
//                   <td className="px-4 py-1 text-center">{tailor.phone}</td>
//                   <td className="px-4 py-1 text-center">
//                     {tailor.is_active ? "Aktif" : "Non Aktif"}
//                   </td>
//                   <td className="px-4 py-1 text-center">
//                     <TdAction
//                       showUrl={`/dashboard/tailors/tailors/${tailor.ulid}`}
//                       editUrl={`/dashboard/tailors/tailors/edit/${tailor.ulid}`}
//                       deleteUrl="/api/tailors"
//                       deleteId={tailor.ulid}
//                       getToken={token}
//                       returnUrl="/dashboard/tailors/tailors"
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4 text-gray-400">
//                   Tidak ada data tukang jahit.
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
