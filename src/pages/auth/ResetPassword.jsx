import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(searchParams.get("email"));
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [errorPassword, setErrorPassword] = useState(null);
  const [processing, setProcessing] = useState(false);
  const passwordRef = useRef();
  const errorRef = useRef();

  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const handlePasswordConfirmationChange = (e) => {
    const { name, value } = e.target;
    setPasswordConfirmation(value);
    if (password !== value) {
      setErrorPassword("Passwords do not match");
    } else {
      setErrorPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    setMessage("");
    try {
      const response = await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(response.data.message);
      setPasswordConfirmation("");
      setPassword("");
      setTimeout(() => {
        navigate("/");
      }, 3000);
      setProcessing(false);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setMessage("Something went wrong. Please try again.");
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
                Reset Password
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Atur ulang password akun Anda
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
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Input New Password"
                    autoComplete="off"
                    required
                    ref={passwordRef}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  {errors.password && (
                    <span
                      ref={errorRef}
                      className={
                        errors.password
                          ? "text-red-400 text-xs mt-1 block"
                          : "hidden"
                      }
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password Confirmation
                  </label>
                  <input
                    type="password"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Password Confirmation"
                    autoComplete="off"
                    required
                    onChange={handlePasswordConfirmationChange}
                    value={passwordConfirmation}
                  />
                  {errorPassword && (
                    <p className="text-red-400 text-xs mt-1">{errorPassword}</p>
                  )}
                  {errors.password_confirmation && (
                    <span
                      ref={errorRef}
                      className={
                        errors.password_confirmation
                          ? "text-red-400 text-xs mt-1 block"
                          : "hidden"
                      }
                    >
                      {errors.password_confirmation}
                    </span>
                  )}
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

export default ResetPassword;

// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import Svg from "@/components/Svg";
// import SpinSvg from "@/assets/Svg/SpinSvg";
// import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

// function ResetPassword() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const { resetPassword } = useAuth();
//   const [email, setEmail] = useState(searchParams.get("email"));
//   const [password, setPassword] = useState("");
//   const [passwordConfirmation, setPasswordConfirmation] = useState("");
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const [errorPassword, setErrorPassword] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const passwordRef = useRef();
//   const errorRef = useRef();

//   useEffect(() => {
//     passwordRef.current.focus();
//   }, []);

//   const handlePasswordConfirmationChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordConfirmation(value);
//     if (password !== value) {
//       setErrorPassword("Passwords do not match");
//     } else {
//       setErrorPassword("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     setErrors({});
//     setMessage("");
//     try {
//       const response = await resetPassword({
//         token,
//         email,
//         password,
//         password_confirmation: passwordConfirmation,
//       });
//       setMessage(response.data.message);
//       setPasswordConfirmation("");
//       setPassword("");
//       setTimeout(() => {
//         navigate("/");
//       }, 3000);
//       setProcessing(false);
//     } catch (error) {
//       if (error.response && error.response.status === 422) {
//         setErrors(error.response.data.errors);
//       } else {
//         setMessage("Something went wrong. Please try again.");
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
//         <div className="flex-all-center bg-stone-900 w-150 h-120 border-slate-100 rounded-4xl drop-shadow-xl">
//           <div className="flex-all-center">
//             <div>
//               <div className="flex-all-center w-full">
//                 <img className="w-32" src={LogoRiori} alt="" />
//               </div>
//               <div className="flex-all-center p-2">
//                 <h2 className="tracking-widest font-bold text-xl text-amber-500">
//                   Reset Password
//                 </h2>
//               </div>
//               {message && (
//                 <span
//                   className={
//                     message
//                       ? "flex-all-center m-auto w-full text-teal-400 text-sm items-center"
//                       : "hidden"
//                   }
//                 >
//                   {message}
//                 </span>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="flex-all-center mt-6">
//                   <div>
//                     <label className="text-amber-500">New Password</label>
//                     <input
//                       type="password"
//                       className="flex items-center mt-2 py-1 px-2 w-80"
//                       placeholder="Input New Password"
//                       autoComplete="off"
//                       required
//                       ref={passwordRef}
//                       onChange={(e) => setPassword(e.target.value)}
//                       value={password}
//                     />
//                     {errors.password && (
//                       <span
//                         ref={errorRef}
//                         className={
//                           errors.password
//                             ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
//                             : "hidden"
//                         }
//                       >
//                         {errors.password}
//                       </span>
//                     )}
//                     <label className="text-amber-500 mt-4 flex">
//                       Password Confirmation
//                     </label>
//                     <input
//                       type="password"
//                       className="flex items-center mt-2 py-1 px-2 w-80"
//                       placeholder="Password Confirmation"
//                       autoComplete="off"
//                       required
//                       onChange={handlePasswordConfirmationChange}
//                       value={passwordConfirmation}
//                     />
//                     {errorPassword && (
//                       <p style={{ color: "red" }}>{errorPassword}</p>
//                     )}
//                     {errors.password_confirmation && (
//                       <span
//                         ref={errorRef}
//                         className={
//                           errors.password_confirmation
//                             ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
//                             : "hidden"
//                         }
//                       >
//                         {errors.password_confirmation}
//                       </span>
//                     )}
//                     <button
//                       type="submit"
//                       className={
//                         processing
//                           ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
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

// export default ResetPassword;
