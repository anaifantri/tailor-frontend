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
  const location = useLocation();
  const { token } = useAuth();

  const categories = [
    {
      category: "tailoring",
      name: "Jahit",
    },
    {
      category: "material_sale",
      name: "Bahan",
    },
    {
      category: "other",
      name: "Lainnya",
    },
  ];
  const message = location.state?.message;
  const failed = location.state?.failed;

  const [services, setServices] = useState([]);
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
        const response = await api.get("/api/services", {
          params: {
            page: currentPage,
            per_page: perPage,
            search,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setServices(response.data.data || []);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
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
        title="Daftar Jenis Pakaian"
        addTitle="Tambah Jenis Pakaian"
        addUrl="/dashboard/settings/services/create"
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
            placeholder="search"
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
              <th className="px-4 py-3.5 text-center">Kode</th>
              <th className="px-4 py-3.5">Jenis Layanan</th>
              <th className="px-4 py-3.5 text-center">Katagori</th>
              <th className="px-4 py-3.5 text-center">Harga</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {services.length > 0 ? (
              services.map((service, index) => {
                const getCategory = categories.find(
                  (category) => category.category === service.category,
                );
                return (
                  <tr
                    key={service.ulid || index}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-center text-slate-400">
                      {getRowNumber(index)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-brand-accent">
                      {service.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {service.name}
                    </td>
                    <td className="px-4 py-3 uppercase text-slate-300 text-center">
                      {getCategory.name}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-brand-accent">
                      {Number(service.base_price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TdAction
                        showUrl={`/dashboard/settings/services/${service.ulid}`}
                        editUrl={`/dashboard/settings/services/edit/${service.ulid}`}
                        deleteUrl="/api/services"
                        deleteId={service.ulid}
                        getToken={token}
                        returnUrl="/dashboard/settings/services"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  Data jenis pakaian tidak ditemukan.
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
//   const location = useLocation();
//   const { token } = useAuth();

//   const message = location.state?.message;
//   const failed = location.state?.failed;

//   const [services, setServices] = useState([]);
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
//         const response = await api.get("/api/services", {
//           params: {
//             page: currentPage,
//             per_page: perPage,
//             search,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setServices(response.data.data || []);
//         setCurrentPage(response.data.current_page || 1);
//         setTotalPages(response.data.last_page || 1);
//         setTotalItems(response.data.total || 0);
//       } catch (err) {
//         setError(err.response?.data?.message || "Gagal memuat data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchData();
//     }
//   }, [currentPage, perPage, search, token, message]);

//   const handlePerPageChange = (e) => {
//     setPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const getRowNumber = (index) => (currentPage - 1) * perPage + index + 1;

//   if (loading) return <LoadingData />;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="w-220 px-10">
//       <HeaderIndex
//         title="Daftar Jenis Pakaian"
//         addTitle="Tambah Jenis Pakaian"
//         addUrl="/dashboard/settings/services/create"
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
//           <label className="flex w-20 text-sm">Pencarian</label>
//           <input
//             type="text"
//             placeholder="search"
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
//               <th className="px-4 py-2">Jenis Pakaian</th>
//               <th className="px-4 py-2">Kategori</th>
//               <th className="px-4 py-2 text-center">Harga</th>
//               <th className="px-4 py-2 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {services.length > 0 ? (
//               services.map((service, index) => (
//                 <tr
//                   key={service.ulid || index}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="px-4 py-1 text-center">
//                     {getRowNumber(index)}
//                   </td>
//                   <td className="px-4 py-1 text-center">{service.code}</td>
//                   <td className="px-4 py-1">{service.name}</td>
//                   <td className="px-4 py-1 uppercase">{service.category}</td>
//                   <td className="px-4 py-1 text-center">
//                     {Number(service.base_price).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-1 text-center">
//                     <TdAction
//                       showUrl={`/dashboard/settings/services/${service.ulid}`}
//                       editUrl={`/dashboard/settings/services/edit/${service.ulid}`}
//                       deleteUrl="/api/services"
//                       deleteId={service.ulid}
//                       getToken={token}
//                       returnUrl="/dashboard/settings/services"
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="text-center py-4">
//                   Data jenis pakaian tidak ditemukan.
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
