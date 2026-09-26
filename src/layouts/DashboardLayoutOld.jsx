import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import HeaderLayout from "@/layouts/HeaderLayout";

import Svg from "@/components/Svg";
import EmailSvg from "@/assets/Svg/EmailSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function DashboardLayout() {
  const { user, resendEmailVerification } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");
    setError("");

    try {
      // Panggil resendEmailVerification tanpa perlu menyertakan parameter user
      const response = await resendEmailVerification();
      setMessage(
        response.data?.message || "Link verifikasi baru berhasil dikirim!",
      );
    } catch (err) {
      if (!err?.response) {
        setError("Gagal terhubung ke server. Periksa koneksi Anda.");
      } else {
        setError(
          err.response?.data?.message ||
            "Gagal mengirim ulang link verifikasi.",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <HeaderLayout />
      <main>
        <div className="flex w-full min-h-screen justify-center px-10 py-4 text-sm bg-stone-50 z-0">
          {user && !user.email_verified_at ? (
            <div className="text-stone-800 text-xs w-full max-w-md my-auto p-6 bg-white rounded-2xl shadow-sm border border-stone-200">
              <div className="flex-all-center text-red-700 font-bold text-sm mb-2">
                <span>Akun Anda belum aktif!</span>
              </div>

              <div className="flex-all-center">
                <span className="text-center text-stone-600 leading-relaxed">
                  Silakan periksa kotak masuk email Anda dan klik link
                  verifikasi yang telah kami kirimkan. Jika belum menerima
                  email, tekan tombol di bawah untuk mengirim ulang.
                </span>
              </div>

              {/* Tampilan Pesan Sukses */}
              {message && (
                <div className="flex-all-center mt-4">
                  <span className="text-green-600 font-medium text-center text-xs">
                    {message}
                  </span>
                </div>
              )}

              {/* Tampilan Pesan Error */}
              {error && (
                <div className="flex-all-center mt-4">
                  <span className="text-red-500 font-medium text-center text-xs">
                    {error}
                  </span>
                </div>
              )}

              <div className="flex-all-center mt-6">
                <form onSubmit={handleSubmit} className="w-full">
                  <button
                    type="submit"
                    disabled={processing}
                    className={`flex justify-center items-center m-auto font-semibold tracking-wider rounded-2xl px-4 py-2 text-xs transition-all duration-300 cursor-pointer ${
                      processing
                        ? "button-disabled cursor-not-allowed opacity-60"
                        : "button-primary hover:shadow-md"
                    }`}
                  >
                    {processing ? (
                      <Svg
                        title="Spin"
                        c={"w-4 h-4 fill-current mx-2 animate-spin"}
                      >
                        <SpinSvg />
                      </Svg>
                    ) : (
                      <Svg title="Resend" c={"w-3.5 h-3.5 fill-current mr-2"}>
                        <EmailSvg />
                      </Svg>
                    )}
                    <span>
                      {processing
                        ? "Mengirim..."
                        : "Kirim Ulang Email Verifikasi"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </>
  );
}

// import HeaderLayout from "@/layouts/HeaderLayout";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";
// import { Link, Outlet } from "react-router-dom";

// import Svg from "@/Components/Svg";
// import EmailSvg from "@/Assets/Svg/EmailSvg";
// import SpinSvg from "@/assets/Svg/SpinSvg";

// export default function DashboardLayout() {
//   const { user, logout, resendEmailVerification } = useAuth();
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setMessage("");
//     try {
//       const response = await resendEmailVerification(user);
//       setMessage(response.data.message);
//       setProcessing(false);
//     } catch (err) {
//       if (!err?.response) {
//         setError("No Server Response..!!");
//       } else if (err.response?.status === 400) {
//         setMessage(err.response.data.message);
//       } else {
//         console.log(err);
//         setMessage(err.response.data.message);
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <>
//       <HeaderLayout />
//       <main>
//         <div className="flex w-full min-h-screen justify-center px-10 py-4 text-sm bg-stone-50 z-0">
//           {user && !user.email_verified_at ? (
//             <div className="text-red-700 text-xs">
//               <div className="flex-all-center">
//                 <span className="flex font-semibold">
//                   Akun anda belum aktif..!!
//                 </span>
//               </div>
//               <div className="flex-all-center w-full text-stone-800">
//                 {message && (
//                   <>
//                     <span
//                       className={
//                         message
//                           ? "flex-all-center m-auto w-full text-green-500 mt-4 text-sm items-center"
//                           : "hidden"
//                       }
//                     >
//                       {message}
//                     </span>
//                   </>
//                 )}
//               </div>
//               <div className="flex-all-center">
//                 <span className="flex ml-2 w-150 text-center mt-2">
//                   Silakan periksa inbox email Anda dan klik link verifikasi yang
//                   telah dikirim untuk memverifikasi akun. Atau klik tombol
//                   dibawah ini untuk mengirim ulang link verifikasi.
//                 </span>
//               </div>
//               <div className="flex-all-center mt-4">
//                 <form onSubmit={handleSubmit}>
//                   <div className="flex-all-center">
//                     <button
//                       type="submit"
//                       className={
//                         processing
//                           ? "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
//                           : "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
//                       }
//                     >
//                       {processing ? (
//                         <Svg
//                           title="Spin"
//                           c={"w-5 fill-current mx-2 animate-spin"}
//                         >
//                           <SpinSvg />
//                         </Svg>
//                       ) : (
//                         <Svg title="Resend" c={"w-3 fill-current mx-1"}>
//                           <EmailSvg />
//                         </Svg>
//                       )}
//                       <span>Resend Email Verification</span>
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           ) : (
//             <Outlet />
//           )}
//         </div>
//       </main>
//     </>
//   );
// }
