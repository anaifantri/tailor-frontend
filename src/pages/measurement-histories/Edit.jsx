import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/Components/LoadingData";
import Svg from "@/components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function Create() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [measurementHistory, setMeasurementHistory] = useState(null);

  const errorRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);
  const measurements = [
    {
      name: "rok",
      measurements: ["Panjang Rok", "Lingkar Pinggang", "Lingkar Pinggul"],
    },
    {
      name: "celana",
      measurements: [
        "Panjang Celana",
        "Lingkar Pinggang",
        "Lingkar Pinggul",
        "Pesak",
        "Paha",
        "Lutut",
        "Kaki",
      ],
    },
    {
      name: "baju",
      measurements: [
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
      ],
    },
  ];

  const removeMeasurementDetails = (indexToRemove) => {
    if (measurementDetails.length == 1) {
      alert("Minimal harus ada 1 bagian yang di ukur");
    } else {
      const updatedMeasurements = measurementDetails.filter(
        (_, indexArray) => indexArray !== indexToRemove,
      );
      setMeasurementDetails(updatedMeasurements);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurementHistory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "category") {
      const getMeasurements = measurements.find(
        (measurement) => measurement.name === value,
      );
      const formattedMeasurementDetails = getMeasurements?.measurements.map(
        (item) => ({
          name: item,
          value: "",
        }),
      );
      const newDetails = { name: "", value: "" };
      formattedMeasurementDetails.push(newDetails);
      setMeasurementDetails(formattedMeasurementDetails);
    }
  };

  const handleMeasurements = (e, index) => {
    const { name, value } = e.target;
    if (
      index !== measurementDetails.length - 1 &&
      name == "name" &&
      value === ""
    ) {
      const updatedMeasurements = measurementDetails.filter(
        (_, indexArray) => indexArray !== index,
      );
      setMeasurementDetails(updatedMeasurements);
    } else {
      const newMeasurementDetails = [...measurementDetails];
      newMeasurementDetails[index][name] = value;
      setMeasurementDetails(newMeasurementDetails);
      setMeasurementHistory((prevData) => ({
        ...prevData,
        ["measurement_details"]: JSON.stringify(newMeasurementDetails),
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/measurement-histories/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.measurement_history);
        setMeasurementHistory(response.data.measurement_history);
        setMeasurementDetails(
          JSON.parse(response.data.measurement_history.measurement_details),
        );
        setCustomer(response.data.measurement_history.customer);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lastMeasurement = measurementDetails.at(-1);
    if (lastMeasurement?.name != "" && lastMeasurement?.name != null) {
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

    const formData = new FormData();
    formData.append("customer_id", measurementHistory.customer_id);
    formData.append("clothing_type_id", measurementHistory.clothing_type_id);
    formData.append("category", measurementHistory.category);
    formData.append("measured_by", measurementHistory.measured_by);
    formData.append("measured_at", measurementHistory.measured_at);
    formData.append("notes", measurementHistory.notes);
    formData.append(
      "measurement_details",
      measurementHistory.measurement_details,
    );
    console.log(measurementHistory);

    try {
      setProcessing(true);
      const response = await api.post(
        `/api/measurement-histories/${id}/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        },
      );
      navigate("/dashboard/customers/" + customer.hashed_id, {
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
      <div className="w-300">
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Pengukuran"
            backUrl={"/dashboard/customers/" + customer?.hashed_id}
            getProcessing={processing}
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="divide-y divide-gray-200 p-4 border border-gray-200 shadow-lg rounded-xl w-full mt-1">
              <label className="flex font-semibold w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                INFORMASI PELANGGAN
              </label>
              <div className="flex items-center p-2">
                <label className="w-40">Nama Pelanggan</label>
                <label>:</label>
                <label className="ml-2">{customer ? customer.name : "-"}</label>
              </div>
              <div className="flex items-center p-2">
                <label className="w-40">Nomor Telepon</label>
                <label>:</label>
                <label className="ml-2">
                  {customer ? customer.phone : "-"}
                </label>
              </div>
              <div className="p-2">
                <label className="w-40">Alamat</label>
                <textarea
                  className="w-full border rounded-sm border-gray-200 p-1 font-semibold text-sm bg-gray-50 mt-2"
                  rows={3}
                  readOnly
                  defaultValue={customer ? customer.address : "-"}
                ></textarea>
              </div>
              <label className="flex font-semibold w-full p-2 mt-4 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                INFORMASI PENGUKURAN
              </label>
              <div className="flex items-center p-2">
                <label className="w-40">Katagori Pakaian</label>
                <label>:</label>
                <label className="ml-2 font-semibold uppercase">
                  {measurementHistory?.category}
                </label>
              </div>
              <div className="flex items-center p-2">
                <label className="w-40">Jenis Pakaian</label>
                <label>:</label>
                <label className="ml-2 font-semibold uppercase">
                  {measurementHistory?.clothing_type.type}
                </label>
              </div>
              <div className="flex items-center p-2">
                <label className="w-40">Diukur Oleh</label>
                <label>:</label>
                <input
                  name="measured_by"
                  defaultValue={measurementHistory.measured_by}
                  onChange={handleChange}
                  type="text"
                  className="ml-2 px-2 w-72"
                  placeholder="Input nama pengukur"
                  required
                />
              </div>
              {getErrors?.measured_by && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-sm items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.measured_by}
                </span>
              )}
              <div className="flex items-center p-2">
                <label className="w-40">Tanggal Ukur</label>
                <label>:</label>
                <input
                  name="measured_at"
                  defaultValue={measurementHistory.measured_at}
                  onChange={handleChange}
                  type="date"
                  className="ml-2 px-2"
                  required
                />
              </div>
              {getErrors?.measured_at && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-sm items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.measured_at}
                </span>
              )}
              <label className="flex font-semibold mt-4 p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                Keterangan
              </label>
              <textarea
                name="notes"
                placeholder="Masukkan keterangan tambahan"
                defaultValue={measurementHistory.notes}
                rows={4}
                onChange={handleChange}
                className="ml-2 w-140 border rounded-sm border-gray-200 p-1 font-semibold text-sm bg-gray-50 mt-2"
              ></textarea>
              {getErrors?.notes && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-sm items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.notes}
                </span>
              )}
            </div>

            <div className="divide-y divide-gray-200 p-4 border border-gray-200 shadow-lg rounded-xl w-full">
              <div className="flex font-semibold w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                <label className="w-40">Detail Ukuran</label>
              </div>
              {/* <div className="flex items-center mt-2">
                <label className="w-40">Pilih Jenis Pakaian</label>
                <label>:</label>
                <input
                  className="ml-2"
                  type="radio"
                  name="category"
                  value={"baju"}
                  onClick={handleChange}
                  defaultChecked={
                    measurementHistory.category == "baju" ? true : false
                  }
                  required
                />
                <label className="ml-1">BAJU</label>
                <input
                  className="ml-4"
                  type="radio"
                  name="category"
                  value={"celana"}
                  defaultChecked={
                    measurementHistory.category == "celana" ? true : false
                  }
                  onClick={handleChange}
                  required
                />
                <label className="ml-1">CELANA</label>
                <input
                  className="ml-4"
                  type="radio"
                  name="category"
                  value={"rok"}
                  defaultChecked={
                    measurementHistory.category == "rok" ? true : false
                  }
                  onClick={handleChange}
                  required
                />
                <label className="ml-1">ROK</label>
              </div>
              {getErrors?.category && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-sm items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.category}
                </span>
              )} */}
              <div className="mt-4">
                <div className="flex items-center border-b p-1 w-72">
                  <label className="w-40">Bagian yang perlu di ukur</label>
                </div>
                {measurementDetails?.map((measurement, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b p-1 w-140"
                  >
                    <label className="w-6">{index + 1}. </label>
                    <input
                      type="text"
                      name="name"
                      value={measurement.name}
                      onChange={(e) => handleMeasurements(e, index)}
                      className="w-64 px-2"
                      placeholder="Masukkan bagian yang diukur"
                    />
                    <input
                      type="text"
                      name="value"
                      placeholder="Masukkan ukuran"
                      onChange={(e) => handleMeasurements(e, index)}
                      value={measurement.value}
                      className="w-40 px-2 ml-2 text-center"
                    />
                    <label className="flex w-6 ml-2">cm</label>
                    {index != measurementDetails.length - 1 && (
                      <button
                        title="Hapus"
                        type="button"
                        onClick={() => removeMeasurementDetails(index)}
                        className="flex-all-center button-danger cursor-pointer ml-4"
                      >
                        <Svg title="Delete" c={"w-5 fill-current mx-1"}>
                          <DeleteSvg />
                        </Svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {getErrors?.measurement_details && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-sm items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.measurement_details}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
