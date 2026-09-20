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
  const codeRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const [formData, setFormData] = useState({
    code: "",
    type: "",
    category: "",
    base_price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    codeRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const clothingType = new FormData();
    clothingType.append("code", formData.code);
    clothingType.append("type", formData.type);
    clothingType.append("category", formData.category);
    clothingType.append("base_price", formData.base_price);

    try {
      setProcessing(true);
      const response = await api.post("/api/clothing-types", clothingType, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      const getClothingType = response.data.clothing_type;
      navigate(
        "/dashboard/settings/clothing-types/" + getClothingType.hashed_id,
        {
          state: {
            message:
              "Penambahan data jenis pakaian dengan nama " +
              getClothingType.type +
              " berhasil..!!",
          },
        },
      );
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
        console.log(err.response.data);
        codeRef.current.focus();
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
            titleCreate="Data Jenis Pakaian"
            backUrl="/dashboard/settings/clothing-types"
            getProcessing={processing}
          />

          <div className="border border-gray-200 shadow-lg rounded-xl col-span-2 p-4 mt-4">
            <div className="flex items-center">
              <label className="w-44">Kode</label>
              <input
                type="text"
                name="code"
                className="flex p-2 h-8 w-100"
                placeholder="Masukkan kode"
                autoComplete="off"
                ref={codeRef}
                onChange={handleChange}
                required
              />
            </div>
            {getErrors.code && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors.code}
              </span>
            )}
            <div className="flex items-center mt-2">
              <label className="w-44">Jenis Pakaian</label>
              <input
                type="text"
                name="type"
                className="flex p-2 h-8 w-100"
                placeholder="Masukkan jenis pakaian"
                autoComplete="off"
                onChange={handleChange}
                required
              />
            </div>
            {getErrors.type && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors.type}
              </span>
            )}
            <div className="flex items-center mt-2">
              <label className="w-44">Harga</label>
              <input
                type="number"
                name="base_price"
                className="flex p-2 h-8 w-100 spinner-disabled"
                autoComplete="off"
                placeholder="Masukkan harga dasar"
                onChange={handleChange}
              />
            </div>
            {getErrors.base_price && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors.base_price}
              </span>
            )}
            <div className="flex items-center mt-2">
              <label className="w-44">Katagori Pakaian</label>
              <input
                type="radio"
                name="category"
                value={"baju"}
                onClick={handleChange}
                required
              />
              <label className="ml-1">BAJU</label>
              <input
                className="ml-4"
                type="radio"
                name="category"
                value={"celana"}
                onClick={handleChange}
                required
              />
              <label className="ml-1">CELANA</label>
              <input
                className="ml-4"
                type="radio"
                name="category"
                value={"rok"}
                onClick={handleChange}
                required
              />
              <label className="ml-1">ROK</label>
            </div>
            {getErrors.category && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors.category}
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
