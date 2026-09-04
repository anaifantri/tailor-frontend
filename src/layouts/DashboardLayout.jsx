import HeaderLayout from "@/layouts/HeaderLayout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import Svg from "@/Components/Svg";
import EmailSvg from "@/Assets/Svg/EmailSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function DashboardLayout() {
  const { user, logout, resendEmailVerification } = useAuth();
  const [message, setMessage] = useState("");
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
      <HeaderLayout />
      <main>
        <div className="flex w-full min-h-screen justify-center p-2 text-sm bg-stone-50 z-0">
          {user && !user.email_verified_at ? (
            <div className="text-red-700 text-xs">
              <div className="flex-all-center">
                <span className="flex font-semibold">
                  Akun anda belum aktif..!!
                </span>
              </div>
              <div className="flex-all-center w-full text-stone-800">
                {message && (
                  <>
                    <span
                      className={
                        message
                          ? "flex-all-center m-auto w-full text-green-500 mt-4 text-sm items-center"
                          : "hidden"
                      }
                    >
                      {message}
                    </span>
                  </>
                )}
              </div>
              <div className="flex-all-center">
                <span className="flex ml-2 w-150 text-center mt-2">
                  Silakan periksa inbox email Anda dan klik link verifikasi yang
                  telah dikirim untuk memverifikasi akun. Atau klik tombol
                  dibawah ini untuk mengirim ulang link verifikasi.
                </span>
              </div>
              <div className="flex-all-center mt-4">
                {/* <Link
                  to={"/resend-email-verification"}
                  className="flex-all-center mx-1 button-success cursor-pointer"
                >
                  <Svg title="Resend" c={"w-3 fill-current mx-1"}>
                    <EmailSvg />
                  </Svg>
                  <span className="mx-1">Resend Email Verification</span>
                </Link> */}
                <form onSubmit={handleSubmit}>
                  <div className="flex-all-center">
                    <button
                      type="submit"
                      className={
                        processing
                          ? "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                          : "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
                      }
                    >
                      {processing ? (
                        <Svg
                          title="Spin"
                          c={"w-5 fill-current mx-2 animate-spin"}
                        >
                          <SpinSvg />
                        </Svg>
                      ) : (
                        <Svg title="Resend" c={"w-3 fill-current mx-1"}>
                          <EmailSvg />
                        </Svg>
                      )}
                      <span>Resend Email Verification</span>
                    </button>
                  </div>
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
