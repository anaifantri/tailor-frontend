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
      <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
        <div className="flex-all-center bg-stone-900 w-150 border-stone-100 rounded-4xl drop-shadow-xl p-6">
          <div className="flex-all-center">
            <div>
              <div className="flex-all-center w-full">
                <img className="w-32" src={LogoRiori} alt="" />
              </div>
              <div className="flex-all-center">
                <h2 className="tracking-widest font-bold text-xl text-amber-500">
                  Forgot Password
                </h2>
              </div>
              {message && (
                <span
                  className={
                    message
                      ? "flex-all-center m-auto w-full text-teal-400 text-sm items-center mt-4"
                      : "hidden"
                  }
                >
                  {message}
                </span>
              )}
              <form onSubmit={handleSubmit}>
                <div className="flex-all-center mt-4">
                  <div>
                    <label className="text-amber-500">Email Address</label>
                    <input
                      type="email"
                      className="flex items-center mt-2 py-1 px-2 w-80"
                      placeholder="Input email address"
                      autoComplete="off"
                      required
                      ref={emailRef}
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    <button
                      type="submit"
                      disabled={processing}
                      className={
                        processing
                          ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled"
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

export default ForgotPassword;
