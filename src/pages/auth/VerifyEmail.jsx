import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import CheckSvg from "@/assets/Svg/CheckSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

export default function VerifyEmail() {
  const { user, verifyEmail } = useAuth();
  const { ulid, hash } = useParams();
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref untuk memastikan API verifikasi hanya dipanggil 1 kali
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    // Mencegah panggilan ganda jika sudah pernah dieksekusi
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const executeVerification = async () => {
      try {
        setLoading(true);
        const response = await verifyEmail(ulid, hash, searchParams);
        setMessage(response?.data?.message || "Email berhasil diverifikasi!");
      } catch (err) {
        if (!err?.response) {
          setError("Tidak ada respons dari server.");
        } else if (err.response?.status === 403) {
          setError(
            err.response.data?.message ||
              "Tautan verifikasi tidak valid atau sudah kedaluwarsa.",
          );
        } else {
          setError(err.response.data?.message || "Gagal memverifikasi email.");
        }
      } finally {
        setLoading(false);
      }
    };

    executeVerification();
  }, [ulid, hash, searchParams, verifyEmail]);

  return (
    <div className="flex-all-center min-h-screen bg-stone-50">
      <div className="flex-all-center bg-stone-900 w-full max-w-lg p-8 border border-slate-800 rounded-4xl drop-shadow-xl text-white">
        <div className="flex flex-col items-center text-center w-full">
          <img className="w-32 mb-4" src={LogoRiori} alt="Riori Tailor Logo" />

          <h2 className="tracking-widest font-bold text-xl text-amber-500 mb-6">
            Verifikasi Email
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center my-4">
              <Svg
                title="Loading"
                c={"w-8 h-8 fill-amber-500 animate-spin mb-2"}
              >
                <SpinSvg />
              </Svg>
              <span className="text-gray-300 text-sm">
                Proses memverifikasi email...
              </span>
            </div>
          )}

          {/* Success State */}
          {!loading && message && (
            <div className="flex flex-col items-center my-2 w-full">
              <div className="flex items-center text-teal-500 font-bold text-lg mb-2">
                <Svg title="Success" c={"w-6 h-6 fill-current mr-2"}>
                  <CheckSvg />
                </Svg>
                <span>BERHASIL!</span>
              </div>
              <p className="text-teal-400 text-sm mb-6">{message}</p>

              {user ? (
                <Link
                  to="/dashboard"
                  reloadDocument
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
                >
                  Ke Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
                >
                  Kembali ke Login
                </Link>
              )}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center my-2 w-full">
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm w-full mb-6">
                {error}
              </div>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Kembali ke Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
