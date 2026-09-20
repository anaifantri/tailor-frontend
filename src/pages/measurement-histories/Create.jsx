import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";

import api from "@/apiService";

import HeaderCreate from "@/components/HeaderCreate";
import LoadingData from "@/Components/LoadingData";
import Svg from "@/components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function Create() {
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [selectedClothingType, setSelectedClothingType] = useState(null);
  const [clothingTypeOptions, setClothingTypeOptions] = useState([]);

  const errorRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    clothing_type_id: "",
    measured_by: "",
    measured_at: today,
    notes: "",
  });

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

  const handleSelectTypeChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      clothing_type_id: selectedOption.value,
      category: selectedOption.category,
    }));
    setSelectedClothingType(selectedOption);

    const getMeasurements = measurements.find(
      (measurement) => measurement.name === selectedOption.category,
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
  };

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // if (name == "category") {
    //   const getMeasurements = measurements.find(
    //     (measurement) => measurement.name === value,
    //   );
    //   const formattedMeasurementDetails = getMeasurements?.measurements.map(
    //     (item) => ({
    //       name: item,
    //       value: "",
    //     }),
    //   );
    //   const newDetails = { name: "", value: "" };
    //   formattedMeasurementDetails.push(newDetails);
    //   setMeasurementDetails(formattedMeasurementDetails);
    // }
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
      setFormData((prevData) => ({
        ...prevData,
        ["measurement_details"]: newMeasurementDetails,
      }));
    }
  };

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "mulipart/form-data",
    };
    const requestCustomers = api.get("/api/customers/" + id, {
      headers,
    });
    const requestClothingTypes = api.get("/api/clothing-types", {
      headers,
    });

    const fetchMultipleData = async () => {
      try {
        setLoading(true);
        const [responseCustomers, responseClothingTypes] = await Promise.all([
          requestCustomers,
          requestClothingTypes,
        ]);

        const formattedClothingTypeOptions =
          responseClothingTypes.data.data.map((item) => ({
            value: item.hashed_id,
            label: item.type,
            category: item.category,
          }));
        setClothingTypeOptions(formattedClothingTypeOptions);
        setCustomer(responseCustomers.data.customer);
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

    if (formData.category == "") {
      alert("Silahkan pilih katagori pakaian terlebih dahulu...!!!");
    } else if (
      measurementDetails.length <= 1 &&
      measurementDetails[0].name == ""
    ) {
      alert("Bagian yang diukur tidak boleh kosong...!!!");
    } else {
      const measurementHistory = new FormData();
      measurementHistory.append("customer_id", customer.hashed_id);
      measurementHistory.append("clothing_type_id", formData.clothing_type_id);
      measurementHistory.append("category", formData.category);
      measurementHistory.append("measured_by", formData.measured_by);
      measurementHistory.append("measured_at", formData.measured_at);
      measurementHistory.append("notes", formData.notes);
      measurementHistory.append(
        "measurement_details",
        JSON.stringify(measurementDetails),
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
        navigate("/dashboard/customers/" + id, {
          state: {
            message: "Penambahan data riwayat pengukuran berhasil..!!",
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
    }
  };

  if (loading) {
    return <LoadingData />;
  }

  return (
    <>
      <div className="w-300">
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data Pengukuran"
            backUrl={"/dashboard/customers/" + id}
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
              <div className="flex p-2">
                <label className="w-40">Alamat</label>
                <label>:</label>
                <textarea
                  className="ml-2 w-96 border rounded-sm border-gray-200 p-1 font-semibold text-sm bg-gray-50"
                  rows={3}
                  readOnly
                  defaultValue={customer ? customer.address : "-"}
                ></textarea>
              </div>
              <label className="flex font-semibold w-full p-2 mt-4 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                INFORMASI PENGUKURAN
              </label>
              <div className="flex items-center p-2">
                <label className="w-40">Diukur Oleh</label>
                <label>:</label>
                <input
                  name="measured_by"
                  onChange={handleChange}
                  type="text"
                  className="ml-2 px-2 text-sm w-80"
                  placeholder="Masukkan nama pengukur"
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
                  onChange={handleChange}
                  type="date"
                  value={formData.measured_at}
                  className="ml-2 px-2 text-sm"
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
              <div className="flex items-center p-2">
                <label className="w-40">Pilih Jenis Pakaian</label>
                <label>:</label>
                <Select
                  classNames={{
                    control: () =>
                      "!h-8 !min-h-8 bg-white border border-gray-300 rounded-md ml-2 w-80",
                    valueContainer: () => "!h-8 flex items-center",
                    indicatorsContainer: () => "!h-8",
                  }}
                  placeholder="Pilih jenis pakaian"
                  value={selectedClothingType}
                  onChange={(selectedOption) =>
                    handleSelectTypeChange(selectedOption)
                  }
                  options={clothingTypeOptions}
                  required
                />
                {/* <input
                  className="ml-2"
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
                <label className="ml-1">ROK</label> */}
              </div>
              {getErrors?.clothing_type_id && (
                <span
                  ref={errorRef}
                  className={
                    getErrors
                      ? "flex w-full text-red-500 text-sm items-center"
                      : "hidden"
                  }
                >
                  {getErrors?.clothing_type_id}
                </span>
              )}
              <label className="flex font-semibold mt-4 p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
                Keterangan
              </label>
              <textarea
                name="notes"
                placeholder="Masukkan keterangan tambahan"
                rows={4}
                onChange={handleChange}
                className="w-full border rounded-sm border-gray-200 p-1 font-semibold text-sm bg-gray-50 mt-2"
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
              <div className="mt-4 text-sm">
                <div className="flex items-center border-b p-1 w-140">
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
                      placeholder="Masukkan ukuran"
                      name="value"
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
