import React from "react";

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  loading,
}) {
  // Jangan render komponen jika total halaman hanya 1 atau kurang
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border border-slate-800 bg-slate-900 px-4 py-3 rounded-2xl shadow-xl mt-4">
      {/* Tampilan Mobile (Hanya tombol Sebelumnya & Selanjutnya) */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={currentPage === 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
          className="disabled:opacity-40 disabled:cursor-not-allowed relative inline-flex items-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          Sebelumnya
        </button>
        <button
          disabled={currentPage === totalPages || loading}
          onClick={() => onPageChange(currentPage + 1)}
          className="disabled:opacity-40 disabled:cursor-not-allowed relative ml-3 inline-flex items-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          Selanjutnya
        </button>
      </div>

      {/* Tampilan Desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Menampilkan total{" "}
            <span className="font-semibold text-slate-200">{totalItems}</span>{" "}
            data (Halaman{" "}
            <span className="font-semibold text-slate-200">{currentPage}</span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-200">{totalPages}</span>)
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-xl shadow-sm border border-slate-800 bg-slate-950 overflow-hidden"
            aria-label="Pagination"
          >
            {/* Tombol Panah Kiri */}
            <button
              disabled={currentPage === 1 || loading}
              onClick={() => onPageChange(currentPage - 1)}
              className="disabled:opacity-40 disabled:cursor-not-allowed relative inline-flex items-center px-3 py-2 text-slate-400 border-r border-slate-800 hover:bg-slate-800 hover:text-white focus:z-20 transition-colors"
            >
              &laquo;
            </button>

            {/* Deretan Nomor Halaman */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = currentPage === pageNumber;

              return (
                <button
                  key={pageNumber}
                  disabled={loading}
                  onClick={() => onPageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border-r border-slate-800 focus:z-20 transition-colors ${
                    isActive
                      ? "z-10 bg-indigo-600 text-white font-semibold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Tombol Panah Kanan */}
            <button
              disabled={currentPage === totalPages || loading}
              onClick={() => onPageChange(currentPage + 1)}
              className="disabled:opacity-40 disabled:cursor-not-allowed relative inline-flex items-center px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:z-20 transition-colors"
            >
              &raquo;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;

// import React from "react";

// function Pagination({
//   currentPage,
//   totalPages,
//   totalItems,
//   onPageChange,
//   loading,
// }) {
//   // Jangan render komponen jika total halaman hanya 1 atau kurang
//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-1 rounded-lg shadow-sm mt-2">
//       {/* Tampilan Mobile (Hanya tombol Sebelumnya & Selanjutnya) */}
//       <div className="flex flex-1 justify-between sm:hidden">
//         <button
//           disabled={currentPage === 1 || loading}
//           onClick={() => onPageChange(currentPage - 1)}
//           className="disabled:opacity-50 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           Sebelumnya
//         </button>
//         <button
//           disabled={currentPage === totalPages || loading}
//           onClick={() => onPageChange(currentPage + 1)}
//           className="disabled:opacity-50 relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           Selanjutnya
//         </button>
//       </div>

//       {/* Tampilan Desktop */}
//       <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm text-gray-700">
//             Menampilkan total <span className="font-medium">{totalItems}</span>{" "}
//             data (Halaman <span className="font-medium">{currentPage}</span>{" "}
//             dari <span className="font-medium">{totalPages}</span>)
//           </p>
//         </div>
//         <div>
//           <nav
//             className="isolate inline-flex -space-x-px rounded-md shadow-sm"
//             aria-label="Pagination"
//           >
//             {/* Tombol Panah Kiri */}
//             <button
//               disabled={currentPage === 1 || loading}
//               onClick={() => onPageChange(currentPage - 1)}
//               className="disabled:opacity-50 relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 transition-colors"
//             >
//               &laquo;
//             </button>

//             {/* Deretan Nomor Halaman */}
//             {Array.from({ length: totalPages }, (_, index) => {
//               const pageNumber = index + 1;
//               return (
//                 <button
//                   key={pageNumber}
//                   disabled={loading}
//                   onClick={() => onPageChange(pageNumber)}
//                   className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 transition-colors ${
//                     currentPage === pageNumber
//                       ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                       : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
//                   }`}
//                 >
//                   {pageNumber}
//                 </button>
//               );
//             })}

//             {/* Tombol Panah Kanan */}
//             <button
//               disabled={currentPage === totalPages || loading}
//               onClick={() => onPageChange(currentPage + 1)}
//               className="disabled:opacity-50 relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 transition-colors"
//             >
//               &raquo;
//             </button>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Pagination;
