import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef();
  const errorRef = useRef();
  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [editCustomer, setEditCustomer] = useState({
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
    setEditCustomer({ ...editCustomer, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/customers/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditCustomer(response.data.customer);
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
    formData.append("hashed_id", editCustomer.hashed_id);
    formData.append("code", editCustomer.code);
    formData.append("name", editCustomer.name);
    formData.append("address", editCustomer.address);
    formData.append("email", editCustomer.email);
    formData.append("phone", editCustomer.phone);

    try {
      setProcessing(true);
      const response = await api.post(`/api/customers/${id}/edit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/customers", {
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
      <div className="w-160">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pelanggan"
            backUrl="/dashboard/customers"
            getProcessing={processing}
          />
          <div className="border border-slate-200 shadow-xl rounded-xl p-4 mt-4">
            <label>Nama Pelanggan</label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan nama pelanggan"
              className="flex p-2 h-8 w-full mt-1"
              autoComplete="off"
              ref={nameRef}
              onChange={handleChange}
              defaultValue={editCustomer.name}
              required
            />
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
            <label className="flex mt-4">Alamat</label>
            <textarea
              name="address"
              className="flex p-1 w-120 mt-1"
              placeholder="Masukkan alamat"
              rows={3}
              onChange={handleChange}
              defaultValue={editCustomer.address}
            />
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
            <label className="flex mt-4">Nomor Hp.</label>
            <input
              type="text"
              name="phone"
              className="flex p-2 h-8 w-full mt-1"
              placeholder="Masukkan Nomor Hp."
              autoComplete="off"
              onChange={handleChange}
              defaultValue={editCustomer.phone}
              required
            />
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
            <label className="flex mt-4">Email</label>
            <input
              type="text"
              name="email"
              className="flex p-2 h-8 w-full mt-1"
              placeholder="Masukkan alamat email"
              autoComplete="off"
              onChange={handleChange}
              defaultValue={editCustomer.email}
            />
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
        </form>
      </div>
    </>
  );
}
