import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import HeaderCreate from "@/components/HeaderCreate";
import Svg from "@/components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const errorRef = useRef();
  const codeRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});

  const rok = ["Panjang Rok", "Lingkar Pinggang", "Lingkar Pinggul"];
  const celana = [
    "Panjang Celana",
    "Lingkar Pinggang",
    "Lingkar Pinggul",
    "Pesak",
    "Paha",
    "Lutut",
    "Kaki",
  ];
  const baju = [
    "Panjang Badan",
    "Lebar Bahu",
    "Panjang Tangan",
    "Lingkar Lengan",
    "Manset",
    "Lingkar Badan",
    "Lingkar Perut",
    "Lingkar Pinggul",
    "Lebar Dada",
    "Lebar Punggung",
    "Lingkar Leher",
  ];
  const [measurements, setMeasurements] = useState(baju);

  const [formData, setFormData] = useState({
    code: "",
    type: "",
    base_price: 0,
  });

  const handleRemove = (indexToRemove) => {
    const updatedMeasurements = measurements.filter(
      (_, index) => index !== indexToRemove,
    );
    setMeasurements(updatedMeasurements);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMeasurements = (e, index) => {
    if (index !== measurements.length - 1 && e.target.value === "") {
      const updatedMeasurements = measurements.filter(
        (_, indexArray) => indexArray !== index,
      );
      setMeasurements(updatedMeasurements);
    } else {
      const newMeasurements = [...measurements];
      newMeasurements[index] = e.target.value;
      setMeasurements(newMeasurements);
    }
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

    try {
      setProcessing(true);
      const response = await api.post("/api/clothing-types", clothingType, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/settings/clothing-types", {
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
              <label className="w-44">Katagori</label>
              <input
                type="radio"
                name="category"
                value={"baju"}
                onClick={() => setMeasurements(baju)}
                defaultChecked
              />
              <label className="ml-1">Baju</label>
              <input
                className="ml-4"
                type="radio"
                name="category"
                value={"celana"}
                onClick={() => setMeasurements(celana)}
              />
              <label className="ml-1">Celana</label>
              <input
                className="ml-4"
                type="radio"
                name="category"
                value={"rok"}
                onClick={() => setMeasurements(rok)}
              />
              <label className="ml-1">Rok</label>
            </div>
            <div className="mt-4">
              <label className="w-44">Bagian yang perlu di ukur : </label>
              {measurements.map((measurement, index) => (
                <div key={index} className="flex items-center mt-2">
                  <label className="w-6">{index + 1}. </label>
                  <input
                    type="text"
                    value={measurement}
                    placeholder="Masukkan bagian yang perlu di ukur"
                    className="flex p-2 h-8 w-100"
                    onChange={(event) => handleMeasurements(event, index)}
                  />
                  {measurements.length > 1 &&
                    index !== measurements.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="flex-all-center ml-2 p-1 m-1 rounded-md text-white bg-red-700 hover:bg-red-500 cursor-pointer"
                      >
                        <Svg title="Delete" c={"w-5 fill-current"}>
                          <DeleteSvg />
                        </Svg>
                      </button>
                    )}
                </div>
              ))}
            </div>
            {getErrors.measurements && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors.measurements}
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
