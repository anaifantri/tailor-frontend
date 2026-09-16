import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import SaveSvg from "@/assets/Svg/SaveSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";

export default function NewMeasurementHistory({
  measurements,
  setOrderDetails,
  orderDetails,
  setMeasurements,
  customer,
  indexOrderDetail,
  clothingTypeId,
  clothingType,
  today,
  setMeasurementModalOpen,
}) {
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [newMeasurementHistory, setNewMeasurementHistory] = useState({
    customer_id: customer.hashed_id,
    clothing_type_id: clothingTypeId,
    measured_at: today,
    measured_by: "",
    measurement_details: measurements,
    notes: "",
  });

  const handleMeasurements = (e, index) => {
    const { name, value } = e.target;
    const newMeasurements = [...measurements];
    newMeasurements[index][name] = value;
    setMeasurements(newMeasurements);
    setNewMeasurementHistory((prevData) => ({
      ...prevData,
      ["measurement_details"]: newMeasurements,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurementHistory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteMeasurement = (indexToRemove) => {
    const updatedMeasurements = measurements.filter(
      (_, index) => index !== indexToRemove,
    );
    setMeasurements(updatedMeasurements);
    setNewMeasurementHistory((prevData) => ({
      ...prevData,
      ["measurement_details"]: updatedMeasurements,
    }));
  };

  useEffect(() => {
    const lastMeasurement = measurements.at(-1);
    if (lastMeasurement.name != "" && lastMeasurement.name != null) {
      const newMeasurement = { name: "", value: 0 };
      setMeasurements((prevMeasurements) => [
        ...prevMeasurements,
        newMeasurement,
      ]);
    }
  }, [measurements]);

  const handleMeasurementSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const measurementHistory = new FormData();
    measurementHistory.append("customer_id", customer.hashed_id);
    measurementHistory.append("clothing_type_id", clothingTypeId);
    measurementHistory.append("measured_by", newMeasurementHistory.measured_by);
    measurementHistory.append("measured_at", newMeasurementHistory.measured_at);
    measurementHistory.append("notes", newMeasurementHistory.notes);
    measurementHistory.append(
      "measurement_details",
      JSON.stringify(newMeasurementHistory.measurement_details),
    );

    try {
      setProcessing(true);
      const response = await api.post(
        "/api/measurement-histories",
        measurementHistory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        },
      );

      const newOrderDetails = [...orderDetails];
      orderDetails[indexOrderDetail].measurements = measurements;
      setOrderDetails(newOrderDetails);
      setMeasurementModalOpen(false);
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
    <form onSubmit={handleMeasurementSubmit}>
      <div className="grid grid-cols-2 gap-4 w-250 mt-4">
        <div className="p-4 border border-gray-200 shadow-lg rounded-xl">
          <div className="flex items-center">
            <label className="w-44">Nama Pelanggan</label>
            <label>:</label>
            <label className="ml-2">{customer?.name}</label>
          </div>
          <div className="flex items-center mt-2">
            <label className="w-44">Jenis Pakaian</label>
            <label>:</label>
            <label className="ml-2">{clothingType}</label>
          </div>
          <div className="flex items-center mt-2">
            <label className="w-44">Tanggal Ukur</label>
            <label>:</label>
            <input
              name="measured_at"
              onChange={handleChange}
              type="date"
              value={newMeasurementHistory.measured_at}
              className="ml-2 px-2"
              required
            />
            {getErrors?.measured_at && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors?.measured_at}
              </span>
            )}
          </div>
          <div className="flex items-center mt-2">
            <label className="w-44">Diukur Oleh</label>
            <label>:</label>
            <input
              name="measured_by"
              onChange={handleChange}
              type="text"
              className="ml-2 px-2 w-72"
              placeholder="Masukkan nama pengukur"
              required
            />
            {getErrors?.measured_by && (
              <span
                ref={errorRef}
                className={
                  getErrors
                    ? "flex w-full text-red-500 text-xs items-center"
                    : "hidden"
                }
              >
                {getErrors?.measured_by}
              </span>
            )}
          </div>
          <label className="flex w-32 mt-4 ml-2 font-semibold">
            Keterangan :
          </label>
          <textarea
            name="notes"
            rows={4}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-2"
            required
          ></textarea>
          {getErrors?.notes && (
            <span
              ref={errorRef}
              className={
                getErrors
                  ? "flex w-full text-red-500 text-xs items-center"
                  : "hidden"
              }
            >
              {getErrors?.notes}
            </span>
          )}
        </div>
        <div className="p-4 border border-gray-200 shadow-lg rounded-xl max-h-110 overflow-y-auto">
          <div className="flex items-center border-b p-1 w-104">
            <label className="w-44">Bagian yang perlu di ukur</label>
          </div>
          {measurements.map((measurement, index) => (
            <div key={index} className="flex items-center border-b p-1 w-104">
              <label className="w-6">{index + 1}. </label>
              <input
                type="text"
                name="name"
                value={measurement.name || ""}
                onChange={(e) => handleMeasurements(e, index)}
                className="w-56 px-1"
                placeholder="Tambahan"
              />
              <input
                type="number"
                name="value"
                onChange={(e) => handleMeasurements(e, index)}
                value={measurement.value || ""}
                required={measurement.name != "" && measurement.name != null}
                className="w-20 px-2 text-center spinner-disabled ml-2"
              />
              <label className="flex w-6 ml-2">cm</label>
              {measurements.length > 1 && index < measurements.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteMeasurement(index)}
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
      </div>
      <div className="flex w-full justify-end mt-2 px-4">
        <button
          type="submit"
          disabled={processing}
          className={
            processing
              ? "flex-all-center button-disabled"
              : "flex-all-center button-success cursor-pointer"
          }
        >
          {processing ? (
            <Svg title="Spin" c={"w-4 fill-current mx-1 animate-spin"}>
              <SpinSvg />
            </Svg>
          ) : (
            <Svg title="Save" c={"w-4 fill-current mx-1"}>
              <SaveSvg />
            </Svg>
          )}
          <span className="mx-1">
            {processing ? "Menyimpan data..." : "Simpan"}
          </span>
        </button>
      </div>
    </form>
  );
}
