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
  const [measurements, setMeasurements] = useState([""]);

  const [formData, setFormData] = useState({
    code: "",
    type: "",
    base_price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMeasurements = (e, index) => {
    const newMeasurements = [...measurements];
    newMeasurements[index] = e.target.value;
    setMeasurements(newMeasurements);
  };

  useEffect(() => {
    codeRef.current.focus();
  }, []);

  useEffect(() => {
    const lastMeasurements = measurements.at(-1);
    if (lastMeasurements != "") {
      setMeasurements((prevMeasurements) => [...prevMeasurements, ""]);
    }
  }, [measurements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const clothingType = new FormData();
    clothingType.append("code", formData.code);
    clothingType.append("type", formData.type);
    clothingType.append("base_price", formData.base_price);
    measurements.map((measurement, index) => {
      if (measurement != "") {
        clothingType.append(`measurements[${index}][measurement]`, measurement);
      }
    });
    console.log(formData);

    try {
      setProcessing(true);
      const response = await api.post("/api/clothing-types", clothingType, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/clothing-types", {
        state: {
          message: "Penambahan data jenis pakaian berhasil..!!",
        },
      });
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
            backUrl="/dashboard/clothing-types"
            getProcessing={processing}
          />
          <div className="flex-all-center mt-4">
            <div className="flex p-2 border rounded-xl">
              <div>
                <div className="flex items-center">
                  <label className="w-44">Kode</label>
                  <input
                    type="text"
                    name="code"
                    className="flex p-2 h-8 w-100"
                    placeholder="Input Kode"
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
                    placeholder="Input jenis pakaian"
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
                    placeholder="Input harga"
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
                <div className="mt-4">
                  <label className="w-44">Bagian yang perlu di ukur : </label>
                  {measurements.map((measurement, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <label className="w-6">{index + 1}. </label>
                      <input
                        type="text"
                        defaultValue={measurement}
                        placeholder="Input bagian yang perlu di ukur"
                        className="flex p-2 h-8 w-72"
                        onChange={(event) => handleMeasurements(event, index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
