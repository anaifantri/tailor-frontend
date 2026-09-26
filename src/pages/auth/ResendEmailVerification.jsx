import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

function resendEmailVerification() {
  const { user, resendEmailVerification } = useAuth();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");
    try {
      const response = await resendEmailVerification(user);
      setMessage(response.data.message);
      setProcessing(false);
    } catch (err) {
      if (!err?.response) {
        setError("No Server Response..!!");
      } else if (err.response?.status === 400) {
        setMessage(err.response.data.message);
      } else {
        console.log(err);
        setMessage(err.response.data.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full bg-slate-950 p-4">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="bg-slate-900/80 border border-slate-200 w-full max-w-md rounded-3xl shadow-md shadow-gray-200 p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-center mb-4">
              <img
                className="w-28 h-auto object-contain"
                src={LogoRiori}
                alt="Logo Riori"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-slate-300 leading-relaxed max-w-xs">
                Klik tombol di bawah ini untuk pengiriman ulang link verifikasi
                email
              </p>
            </div>

            {message && (
              <div
                className={
                  message
                    ? "w-full p-3 mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl"
                    : "hidden"
                }
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="mt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className={
                    processing
                      ? "w-full flex justify-center items-center py-2.5 px-4 bg-slate-800 text-slate-500 font-semibold text-sm rounded-xl cursor-not-allowed transition-all"
                      : "w-full flex justify-center items-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                  }
                >
                  {processing && (
                    <Svg
                      title="Spin"
                      c={"w-4 h-4 fill-current mr-2 animate-spin"}
                    >
                      <SpinSvg />
                    </Svg>
                  )}
                  <span>Kirim Ulang Verifikasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default resendEmailVerification;

// import { useEffect, useRef, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { Link } from "react-router-dom";
// import Svg from "@/components/Svg";
// import SpinSvg from "@/assets/Svg/SpinSvg";
// import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

// function resendEmailVerification() {
//   const { user, resendEmailVerification } = useAuth();
//   const [message, setMessage] = useState(null);
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
//       <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
//         <div className="flex-all-center bg-stone-900 w-150 h-100 border-slate-100 rounded-4xl drop-shadow-xl">
//           <div className="flex-all-center">
//             <div>
//               <div className="flex-all-center w-full0">
//                 <img className="w-32" src={LogoRiori} alt="" />
//               </div>
//               <div className="flex-all-center p-2">
//                 <label className="flex justify-center text-center tracking-widest font-bold text-sm text-amber-500 w-96">
//                   Klik tombol di bawah ini untuk pengiriman ulang link
//                   verifikasi email
//                 </label>
//               </div>
//               {message && (
//                 <>
//                   <span
//                     className={
//                       message
//                         ? "flex-all-center m-auto w-full text-red-700 text-sm items-center"
//                         : "hidden"
//                     }
//                   >
//                     {message}
//                   </span>
//                 </>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="flex-all-center mt-6">
//                   <button
//                     type="submit"
//                     className={
//                       processing
//                         ? "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
//                         : "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
//                     }
//                   >
//                     {processing && (
//                       <Svg
//                         title="Spin"
//                         c={"w-5 fill-current mx-2 animate-spin"}
//                       >
//                         <SpinSvg />
//                       </Svg>
//                     )}
//                     <span>Resend Verification</span>
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default resendEmailVerification;
