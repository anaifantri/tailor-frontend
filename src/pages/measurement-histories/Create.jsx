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
  const { customerUlid } = useParams();
  const { token } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [selectedClothingType, setSelectedClothingType] = useState(null);
  const [clothingTypeOptions, setClothingTypeOptions] = useState([]);

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    clothing_type_ulid: "",
    measured_by: "",
    measured_at: today,
    notes: "",
  });

  const presetMeasurements = [
    {
      name: "rok",
      items: ["Panjang Rok", "Lingkar Pinggang", "Lingkar Pinggul"],
    },
    {
      name: "celana",
      items: [
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
      items: [
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [responseCustomer, responseClothingTypes] = await Promise.all([
          api.get(`/api/customers/${customerUlid}`),
          api.get("/api/clothing-types"),
        ]);

        // Parsing options dari API clothing-types
        const formattedClothingTypeOptions =
          responseClothingTypes.data.data.map((item) => ({
            value: item.ulid,
            label: item.type || item.name,
            category: item.category,
          }));

        setClothingTypeOptions(formattedClothingTypeOptions);
        setCustomer(
          responseCustomer.data.data || responseCustomer.data.customer,
        );
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Gagal mengambil data awal.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerUlid]);

  const handleSelectTypeChange = (selectedOption) => {
    setSelectedClothingType(selectedOption);
    setFormData((prev) => ({
      ...prev,
      clothing_type_ulid: selectedOption.value,
      category: selectedOption.category,
    }));

    const preset = presetMeasurements.find(
      (m) => m.name.toLowerCase() === selectedOption.category?.toLowerCase(),
    );

    const initialDetails = preset
      ? preset.items.map((item) => ({ name: item, value: "" }))
      : [];

    // Sisakan 1 slot kosong tambahan di akhir untuk entri manual
    setMeasurementDetails([...initialDetails, { name: "", value: "" }]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMeasurementsChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDetails = [...measurementDetails];
    updatedDetails[index][name] = value;
    setMeasurementDetails(updatedDetails);
  };

  const removeMeasurementDetail = (indexToRemove) => {
    if (measurementDetails.length <= 1) {
      alert("Minimal harus ada 1 bagian yang diukur");
      return;
    }
    setMeasurementDetails((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const addEmptyMeasurementRow = () => {
    setMeasurementDetails((prev) => [...prev, { name: "", value: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    if (!formData.clothing_type_ulid) {
      alert("Silakan pilih jenis pakaian terlebih dahulu!");
      return;
    }

    // Filter baris detail yang nama pengukurannya terisi
    const cleanedDetails = measurementDetails.filter(
      (item) => item.name.trim() !== "",
    );

    if (cleanedDetails.length === 0) {
      alert("Detail ukuran tidak boleh kosong!");
      return;
    }

    const payload = {
      customer_ulid: customerUlid,
      clothing_type_ulid: formData.clothing_type_ulid,
      category: formData.category,
      measured_by: formData.measured_by,
      measured_at: formData.measured_at,
      notes: formData.notes,
      measurement_details: cleanedDetails,
    };

    try {
      setProcessing(true);
      await api.post("/api/measurement-histories", payload);

      navigate(`/dashboard/customers/${customerUlid}`, {
        state: { message: "Penambahan data riwayat pengukuran berhasil!" },
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
      } else {
        setErrorMessage(
          err.response?.data?.message || "Terjadi kesalahan pada server.",
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingData />;

  return (
    <div className="w-300">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Data Pengukuran"
          backUrl={`/customers/${customerUlid}`}
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 my-2 text-sm text-red-700 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Sisi Kiri: Informasi Pelanggan & Pengukuran */}
          <div className="divide-y divide-gray-200 p-4 border border-gray-200 shadow-lg rounded-xl w-full mt-1">
            <label className="flex font-semibold w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
              INFORMASI PELANGGAN
            </label>
            <div className="flex items-center p-2">
              <label className="w-40">Nama Pelanggan</label>
              <label>:</label>
              <label className="ml-2 font-semibold">
                {customer?.name || "-"}
              </label>
            </div>
            <div className="flex items-center p-2">
              <label className="w-40">Nomor Telepon</label>
              <label>:</label>
              <label className="ml-2">{customer?.phone || "-"}</label>
            </div>
            <div className="flex p-2">
              <label className="w-40">Alamat</label>
              <label>:</label>
              <textarea
                className="ml-2 w-96 border rounded-sm border-gray-200 p-1 font-semibold text-sm bg-gray-50"
                rows={3}
                readOnly
                value={customer?.address || "-"}
              />
            </div>

            <label className="flex font-semibold w-full p-2 mt-4 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
              INFORMASI PENGUKURAN
            </label>
            <div className="p-2">
              <div className="flex items-center">
                <label className="w-40">Diukur Oleh</label>
                <label>:</label>
                <input
                  name="measured_by"
                  value={formData.measured_by}
                  onChange={handleChange}
                  type="text"
                  className="ml-2 px-2 border rounded-md h-8 text-sm w-80"
                  placeholder="Masukkan nama pengukur"
                  required
                />
              </div>
              {getErrors?.measured_by && (
                <span className="text-red-500 text-xs ml-42 mt-1 block">
                  {getErrors.measured_by[0]}
                </span>
              )}
            </div>

            <div className="p-2">
              <div className="flex items-center">
                <label className="w-40">Tanggal Ukur</label>
                <label>:</label>
                <input
                  name="measured_at"
                  onChange={handleChange}
                  type="date"
                  value={formData.measured_at}
                  className="ml-2 px-2 border rounded-md h-8 text-sm"
                  required
                />
              </div>
              {getErrors?.measured_at && (
                <span className="text-red-500 text-xs ml-42 mt-1 block">
                  {getErrors.measured_at[0]}
                </span>
              )}
            </div>

            <div className="p-2">
              <div className="flex items-center">
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
                  onChange={handleSelectTypeChange}
                  options={clothingTypeOptions}
                  required
                />
              </div>
              {getErrors?.clothing_type_ulid && (
                <span className="text-red-500 text-xs ml-42 mt-1 block">
                  {getErrors.clothing_type_ulid[0]}
                </span>
              )}
            </div>

            <label className="flex font-semibold mt-4 p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
              Keterangan
            </label>
            <textarea
              name="notes"
              placeholder="Masukkan keterangan tambahan"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-sm border-gray-200 p-1 font-semibold text-sm bg-gray-50 mt-2"
            />
            {getErrors?.notes && (
              <span className="text-red-500 text-xs mt-1 block">
                {getErrors.notes[0]}
              </span>
            )}
          </div>

          {/* Sisi Kanan: Detail Ukuran */}
          <div className="p-4 border border-gray-200 shadow-lg rounded-xl w-full">
            <div className="flex justify-between items-center font-semibold w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
              <span>Detail Ukuran</span>
              <button
                type="button"
                onClick={addEmptyMeasurementRow}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                + Tambah Baris
              </button>
            </div>

            <div className="mt-4 text-sm">
              {measurementDetails?.map((measurement, index) => (
                <div
                  key={index}
                  className="flex items-center border-b p-1 w-full"
                >
                  <label className="w-6">{index + 1}.</label>
                  <input
                    type="text"
                    name="name"
                    value={measurement.name}
                    onChange={(e) => handleMeasurementsChange(e, index)}
                    className="w-56 px-2 border rounded-md h-8"
                    placeholder="Nama bagian (cth: Panjang Rok)"
                  />
                  <input
                    type="text"
                    name="value"
                    placeholder="Ukuran"
                    onChange={(e) => handleMeasurementsChange(e, index)}
                    value={measurement.value}
                    className="w-28 px-2 ml-2 text-center border rounded-md h-8"
                  />
                  <label className="w-6 ml-2">cm</label>
                  <button
                    title="Hapus"
                    type="button"
                    onClick={() => removeMeasurementDetail(index)}
                    className="button-danger ml-auto cursor-pointer p-1"
                  >
                    <Svg title="Delete" c={"w-5 fill-current"}>
                      <DeleteSvg />
                    </Svg>
                  </button>
                </div>
              ))}
            </div>
            {getErrors?.measurement_details && (
              <span className="text-red-500 text-xs mt-2 block">
                {getErrors.measurement_details[0]}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
