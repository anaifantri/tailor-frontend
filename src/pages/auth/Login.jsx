import { useEffect, useRef, useState } from "react";
import { osName, browserName } from "react-device-detect";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";
import SuccessMessage from "@/components/SuccessMessage";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const usernameRef = useRef(null);

  // Jika user sudah terautentikasi, alihkan langsung ke dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      usernameRef.current?.focus();
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deviceName = `${osName} - ${browserName}`;

    setGetErrors({});
    setErrorMessage("");
    setProcessing(true);

    try {
      await login({
        username,
        password,
        device_name: deviceName,
      });

      setUsername("");
      setPassword("");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("Gagal terhubung ke server. Periksa koneksi Anda.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Username atau password salah.");
      } else if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
        setErrorMessage("Periksa kembali inputan Anda.");
      } else {
        setErrorMessage(
          err.response?.data?.message ||
            "Login gagal, terjadi kesalahan server.",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    /* Latar Belakang Utama dengan Gradasi Indigo Ambient Glow */
    <div className="flex-all-center relative w-full h-screen top-0 bg-brand-bg text-white font-sans antialiased selection:bg-brand-accent selection:text-brand-bg">
      {/* Efek Gradasi Ambient Glow Indigo di Latar Belakang Layar */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Container Utama dengan Gradasi Tipis Slate-900 ke Slate-950 */}
      <div className="relative z-10 grid grid-cols-2 w-150 h-100 bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-200 rounded-4xl drop-shadow-lg drop-shadow-gray-200 overflow-hidden backdrop-blur-xl">
        {/* Sisi Kiri: Logo dengan Gradasi Dark & Subtle Indigo Highlight */}
        <div className="flex-all-center relative overflow-hidden rounded-4xl bg-linear-to-b from-indigo-950/40 via-slate-900 to-slate-950 border-r border-slate-200/80">
          {/* Subtle Light Flare Indigo di Belakang Logo */}
          <div className="absolute w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative w-56 h-56 flex items-center justify-center z-10">
            <div className="relative w-full h-full grid place-items-center">
              <img
                src={LogoRiori}
                alt="Logo Riori Tailor"
                className="col-start-1 row-start-1 w-full h-full object-contain opacity-90 select-none drop-shadow-[0_10px_20px_rgba(99,102,241,0.15)]"
              />
              <div
                className="col-start-1 row-start-1 w-full h-full overflow-hidden pointer-events-none"
                style={{
                  WebkitMaskImage: `url(${LogoRiori})`,
                  maskImage: `url(${LogoRiori})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              >
                <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className="flex-all-center relative z-10">
          <div className="w-full px-6">
            <div className="flex-all-center p-2">
              <h2 className="tracking-widest font-bold text-xl bg-linear-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                Sign In
              </h2>
            </div>

            {message && <SuccessMessage message={message} duration="3000" />}

            {errorMessage && (
              <p className="text-rose-400 text-xs text-center my-2 font-medium">
                {errorMessage}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="flex-all-center">
                <div className="w-48">
                  {/* Field Username */}
                  <input
                    type="text"
                    className="flex items-center mt-4 py-1.5 px-3 w-full bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Username"
                    autoComplete="off"
                    required
                    ref={usernameRef}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
                  {getErrors.username && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {Array.isArray(getErrors.username)
                        ? getErrors.username[0]
                        : getErrors.username}
                    </span>
                  )}

                  {/* Field Password */}
                  <input
                    type="password"
                    className="flex items-center mt-4 py-1.5 px-3 w-full bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  {getErrors.password && (
                    <span className="text-rose-400 text-xs block mt-1">
                      {Array.isArray(getErrors.password)
                        ? getErrors.password[0]
                        : getErrors.password}
                    </span>
                  )}

                  {/* Link Lupa Password */}
                  <Link
                    to="/forgot-password"
                    className="mt-2.5 flex-all-center w-full text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
                  >
                    Lupa password?
                  </Link>

                  {/* Tombol Submit dengan Gradasi Indigo */}
                  <button
                    type="submit"
                    disabled={processing}
                    className={`flex justify-center items-center w-full font-semibold tracking-widest mt-6 rounded-xl p-2.5 text-xs text-white cursor-pointer transition-all duration-200 ${
                      processing
                        ? "bg-indigo-600/50 cursor-not-allowed"
                        : "bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
                    }`}
                  >
                    {processing && (
                      <Svg
                        title="Spin"
                        c={"w-4 fill-current mr-2 animate-spin"}
                      >
                        <SpinSvg />
                      </Svg>
                    )}
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useRef, useState } from "react";
// import { osName, browserName } from "react-device-detect";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

// import Svg from "@/components/Svg";
// import SpinSvg from "@/assets/Svg/SpinSvg";
// import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";
// import SuccessMessage from "@/components/SuccessMessage";

// export default function Login() {
//   const { user, login } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const message = location.state?.message;

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [getErrors, setGetErrors] = useState({});

//   const usernameRef = useRef(null);

//   // Jika user sudah terautentikasi, alihkan langsung ke dashboard
//   useEffect(() => {
//     if (user) {
//       navigate("/dashboard", { replace: true });
//     } else {
//       usernameRef.current?.focus();
//     }
//   }, [user, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const deviceName = `${osName} - ${browserName}`;

//     setGetErrors({});
//     setErrorMessage("");
//     setProcessing(true);

//     try {
//       await login({
//         username,
//         password,
//         device_name: deviceName,
//       });

//       setUsername("");
//       setPassword("");
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       if (!err?.response) {
//         setErrorMessage("Gagal terhubung ke server. Periksa koneksi Anda.");
//       } else if (err.response?.status === 401) {
//         setErrorMessage("Username atau password salah.");
//       } else if (err.response?.status === 422) {
//         setGetErrors(err.response.data.errors || {});
//         setErrorMessage("Periksa kembali inputan Anda.");
//       } else {
//         setErrorMessage(
//           err.response?.data?.message ||
//             "Login gagal, terjadi kesalahan server.",
//         );
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
//       <div className="grid grid-cols-2 w-150 h-100 bg-white border border-stone-100 rounded-4xl drop-shadow-xl">
//         {/* Sisi Kiri: Logo & Efek Shimmer */}
//         <div className="flex-all-center relative overflow-hidden rounded-4xl bg-radial from-stone-800 from-50% to-stone-900">
//           <div className="relative w-56 h-56 flex items-center justify-center">
//             <div className="relative w-full h-full grid place-items-center">
//               <img
//                 src={LogoRiori}
//                 alt="Logo Riori Tailor"
//                 className="col-start-1 row-start-1 w-full h-full object-contain opacity-90 select-none"
//               />
//               <div
//                 className="col-start-1 row-start-1 w-full h-full overflow-hidden pointer-events-none"
//                 style={{
//                   WebkitMaskImage: `url(${LogoRiori})`,
//                   maskImage: `url(${LogoRiori})`,
//                   WebkitMaskSize: "contain",
//                   maskSize: "contain",
//                   WebkitMaskRepeat: "no-repeat",
//                   WebkitMaskPosition: "center",
//                   maskPosition: "center",
//                 }}
//               >
//                 <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sisi Kanan: Form Login */}
//         <div className="flex-all-center">
//           <div className="w-full px-6">
//             <div className="flex-all-center p-2">
//               <h2 className="tracking-widest font-bold text-xl text-stone-800">
//                 Sign In
//               </h2>
//             </div>

//             {message && <SuccessMessage message={message} duration="3000" />}

//             {errorMessage && (
//               <p className="text-red-500 text-xs text-center my-2 font-medium">
//                 {errorMessage}
//               </p>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="flex-all-center">
//                 <div className="w-48">
//                   {/* Field Username */}
//                   <input
//                     type="text"
//                     className="flex items-center mt-4 py-1 px-2 w-full border border-stone-300 rounded focus:outline-none focus:border-stone-600 text-sm"
//                     placeholder="Username"
//                     autoComplete="off"
//                     required
//                     ref={usernameRef}
//                     onChange={(e) => setUsername(e.target.value)}
//                     value={username}
//                   />
//                   {getErrors.username && (
//                     <span className="text-red-500 text-xs block mt-1">
//                       {Array.isArray(getErrors.username)
//                         ? getErrors.username[0]
//                         : getErrors.username}
//                     </span>
//                   )}

//                   {/* Field Password */}
//                   <input
//                     type="password"
//                     className="flex items-center mt-4 py-1 px-2 w-full border border-stone-300 rounded focus:outline-none focus:border-stone-600 text-sm"
//                     placeholder="Password"
//                     onChange={(e) => setPassword(e.target.value)}
//                     value={password}
//                     required
//                   />
//                   {getErrors.password && (
//                     <span className="text-red-500 text-xs block mt-1">
//                       {Array.isArray(getErrors.password)
//                         ? getErrors.password[0]
//                         : getErrors.password}
//                     </span>
//                   )}

//                   {/* Link Lupa Password */}
//                   <Link
//                     to="/forgot-password"
//                     className="mt-2 flex-all-center w-full text-teal-500 hover:text-teal-800 text-sm"
//                   >
//                     Lupa password?
//                   </Link>

//                   {/* Tombol Submit */}
//                   <button
//                     type="submit"
//                     disabled={processing}
//                     className={`flex justify-center items-center w-full font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 cursor-pointer transition-all duration-300 border border-white/20 ${
//                       processing
//                         ? "button-disabled cursor-not-allowed opacity-60 bg-linear-to-b from-stone-900 to-stone-800"
//                         : "button-login bg-linear-to-b from-stone-900 to-stone-700 hover:border-white/40 shadow-sm hover:shadow-stone-900"
//                     }`}
//                   >
//                     {processing && (
//                       <Svg
//                         title="Spin"
//                         c={"w-5 fill-current mx-2 animate-spin"}
//                       >
//                         <SpinSvg />
//                       </Svg>
//                     )}
//                     <span>Login</span>
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import { osName, browserName } from "react-device-detect";
// import { useAuth } from "@/context/AuthContext";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import Svg from "@/components/Svg";
// import SpinSvg from "@/assets/Svg/SpinSvg";
// import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";
// import SuccessMessage from "@/components/SuccessMessage";

// function Login() {
//   const { user, login, logout } = useAuth();
//   const location = useLocation();
//   const message = location.state?.message;
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [getErrors, setGetErrors] = useState({});
//   const navigate = useNavigate();
//   const usernameRef = useRef();
//   const errorRef = useRef();

//   useEffect(() => {
//     if (user) {
//       navigate("/dashboard");
//     }
//     usernameRef.current.focus();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const deviceName = `${osName} - ${browserName}`;
//     setGetErrors("");
//     setErrorMessage("");
//     setProcessing(true);
//     try {
//       await login({
//         username: username,
//         password: password,
//         device_name: deviceName,
//       });
//       setUsername("");
//       setPassword("");
//       setProcessing(false);
//       navigate("/dashboard");
//     } catch (err) {
//       setProcessing(false);
//       if (!err?.response) {
//         setErrorMessage("No Server Response..!!");
//       } else if (err.response?.status === 401) {
//         setErrorMessage("Unauthorized..!!");
//       } else if (err.response?.status === 403) {
//         setErrorMessage(err.response.data.message);
//       } else {
//         setGetErrors(err.response.data.errors);
//         setErrorMessage("Login Failed..!!");
//       }
//     }
//   };

//   return (
//     <>
//       <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
//         <div className="grid grid-cols-2 w-150 h-100 bg-white border border-stone-100 rounded-4xl drop-shadow-xl">
//           <div className="flex-all-center relative overflow-hidden rounded-4xl bg-radial from-stone-800 from-50% to-stone-900">
//             <div className="relative w-56 h-56 flex items-center justify-center">
//               {/* 2. Wrapper Dalam: Memaksa gambar dan mask memiliki dimensi grid yang sama persis */}
//               <div className="relative w-full h-full grid place-items-center">
//                 {/* Logo Utama */}
//                 <img
//                   src={LogoRiori}
//                   alt="Logo"
//                   className="col-start-1 row-start-1 w-full h-full object-contain opacity-90 select-none"
//                 />

//                 {/* Lapisan Kilau (Ukuran disamakan persis lewat CSS Grid) */}
//                 <div
//                   className="col-start-1 row-start-1 w-full h-full overflow-hidden pointer-events-none"
//                   style={{
//                     WebkitMaskImage: `url(${LogoRiori})`,
//                     maskImage: `url(${LogoRiori})`,
//                     WebkitMaskSize: "contain",
//                     maskSize: "contain",
//                     WebkitMaskRepeat: "no-repeat",
//                     maskPosition: "center",
//                     WebkitMaskPosition: "center",
//                   }}
//                 >
//                   {/* Garis cahaya yang melintas */}
//                   <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent" />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex-all-center">
//             <div>
//               <div className="flex-all-center p-2">
//                 <h2 className="tracking-widest font-bold text-xl text-stone-800">
//                   Sign In
//                 </h2>
//               </div>
//               {message && <SuccessMessage message={message} duration="3000" />}
//               {errorMessage && (
//                 <span
//                   className={
//                     errorMessage
//                       ? "flex-all-center m-auto w-full text-red-500 text-xs items-center text-center"
//                       : "hidden"
//                   }
//                 >
//                   {errorMessage}
//                 </span>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="flex-all-center">
//                   <div>
//                     <input
//                       type="text"
//                       className="flex items-center mt-4 py-1 px-2 w-48"
//                       placeholder="username"
//                       autoComplete="off"
//                       required
//                       ref={usernameRef}
//                       onChange={(e) => setUsername(e.target.value)}
//                       value={username}
//                     />
//                     {getErrors.username && (
//                       <span
//                         ref={errorRef}
//                         className={
//                           errorMessage
//                             ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
//                             : "hidden"
//                         }
//                       >
//                         {getErrors.username}
//                       </span>
//                     )}
//                     <input
//                       type="password"
//                       className="flex items-center mt-4 py-1 px-2 w-48"
//                       placeholder="password"
//                       onChange={(e) => setPassword(e.target.value)}
//                       value={password}
//                       required
//                     />
//                     {getErrors.password && (
//                       <span
//                         ref={errorRef}
//                         className={
//                           errorMessage
//                             ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
//                             : "hidden"
//                         }
//                       >
//                         {getErrors.password}
//                       </span>
//                     )}
//                     <Link
//                       to="/forgot-password"
//                       className="mt-2 flex-all-center w-full text-teal-500 hover:text-teal-800 text-sm"
//                     >
//                       Lupa password?
//                     </Link>
//                     <button
//                       type="submit"
//                       className={
//                         processing
//                           ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer bg-linear-to-b from-stone-900 to-stone-800"
//                           : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-login cursor-pointer bg-linear-to-b from-stone-900 to-stone-700 transition-all duration-300 border border-white/20 hover:border-white/40 shadow-sm hover:shadow-stone-900"
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
//                       <span>Login</span>
//                     </button>
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

// export default Login;
