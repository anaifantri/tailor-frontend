import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";

import api from "@/apiService";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/Components/LoadingData";

export default function Create() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clothingTypeOptions, setClothingTypeOptions] = useState([]);
  const [clothingType, setClothingType] = useState(null);
  const [client, setClient] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([
    { name: "", value: 0 },
  ]);
  const [measurementHistory, setMeasurementHistory] = useState([]);
  const [measurementsLength, setMeasurementsLength] = useState(0);

  const errorRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurementHistory((prevMeasurementHistory) => ({
      ...prevMeasurementHistory,
      [name]: value,
    }));
  };

  const handleSelectTypeChange = (selectedOption) => {
    setMeasurementsLength(selectedOption.measurement_details.length);
    setMeasurementDetails([]);
    const newMeasurementDetails = [];
    selectedOption.measurement_details.map((measurement) => {
      const newMeasurement = { name: measurement.measurement, value: 0 };
      newMeasurementDetails.push(newMeasurement);
    });
    setMeasurementDetails(newMeasurementDetails);
    setMeasurementHistory((prevMeasurementHistory) => ({
      ...prevMeasurementHistory,
      ["measurement_details"]: newMeasurementDetails,
      ["clothing_type_id"]: selectedOption.value,
    }));
  };

  const handleMeasurements = (e, index) => {
    const { name, value } = e.target;
    const newMeasurementDetails = [...measurementDetails];
    newMeasurementDetails[index][name] = value;
    setMeasurementDetails(newMeasurementDetails);
    setMeasurementHistory((prevMeasurementHistory) => ({
      ...prevMeasurementHistory,
      ["measurement_details"]: newMeasurementDetails,
    }));
  };

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "mulipart/form-data",
    };
    const requestMeasurementHistory = api.get(
      "/api/measurement-histories/" + id,
      {
        headers,
      },
    );
    const requestClothingTypes = api.get("/api/clothing-types", {
      headers,
    });

    const fetchMultipleData = async () => {
      try {
        setLoading(true);
        const [responseMeasurementHistory, responseClothingTypes] =
          await Promise.all([requestMeasurementHistory, requestClothingTypes]);

        const formattedClothingTypeOptions = responseClothingTypes.data.map(
          (item) => ({
            value: item.hashed_id,
            label: item.type,
            measurement_details: item.measurement_details,
          }),
        );
        setClothingTypeOptions(formattedClothingTypeOptions);
        setMeasurementHistory(
          responseMeasurementHistory.data.measurement_history,
        );
        setMeasurementDetails(
          JSON.parse(
            responseMeasurementHistory.data.measurement_history
              .measurement_details,
          ),
        );
        setClient(responseMeasurementHistory.data.measurement_history.client);
        setClientId(
          responseMeasurementHistory.data.measurement_history.client.hashed_id,
        );
        setClothingType(
          responseMeasurementHistory.data.measurement_history.clothing_type,
        );
        setMeasurementsLength(
          JSON.parse(
            responseMeasurementHistory.data.measurement_history
              .measurement_details,
          ).length,
        );
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

    fetchMultipleData();
  }, []);

  useEffect(() => {
    const lastMeasurement = measurementDetails.at(-1);
    if (lastMeasurement.name != "" && lastMeasurement.name != null) {
      const newMeasurement = { name: "", value: 0 };
      setMeasurementDetails((prevMeasurementDetails) => [
        ...prevMeasurementDetails,
        newMeasurement,
      ]);
    }
  }, [measurementDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const measurementHistoryData = new FormData();
    measurementHistoryData.append("client_id", measurementHistory.client_id);
    measurementHistoryData.append("tailor_id", measurementHistory.tailor_id);
    measurementHistoryData.append(
      "clothing_type_id",
      measurementHistory.clothing_type_id,
    );
    measurementHistoryData.append(
      "measured_by",
      measurementHistory.measured_by,
    );
    measurementHistoryData.append(
      "measured_at",
      measurementHistory.measured_at,
    );
    measurementHistoryData.append("notes", measurementHistory.notes);
    measurementHistoryData.append(
      "measurement_details",
      JSON.stringify(measurementHistory.measurement_details),
    );

    try {
      setProcessing(true);
      const response = await api.post(
        `/api/measurement-histories/${id}/edit`,
        measurementHistoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        },
      );
      navigate("/dashboard/clients/" + clientId, {
        state: {
          message: "Edit data riwayat pengukuran berhasil..!!",
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
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingData />;
  }

  return (
    <>
      <div className="w-150">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pengukuran"
            backUrl={"/dashboard/clients/" + clientId}
            getProcessing={processing}
          />
          <div className="flex-all-center mt-4">
            <div>
              <label className="w-44">INFORMASI PELANGGAN</label>
              <div className="flex p-2 border rounded-xl w-full mt-1">
                <div>
                  <div className="flex items-center">
                    <label className="w-44">Nama Pelanggan</label>
                    <label>:</label>
                    <label className="ml-2">{client ? client.name : "-"}</label>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44">Nomor Telepon</label>
                    <label>:</label>
                    <label className="ml-2">
                      {client ? client.phone : "-"}
                    </label>
                  </div>
                  <div className="flex mt-2">
                    <label className="w-44">Alamat</label>
                    <label>:</label>
                    <label className="ml-2 w-96 h-10">
                      {client ? client.address : "-"}
                    </label>
                  </div>
                </div>
              </div>

              <label className="flex w-44 mt-4">DETAIL PENGUKURAN</label>
              <div className="flex p-2 border rounded-xl w-full mt-1">
                <div>
                  <div className="flex items-center">
                    <label className="w-44">Diukur Oleh</label>
                    <label>:</label>
                    <input
                      name="measured_by"
                      defaultValue={measurementHistory.measured_by}
                      onChange={handleChange}
                      type="text"
                      className="ml-2 px-2 w-72"
                      placeholder="Input nama pengukur"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44">Tanggal Ukur</label>
                    <label>:</label>
                    <input
                      name="measured_at"
                      defaultValue={measurementHistory.measured_at}
                      onChange={handleChange}
                      type="date"
                      className="ml-2 px-2"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-44">Pilih Jenis Pakaian</label>
                    <label>:</label>
                    <Select
                      className="w-72 ml-2"
                      value={
                        clothingType
                          ? clothingTypeOptions.find(
                              (opt) => opt.label == clothingType.type,
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleSelectTypeChange(selectedOption)
                      }
                      options={clothingTypeOptions}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center border-b p-1 w-72">
                      <label className="w-44">Bagian yang perlu di ukur</label>
                    </div>
                    {measurementsLength != 0 &&
                      measurementDetails.map((measurement, index) => (
                        <div
                          key={index}
                          className="flex items-center border-b p-1 w-72"
                        >
                          <label className="w-6">{index + 1}. </label>
                          {index >= measurementsLength ? (
                            <input
                              type="text"
                              name="name"
                              onChange={(e) => handleMeasurements(e, index)}
                              className="w-36 px-1"
                              placeholder="Input Tambahan"
                            />
                          ) : (
                            <label className="w-36">{measurement.name}</label>
                          )}
                          <input
                            type="number"
                            name="value"
                            onChange={(e) => handleMeasurements(e, index)}
                            value={measurement.value}
                            className="w-20 px-2 text-center spinner-disabled ml-2"
                          />
                          <label className="flex w-6 ml-2">cm</label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <label className="flex w-32 mt-4">Catatan tambahan :</label>
              <textarea
                name="notes"
                defaultValue={measurementHistory.notes}
                rows={4}
                onChange={handleChange}
                className="w-full mt-1 border rounded-lg px-2"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
