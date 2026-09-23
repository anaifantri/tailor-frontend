import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";
import HeaderCreate from "@/components/HeaderCreate";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const codeRef = useRef(null);

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
    codeRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    try {
      setProcessing(true);
      const response = await api.post("/api/clothing-types", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const clothingType = response.data.clothing_type;
      navigate(`/dashboard/settings/clothing-types/${clothingType.ulid}`, {
        state: {
          message: `Penambahan data jenis pakaian dengan nama ${clothingType.type} berhasil..!!`,
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else if (err.response?.data?.errors) {
        setGetErrors(err.response.data.errors);
        codeRef.current?.focus();
      } else {
        setErrorMessage(
          err.response?.data?.message || "Gagal menyimpan data..!!",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-160">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Jenis Pakaian"
          backUrl="/dashboard/settings/clothing-types"
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-2 mt-2 text-sm text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <div className="border border-gray-200 shadow-lg rounded-xl p-4 mt-4">
          <div className="flex items-center">
            <label className="w-44">Kode</label>
            <input
              type="text"
              name="code"
              className="flex p-2 h-8 w-100 border rounded"
              placeholder="Masukkan kode"
              autoComplete="off"
              ref={codeRef}
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
          {getErrors.code && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.code[0]}
            </span>
          )}

          <div className="flex items-center mt-2">
            <label className="w-44">Jenis Pakaian</label>
            <input
              type="text"
              name="type"
              className="flex p-2 h-8 w-100 border rounded"
              placeholder="Masukkan jenis pakaian"
              autoComplete="off"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>
          {getErrors.type && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.type[0]}
            </span>
          )}

          <div className="flex items-center mt-2">
            <label className="w-44">Harga</label>
            <input
              type="number"
              name="base_price"
              className="flex p-2 h-8 w-100 border rounded spinner-disabled"
              autoComplete="off"
              placeholder="Masukkan harga dasar"
              value={formData.base_price}
              onChange={handleChange}
            />
          </div>
          {getErrors.base_price && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.base_price[0]}
            </span>
          )}

          <div className="flex items-center mt-2">
            <label className="w-44">Kategori Pakaian</label>
            <input
              type="radio"
              name="category"
              value="baju"
              checked={formData.category === "baju"}
              onChange={handleChange}
              required
            />
            <label className="ml-1">BAJU</label>
            <input
              className="ml-4"
              type="radio"
              name="category"
              value="celana"
              checked={formData.category === "celana"}
              onChange={handleChange}
              required
            />
            <label className="ml-1">CELANA</label>
            <input
              className="ml-4"
              type="radio"
              name="category"
              value="rok"
              checked={formData.category === "rok"}
              onChange={handleChange}
              required
            />
            <label className="ml-1">ROK</label>
          </div>
          {getErrors.category && (
            <span className="flex w-full text-red-500 text-xs items-center mt-1">
              {getErrors.category[0]}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
