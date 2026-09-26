import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import CheckSvg from "@/assets/Svg/CheckSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

export default function VerifyEmail() {
  const { user, verifyEmail } = useAuth();
  console.log(user);
  const { ulid, hash } = useParams();
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const executeVerification = async () => {
      try {
        setLoading(true);
        const response = await verifyEmail(ulid, hash, searchParams);
        setMessage(response?.data?.message || "Email berhasil diverifikasi!");
      } catch (err) {
        if (!err?.response) {
          setError("Tidak ada respons dari server.");
        } else if (err.response?.status === 403) {
          setError(
            err.response.data?.message ||
              "Tautan verifikasi tidak valid atau sudah kedaluwarsa.",
          );
        } else {
          setError(err.response.data?.message || "Gagal memverifikasi email.");
        }
      } finally {
        setLoading(false);
      }
    };

    executeVerification();
  }, [ulid, hash, searchParams, verifyEmail]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-950 p-4">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="bg-slate-900/80 border border-slate-200 w-full max-w-md rounded-3xl shadow-md shadow-gray-200 p-8 backdrop-blur-sm text-slate-200">
        <div className="flex flex-col items-center text-center w-full">
          <img
            className="w-28 h-auto object-contain mb-4"
            src={LogoRiori}
            alt="Riori Tailor Logo"
          />

          <h2 className="tracking-wider font-bold text-xl text-slate-100 mb-6">
            Verifikasi Email
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center my-4 space-y-3">
              <Svg title="Loading" c={"w-8 h-8 fill-indigo-500 animate-spin"}>
                <SpinSvg />
              </Svg>
              <span className="text-slate-400 text-sm">
                Proses memverifikasi email...
              </span>
            </div>
          )}

          {/* Success State */}
          {!loading && message && (
            <div className="flex flex-col items-center my-2 w-full">
              <div className="flex items-center text-emerald-400 font-bold text-lg mb-2">
                <Svg title="Success" c={"w-6 h-6 fill-current mr-2"}>
                  <CheckSvg />
                </Svg>
                <span>BERHASIL!</span>
              </div>
              <p className="text-emerald-300 text-sm mb-6">{message}</p>

              {user ? (
                <Link
                  to="/dashboard"
                  reloadDocument
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-center"
                >
                  Ke Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-center"
                >
                  Kembali ke Login
                </Link>
              )}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center my-2 w-full">
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs w-full mb-6">
                {error}
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all text-center"
              >
                Kembali ke Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useEffect, useRef, useState } from "react";
// import { Link, useParams, useSearchParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

// import Svg from "@/components/Svg";
// import CheckSvg from "@/assets/Svg/CheckSvg";
// import SpinSvg from "@/assets/Svg/SpinSvg";
// import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

// export default function VerifyEmail() {
//   const { user, verifyEmail } = useAuth();
//   const { ulid, hash } = useParams();
//   const [searchParams] = useSearchParams();

//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Ref untuk memastikan API verifikasi hanya dipanggil 1 kali
//   const hasExecutedRef = useRef(false);

//   useEffect(() => {
//     // Mencegah panggilan ganda jika sudah pernah dieksekusi
//     if (hasExecutedRef.current) return;
//     hasExecutedRef.current = true;

//     const executeVerification = async () => {
//       try {
//         setLoading(true);
//         const response = await verifyEmail(ulid, hash, searchParams);
//         setMessage(response?.data?.message || "Email berhasil diverifikasi!");
//       } catch (err) {
//         if (!err?.response) {
//           setError("Tidak ada respons dari server.");
//         } else if (err.response?.status === 403) {
//           setError(
//             err.response.data?.message ||
//               "Tautan verifikasi tidak valid atau sudah kedaluwarsa.",
//           );
//         } else {
//           setError(err.response.data?.message || "Gagal memverifikasi email.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     executeVerification();
//   }, [ulid, hash, searchParams, verifyEmail]);

//   return (
//     <div className="flex-all-center min-h-screen bg-stone-50">
//       <div className="flex-all-center bg-stone-900 w-full max-w-lg p-8 border border-slate-800 rounded-4xl drop-shadow-xl text-white">
//         <div className="flex flex-col items-center text-center w-full">
//           <img className="w-32 mb-4" src={LogoRiori} alt="Riori Tailor Logo" />

//           <h2 className="tracking-widest font-bold text-xl text-amber-500 mb-6">
//             Verifikasi Email
//           </h2>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center my-4">
//               <Svg
//                 title="Loading"
//                 c={"w-8 h-8 fill-amber-500 animate-spin mb-2"}
//               >
//                 <SpinSvg />
//               </Svg>
//               <span className="text-gray-300 text-sm">
//                 Proses memverifikasi email...
//               </span>
//             </div>
//           )}

//           {/* Success State */}
//           {!loading && message && (
//             <div className="flex flex-col items-center my-2 w-full">
//               <div className="flex items-center text-teal-500 font-bold text-lg mb-2">
//                 <Svg title="Success" c={"w-6 h-6 fill-current mr-2"}>
//                   <CheckSvg />
//                 </Svg>
//                 <span>BERHASIL!</span>
//               </div>
//               <p className="text-teal-400 text-sm mb-6">{message}</p>

//               {user ? (
//                 <Link
//                   to="/dashboard"
//                   reloadDocument
//                   className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
//                 >
//                   Ke Dashboard
//                 </Link>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
//                 >
//                   Kembali ke Login
//                 </Link>
//               )}
//             </div>
//           )}

//           {/* Error State */}
//           {!loading && error && (
//             <div className="flex flex-col items-center my-2 w-full">
//               <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm w-full mb-6">
//                 {error}
//               </div>
//               <Link
//                 to="/login"
//                 className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
//               >
//                 Kembali ke Login
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
