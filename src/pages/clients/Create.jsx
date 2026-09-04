import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderCreate from "@/components/HeaderCreate";
import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const errorRef = useRef();
  const nameRef = useRef();
  const fileInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const [formData, setFormData] = useState({
    hashed_id: "",
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
      [name]: e.target.value,
    }));
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const dataClient = new FormData();
    dataClient.append("code", formData.code);
    dataClient.append("name", formData.name);
    dataClient.append("email", formData.email);
    dataClient.append("phone", formData.phone);
    dataClient.append("address", formData.address);

    try {
      setProcessing(true);
      const response = await api.post("/api/clients", dataClient, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/clients", {
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
            backUrl="/dashboard/clients"
            getProcessing={processing}
          />
          <div className="flex-all-center mt-4">
            <div className="flex p-2 border rounded-xl">
              <div>
                <div className="flex items-center">
                  <label className="w-36">Nama</label>
                  <input
                    type="text"
                    name="name"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input Nama Lengkap"
                    autoComplete="off"
                    ref={nameRef}
                    onChange={handleChange}
                    required
                  />
                </div>
                {getErrors.name && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
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
                    placeholder="Input Alamat"
                    rows={3}
                    onChange={handleChange}
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
                    required
                  />
                </div>
                {getErrors.phone && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
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
                    type="email"
                    name="email"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input email"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </div>
                {getErrors.email && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
