import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/components/LoadingData";
import Svg from "@/components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function Show() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [clothingType, setClothingType] = useState({
    hashed_id: "",
    code: "",
    type: "",
    base_price: "",
  });
  const [measurements, setMeasurements] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const errorRef = useRef();
  const codeRef = useRef();
  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/clothing-types/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClothingType(response.data.clothing_type);
        const getMeasurements =
          response.data.clothing_type.measurement_details.map(
            (measurement) => measurement.measurement,
          );
        setMeasurements(getMeasurements);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
          console.log(err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lastMeasurements = measurements.at(-1);
    if (lastMeasurements != "") {
      setMeasurements((prevMeasurements) => [...prevMeasurements, ""]);
    }
  }, [measurements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClothingType((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMeasurements = (e, index) => {
    if (e.target.value == "") {
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

  const removeMeasurement = (indexToRemove) => {
    const updatedMeasurements = measurements.filter(
      (_, indexArray) => indexArray !== indexToRemove,
    );
    setMeasurements(updatedMeasurements);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const formData = new FormData();
    formData.append("hashed_id", clothingType.hashed_id);
    formData.append("code", clothingType.code);
    formData.append("type", clothingType.type);
    formData.append("base_price", clothingType.base_price);
    measurements.map((measurement, index) => {
      if (measurement != "") {
        formData.append(`measurements[${index}][measurement]`, measurement);
      }
    });

    try {
      setProcessing(true);
      const response = await api.post(
        `/api/clothing-types/${id}/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        },
      );
      navigate("/dashboard/setting/clothing-types", {
        state: { message: "Berhasil mengubah data jenis pakaian..!!" },
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

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="w-160">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Jenis Pakaian"
            backUrl="/dashboard/settings/clothing-types"
            getProcessing={processing}
          />
          <div className="border border-gray-200 shadow-lg rounded-xl px-6 py-4 mt-4">
            <div className="flex items-center">
              <label className="w-44">Kode</label>
              <input
                type="text"
                name="code"
                defaultValue={clothingType.code}
                className="flex p-2 h-8 w-100"
                placeholder="Masukkan Kode"
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
                defaultValue={clothingType.type}
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
                defaultValue={Number(clothingType.base_price)}
                className="flex p-2 h-8 w-100 spinner-disabled"
                autoComplete="off"
                placeholder="Masukkan harga"
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
                    value={measurement ? measurement : ""}
                    placeholder="Masukkan bagian yang perlu di ukur"
                    className="flex p-2 h-8 w-100"
                    onChange={(event) => handleMeasurements(event, index)}
                  />
                  {measurement !== "" && (
                    <button
                      type="button"
                      onClick={() => removeMeasurement(index)}
                      className="flex-all-center p-1 m-1 rounded-md text-white bg-red-700 hover:bg-red-500 cursor-pointer"
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
