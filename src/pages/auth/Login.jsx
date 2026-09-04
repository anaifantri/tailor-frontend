import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

function Login() {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    setError("");
    setGetErrors("");
    setErrorMessage("");
    setProcessing(true);
    try {
      await login({ username: username, password: password });
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
          <div className="flex-all-center rounded-4xl bg-stone-900">
            <div>
              <div className="flex-all-center w-full text-white">
                <img className="w-48" src={LogoRiori} alt="" />
              </div>
            </div>
          </div>
          <div className="flex-all-center">
            <div>
              {/* <div className="drop-shadow-lg m-auto w-24 h-24 flex bg-white rounded-full border border-slate-400 p-1">
                <div className="flex-all-center drop-shadow-md m-auto rounded-full border border-slate-300"></div>
              </div> */}

              <div className="flex-all-center p-2">
                <h2 className="tracking-widest font-bold text-xl text-stone-800">
                  Sign In
                </h2>
              </div>
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
                      className="mt-2 flex-all-center w-full text-stone-800 text-sm"
                    >
                      Forgot password?
                    </Link>
                    <button
                      type="submit"
                      className={
                        processing
                          ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                          : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-login cursor-pointer"
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
