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
      <div className="w-250">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pelanggan"
            backUrl="/dashboard/customers"
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
                  defaultValue={editCustomer.name}
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
                  defaultValue={editCustomer.address}
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
                  defaultValue={editCustomer.phone}
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
                  defaultValue={editCustomer.email}
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
