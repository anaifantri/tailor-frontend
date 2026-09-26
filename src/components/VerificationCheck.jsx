import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import EmailSvg from "@/assets/Svg/EmailSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function VerificationCheck() {
  const { user, resendEmailVerification } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");
    setError("");

    try {
      const response = await resendEmailVerification();
      setMessage(
        response?.data?.message || "Link verifikasi baru berhasil dikirim!",
      );
    } catch (err) {
      if (!err?.response) {
        setError("Gagal terhubung ke server. Periksa koneksi Anda.");
      } else {
        setError(
          err.response?.data?.message ||
            "Gagal mengirim ulang link verifikasi.",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center space-y-4">
      <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
        <Svg title="Email" c="w-6 h-6 fill-current">
          <EmailSvg />
        </Svg>
      </div>

      <h2 className="text-lg font-bold text-white">Akun Anda Belum Aktif!</h2>
      <p className="text-xs text-slate-400 leading-relaxed">
        Silakan periksa kotak masuk email Anda dan klik link verifikasi yang
        telah kami kirimkan. Jika belum menerima email, tekan tombol di bawah.
      </p>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitVerification} className="pt-2">
        <button
          type="submit"
          disabled={processing}
          className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <Svg title="Spin" c="w-4 h-4 fill-current mr-2 animate-spin">
                <SpinSvg />
              </Svg>
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <Svg title="Resend" c="w-4 h-4 fill-current mr-2">
                <EmailSvg />
              </Svg>
              <span>Kirim Ulang Email Verifikasi</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
