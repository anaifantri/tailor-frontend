import React from "react";

import Svg from "@/components/Svg";
import ReloadSvg from "@/Assets/Svg/ReloadSvg";

export default function ErrorMessage({ status, message, onRetry }) {
  const getErrorContent = () => {
    switch (status) {
      case 401:
        return {
          title: "Unauthorized..!!!",
          description:
            "Akses ditolak. Anda harus masuk (login) terlebih dahulu",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-800",
          descColor: "text-amber-600",
          iconColor: "bg-amber-100 text-amber-600",
        };
      case 403:
        return {
          title: "Akses Ditolak (403)",
          description: "Anda tidak memiliki izin untuk melihat data ini.",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800",
          descColor: "text-orange-600",
          iconColor: "bg-orange-100 text-orange-600",
        };
      case 404:
        return {
          title: "Data Tidak Ditemukan (404)",
          description:
            "Halaman atau data yang Anda cari tidak dapat ditemukan.",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          descColor: "text-blue-600",
          iconColor: "bg-blue-100 text-blue-600",
        };
      case 500:
      case 502:
      case 503:
        return {
          title: "Gangguan Server (500)",
          description:
            "Server kami sedang bermasalah. Silakan coba beberapa saat lagi.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          descColor: "text-red-600",
          iconColor: "bg-red-100 text-red-600",
        };
      default:
        return {
          title: "Terjadi Kesalahan",
          description:
            message || "Gagal terhubung ke server. Periksa koneksi Anda.",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-800",
          descColor: "text-gray-600",
          iconColor: "bg-gray-100 text-gray-600",
        };
    }
  };

  const content = getErrorContent();

  return (
    <div
      className={`mx-auto my-6 w-full rounded-lg border p-6 text-center shadow-sm ${content.bgColor} ${content.borderColor}`}
    >
      <div
        className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${content.iconColor}`}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className={`text-lg font-semibold ${content.textColor}`}>
        {content.title}
      </h3>
      <p className={`mt-1 text-sm ${content.descColor}`}>
        {content.description}
      </p>

      {onRetry && status !== 401 && status !== 403 && (
        <div className="flex-all-center w-full">
          <button
            onClick={onRetry}
            className="flex-all-center mt-4 button-primary cursor-pointer"
          >
            <Svg title="Show" c={"w-5 fill-current"}>
              <ReloadSvg />
            </Svg>
            <span className="mx-1">Coba Lagi</span>
          </button>
        </div>
      )}

      {status === 401 && (
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          Kembali ke halaman login
        </button>
      )}
    </div>
  );
}
