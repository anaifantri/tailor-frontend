import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const emailRef = useRef();
  const [processing, setProcessing] = useState(false);
  //   const errorRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message);
      console.log(response.data);
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      console.error("Error sending email", error);
      console.log(error.data);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full bg-slate-950 p-4">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="bg-slate-900/80 border border-slate-200 w-full max-w-md rounded-3xl shadow-md shadow-gray-200 p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-center mb-4">
              <img
                className="w-28 h-auto object-contain"
                src={LogoRiori}
                alt="Logo Riori"
              />
            </div>
            <div className="text-center mb-6">
              <h2 className="tracking-wider font-bold text-xl text-slate-100">
                Lupa Password
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan email Anda untuk menerima tautan pemulihan
              </p>
            </div>

            {message && (
              <div
                className={
                  message
                    ? "w-full p-3 mb-4 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
                    : "hidden"
                }
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Input email address"
                    autoComplete="off"
                    required
                    ref={emailRef}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className={
                    processing
                      ? "w-full flex justify-center items-center py-2.5 px-4 bg-slate-800 text-slate-500 font-semibold text-sm rounded-xl cursor-not-allowed transition-all mt-6"
                      : "w-full flex justify-center items-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer mt-6"
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
                  <span>Reset Password</span>
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/"
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Kembali ke Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;

// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import Svg from "@/components/Svg";
// import SpinSvg from "@/assets/Svg/SpinSvg";
// import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

// function ForgotPassword() {
//   const { forgotPassword } = useAuth();
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const emailRef = useRef();
//   const [processing, setProcessing] = useState(false);
//   //   const errorRef = useRef();

//   useEffect(() => {
//     emailRef.current.focus();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     try {
//       const response = await forgotPassword(email);
//       setMessage(response.data.message);
//       console.log(response.data);
//       setProcessing(false);
//     } catch (error) {
//       setProcessing(false);
//       console.error("Error sending email", error);
//       console.log(error.data);
//     }
//   };

//   return (
//     <>
//       <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
//         <div className="flex-all-center bg-stone-900 w-150 border-stone-100 rounded-4xl drop-shadow-xl p-6">
//           <div className="flex-all-center">
//             <div>
//               <div className="flex-all-center w-full">
//                 <img className="w-32" src={LogoRiori} alt="" />
//               </div>
//               <div className="flex-all-center">
//                 <h2 className="tracking-widest font-bold text-xl text-amber-500">
//                   Forgot Password
//                 </h2>
//               </div>
//               {message && (
//                 <span
//                   className={
//                     message
//                       ? "flex-all-center m-auto w-full text-teal-400 text-sm items-center mt-4"
//                       : "hidden"
//                   }
//                 >
//                   {message}
//                 </span>
//               )}
//               <form onSubmit={handleSubmit}>
//                 <div className="flex-all-center mt-4">
//                   <div>
//                     <label className="text-amber-500">Email Address</label>
//                     <input
//                       type="email"
//                       className="flex items-center mt-2 py-1 px-2 w-80"
//                       placeholder="Input email address"
//                       autoComplete="off"
//                       required
//                       ref={emailRef}
//                       onChange={(e) => setEmail(e.target.value)}
//                       value={email}
//                     />
//                     <button
//                       type="submit"
//                       disabled={processing}
//                       className={
//                         processing
//                           ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled"
//                           : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
//                       }
//                     >
//                       {processing && (
//                         <Svg
//                           title="Spin"
//                           c={"w-5 fill-current mx-2 animate-spin"}
//                         >
//                           <SpinSvg />
//                         </Svg>
//                       )}
//                       <span>Reset Password</span>
//                     </button>
//                     <Link
//                       to="/"
//                       className="text-amber-500 mt-4 flex justify-center hover:text-amber-300"
//                     >
//                       Back to login
//                     </Link>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ForgotPassword;
