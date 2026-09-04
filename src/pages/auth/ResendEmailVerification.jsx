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
      <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
        <div className="flex-all-center bg-stone-900 w-150 h-100 border-slate-100 rounded-4xl drop-shadow-xl">
          <div className="flex-all-center">
            <div>
              <div className="flex-all-center w-full0">
                <img className="w-32" src={LogoRiori} alt="" />
              </div>
              <div className="flex-all-center p-2">
                <label className="flex justify-center text-center tracking-widest font-bold text-sm text-amber-500 w-96">
                  Klik tombol di bawah ini untuk pengiriman ulang link
                  verifikasi email
                </label>
              </div>
              {message && (
                <>
                  <span
                    className={
                      message
                        ? "flex-all-center m-auto w-full text-red-700 text-sm items-center"
                        : "hidden"
                    }
                  >
                    {message}
                  </span>
                </>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex-all-center mt-6">
                  <button
                    type="submit"
                    className={
                      processing
                        ? "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                        : "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
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
                    <span>Resend Verification</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default resendEmailVerification;
