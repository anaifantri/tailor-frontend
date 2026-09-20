import { useEffect, useRef, useState } from "react";
import { osName, browserName } from "react-device-detect";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";
import SuccessMessage from "@/components/SuccessMessage";

function Login() {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const navigate = useNavigate();
  const usernameRef = useRef();
  const errorRef = useRef();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
    usernameRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deviceName = `${osName} - ${browserName}`;
    setGetErrors("");
    setErrorMessage("");
    setProcessing(true);
    try {
      await login({
        username: username,
        password: password,
        device_name: deviceName,
      });
      setUsername("");
      setPassword("");
      setProcessing(false);
      navigate("/dashboard");
    } catch (err) {
      setProcessing(false);
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else if (err.response?.status === 403) {
        setErrorMessage(err.response.data.message);
      } else {
        setGetErrors(err.response.data.errors);
        setErrorMessage("Login Failed..!!");
      }
    }
  };

  return (
    <>
      <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
        <div className="grid grid-cols-2 w-150 h-100 bg-white border border-stone-100 rounded-4xl drop-shadow-xl">
          <div className="flex-all-center relative overflow-hidden rounded-4xl bg-radial from-stone-800 from-50% to-stone-900">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* 2. Wrapper Dalam: Memaksa gambar dan mask memiliki dimensi grid yang sama persis */}
              <div className="relative w-full h-full grid place-items-center">
                {/* Logo Utama */}
                <img
                  src={LogoRiori}
                  alt="Logo"
                  className="col-start-1 row-start-1 w-full h-full object-contain opacity-90 select-none"
                />

                {/* Lapisan Kilau (Ukuran disamakan persis lewat CSS Grid) */}
                <div
                  className="col-start-1 row-start-1 w-full h-full overflow-hidden pointer-events-none"
                  style={{
                    WebkitMaskImage: `url(${LogoRiori})`,
                    maskImage: `url(${LogoRiori})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                >
                  {/* Garis cahaya yang melintas */}
                  <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-all-center">
            <div>
              <div className="flex-all-center p-2">
                <h2 className="tracking-widest font-bold text-xl text-stone-800">
                  Sign In
                </h2>
              </div>
              {message && <SuccessMessage message={message} duration="3000" />}
              {errorMessage && (
                <span
                  className={
                    errorMessage
                      ? "flex-all-center m-auto w-full text-red-500 text-xs items-center text-center"
                      : "hidden"
                  }
                >
                  {errorMessage}
                </span>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex-all-center">
                  <div>
                    <input
                      type="text"
                      className="flex items-center mt-4 py-1 px-2 w-48"
                      placeholder="username"
                      autoComplete="off"
                      required
                      ref={usernameRef}
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                    />
                    {getErrors.username && (
                      <span
                        ref={errorRef}
                        className={
                          errorMessage
                            ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                            : "hidden"
                        }
                      >
                        {getErrors.username}
                      </span>
                    )}
                    <input
                      type="password"
                      className="flex items-center mt-4 py-1 px-2 w-48"
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    {getErrors.password && (
                      <span
                        ref={errorRef}
                        className={
                          errorMessage
                            ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                            : "hidden"
                        }
                      >
                        {getErrors.password}
                      </span>
                    )}
                    <Link
                      to="/forgot-password"
                      className="mt-2 flex-all-center w-full text-teal-500 hover:text-teal-800 text-sm"
                    >
                      Lupa password?
                    </Link>
                    <button
                      type="submit"
                      className={
                        processing
                          ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer bg-linear-to-b from-stone-900 to-stone-800"
                          : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-login cursor-pointer bg-linear-to-b from-stone-900 to-stone-700 transition-all duration-300 border border-white/20 hover:border-white/40 shadow-sm hover:shadow-stone-900"
                      }
                    >
                      {processing && (
                        <Svg
                          title="Spin"
                          c={"w-5 fill-current mx-2 animate-spin"}
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
    </>
  );
}

export default Login;
