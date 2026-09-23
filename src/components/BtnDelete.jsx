import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/apiService";
import Svg from "@/components/Svg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";

export default function BtnDelete({
  deleteId,
  deleteUrl,
  getToken,
  returnUrl,
  onSuccess,
}) {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?",
    );

    if (!isConfirmed) return;

    // Format URL dengan aman agar dipastikan memiliki slash '/' di antara URL dan ID
    const formattedUrl = `${deleteUrl}/${deleteId}`;

    try {
      setProcessing(true);

      // Gunakan HTTP Method DELETE (bukan POST)
      const response = await api.delete(formattedUrl, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });

      const successMsg = response.data?.message || "Data berhasil dihapus.";

      // Jika ada callback onSuccess (digunakan pada tabel Index untuk refresh data)
      if (onSuccess) {
        onSuccess(successMsg);
      }

      // Navigasi ke halaman tujuan jika returnUrl disediakan
      if (returnUrl) {
        navigate(returnUrl, {
          state: { message: successMsg },
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Terjadi kesalahan saat menghapus data.";

      if (returnUrl) {
        navigate(returnUrl, {
          state: { failed: errorMsg },
        });
      } else {
        alert(errorMsg);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={processing}
      className="flex-all-center button-danger cursor-pointer disabled:opacity-50"
      title="Hapus Data"
    >
      <Svg title="Delete" c={"w-5 fill-current mx-1"}>
        <DeleteSvg />
      </Svg>
      <span className="mx-1">{processing ? "Proses..." : "Hapus"}</span>
    </button>
  );
}
