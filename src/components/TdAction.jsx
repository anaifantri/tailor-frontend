import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import Svg from "@/components/Svg";
import api from "@/apiService";

import ShowSvg from "@/assets/Svg/ShowSvg";
import EditSvg from "@/assets/Svg/EditSvg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";

export default function TdAction({
  showUrl,
  editUrl,
  deleteId,
  deleteUrl,
  getToken,
  returnUrl,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // Handle the delete operation
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini...?",
    );

    if (!isConfirmed) return;

    const formattedUrl = `${deleteUrl}/${deleteId}`;

    try {
      setProcessing(true);

      const response = await api.delete(formattedUrl, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });

      const successMsg = response.data?.message || "Data berhasil dihapus.";
      const targetUrl = returnUrl || location.pathname;

      // Navigasi menggunakan React Router dengan query param & state agar terbaca di Index.jsx
      navigate(`${targetUrl}?message=${encodeURIComponent(successMsg)}`, {
        replace: true,
        state: { message: successMsg },
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Gagal menghapus data dari server.";
      const targetUrl = returnUrl || location.pathname;

      navigate(`${targetUrl}?failed=${encodeURIComponent(errorMsg)}`, {
        replace: true,
        state: { failed: errorMsg },
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex-all-center">
      <Link
        to={showUrl}
        className="flex-all-center p-1 m-1 rounded-md bg-teal-700 text-white hover:bg-teal-500"
        title="Detail"
      >
        <Svg title="Show" c={"w-5 fill-current"}>
          <ShowSvg />
        </Svg>
      </Link>
      <Link
        to={editUrl}
        className="flex-all-center p-1 m-1 rounded-md text-white bg-amber-700 hover:bg-amber-500"
        title="Edit"
      >
        <Svg title="Edit" c={"w-5 fill-current"}>
          <EditSvg />
        </Svg>
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={processing}
        className="flex-all-center p-1 m-1 rounded-md text-white bg-red-700 hover:bg-red-500 cursor-pointer disabled:opacity-50"
        title="Hapus"
      >
        <Svg title="Delete" c={"w-5 fill-current"}>
          <DeleteSvg />
        </Svg>
      </button>
    </div>
  );
}
