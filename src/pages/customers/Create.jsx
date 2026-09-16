import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import HeaderCreate from "@/components/HeaderCreate";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const errorRef = useRef();
  const nameRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const dataCustomer = new FormData();
    dataCustomer.append("code", formData.code);
    dataCustomer.append("name", formData.name);
    dataCustomer.append("email", formData.email);
    dataCustomer.append("phone", formData.phone);
    dataCustomer.append("address", formData.address);

    try {
      setProcessing(true);
      const response = await api.post("/api/customers", dataCustomer, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/customers", {
        state: {
          message: "Penambahan data pelanggan berhasil..!!",
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
        nameRef.current.focus();
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="w-160">
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data Pelanggan"
            backUrl="/dashboard/customers"
            getProcessing={processing}
          />
          <div className="border border-slate-200 shadow-xl rounded-xl p-4 mt-4">
            <label>Nama Pelanggan</label>
            <input
              type="text"
              name="name"
              className="flex p-2 h-8 w-full mt-1"
              placeholder="Masukkan Nama Pelanggan"
              autoComplete="off"
              ref={nameRef}
              onChange={handleChange}
              required
            />
            {getErrors?.name && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors?.name}
              </span>
            )}
            <label className="flex mt-4">Alamat</label>
            <textarea
              name="address"
              className="flex p-1 w-full mt-1"
              placeholder="Masukkan Alamat"
              rows={3}
              onChange={handleChange}
            />
            {getErrors?.address && (
              <span
                ref={errorRef}
                className={
                  errorMessage
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors?.address}
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
              required
            />
            {getErrors?.phone && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors?.phone}
              </span>
            )}
            <label className="flex mt-4">Email</label>
            <input
              type="email"
              name="email"
              className="flex p-2 h-8 w-full mt-1"
              placeholder="Masukkan email"
              autoComplete="off"
              onChange={handleChange}
            />
            {getErrors?.email && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors?.email}
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
