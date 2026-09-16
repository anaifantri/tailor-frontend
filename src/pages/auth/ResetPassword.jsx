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
      console.log(response.data);
      setTimeout(() => {
        navigate("/");
      }, 3000);
      setProcessing(false);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Laravel validation errors
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
      <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
        <div className="flex-all-center bg-stone-900 w-150 h-120 border-slate-100 rounded-4xl drop-shadow-xl">
          <div className="flex-all-center">
            <div>
              <div className="flex-all-center w-full">
                <img className="w-32" src={LogoRiori} alt="" />
              </div>
              <div className="flex-all-center p-2">
                <h2 className="tracking-widest font-bold text-xl text-amber-500">
                  Reset Password
                </h2>
              </div>
              {message && (
                <span
                  className={
                    message
                      ? "flex-all-center m-auto w-full text-teal-400 text-sm items-center"
                      : "hidden"
                  }
                >
                  {message}
                </span>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex-all-center mt-6">
                  <div>
                    <label className="text-amber-500">New Password</label>
                    <input
                      type="password"
                      className="flex items-center mt-2 py-1 px-2 w-80"
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
                            ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                            : "hidden"
                        }
                      >
                        {errors.password}
                      </span>
                    )}
                    <label className="text-amber-500 mt-4 flex">
                      Password Confirmation
                    </label>
                    <input
                      type="password"
                      className="flex items-center mt-2 py-1 px-2 w-80"
                      placeholder="Password Confirmation"
                      autoComplete="off"
                      required
                      onChange={handlePasswordConfirmationChange}
                      value={passwordConfirmation}
                    />
                    {errorPassword && (
                      <p style={{ color: "red" }}>{errorPassword}</p>
                    )}
                    {errors.password_confirmation && (
                      <span
                        ref={errorRef}
                        className={
                          errors.password_confirmation
                            ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                            : "hidden"
                        }
                      >
                        {errors.password_confirmation}
                      </span>
                    )}
                    <button
                      type="submit"
                      className={
                        processing
                          ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                          : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
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
                      <span>Reset Password</span>
                    </button>
                    <Link
                      to="/"
                      className="text-amber-500 mt-4 flex justify-center hover:text-amber-300"
                    >
                      Back to login
                    </Link>
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

export default ResetPassword;
