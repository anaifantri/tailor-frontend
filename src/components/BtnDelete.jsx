import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Svg from "@/components/Svg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";
import api from "@/apiService";

export default function BtnDelete({
  deleteId,
  deleteUrl,
  getToken,
  returnUrl,
}) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Handle the delete operation
  const handleDelete = async (url, id, token, getReturnUrl) => {
    const isConfirmed = window.confirm(
      "Apakah anda yakin ingin menghapus data ini..?",
    );
    if (isConfirmed) {
      try {
        // Send the DELETE request to the API
        const response = await api.post(
          url + id,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.message) {
          navigate(getReturnUrl, {
            state: { message: response.data.message },
          });
        } else if (response.data.failed) {
          navigate(getReturnUrl, {
            data: { failed: response.data.failed },
          });
        }
      } catch (err) {
        setError(err.message);
        console.error("There was an error!", err);
      }
    }
  };
  return (
    <button
      type="button"
      onClick={() => handleDelete(deleteUrl, deleteId, getToken, returnUrl)}
      className="flex-all-center button-danger cursor-pointer"
    >
      <Svg title="Delete" c={"w-5 fill-current mx-1"}>
        <DeleteSvg />
      </Svg>
      <span className="mx-1">Delete</span>
    </button>
  );
}
