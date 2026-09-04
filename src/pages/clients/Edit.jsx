import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
import ProfileSvg from "@/assets/Svg/ProfileSvg";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const nameRef = useRef();
  const errorRef = useRef();
  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [editClient, setEditClient] = useState({
    hashed_id: "",
    code: "",
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setEditClient({ ...editClient, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/clients/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditClient(response.data.client);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const formData = new FormData();
    formData.append("hashed_id", editClient.hashed_id);
    formData.append("code", editClient.code);
    formData.append("name", editClient.name);
    formData.append("address", editClient.address);
    formData.append("email", editClient.email);
    formData.append("phone", editClient.phone);

    try {
      setProcessing(true);
      const response = await api.post(`/api/clients/${id}/edit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/clients", {
        state: { message: "Berhasil mengubah data pelanggan..!!" },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
        nameRef.current.focus();
        setErrorMessage("Update gagal..!!");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="w-250">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pelanggan"
            backUrl="/dashboard/clients"
            getProcessing={processing}
          />
          <div className="flex-all-center mt-4">
            <div className="border rounded-xl p-4">
              <div className="flex items-center">
                <label className="w-36">Nama</label>
                <input
                  type="text"
                  name="name"
                  className="flex p-2 h-8 w-120"
                  autoComplete="off"
                  ref={nameRef}
                  onChange={handleChange}
                  defaultValue={editClient.name}
                  required
                />
              </div>
              {getErrors.name && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.name}
                </span>
              )}
              <div className="flex mt-2">
                <label className="w-36">Alamat</label>
                <textarea
                  name="address"
                  className="flex p-1 w-120"
                  rows={3}
                  onChange={handleChange}
                  defaultValue={editClient.address}
                />
              </div>
              {getErrors.address && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.address}
                </span>
              )}
              <div className="flex items-center mt-2">
                <label className="w-36">Nomor Hp.</label>
                <input
                  type="text"
                  name="phone"
                  className="flex p-2 h-8 w-120"
                  placeholder="Input Nomor Hp."
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editClient.phone}
                  required
                />
              </div>
              {getErrors.phone && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.phone}
                </span>
              )}
              <div className="flex items-center mt-2">
                <label className="w-36">Email</label>
                <input
                  type="text"
                  name="email"
                  className="flex p-2 h-8 w-120"
                  placeholder="Input email"
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editClient.email}
                />
              </div>
              {getErrors.email && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.email}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
