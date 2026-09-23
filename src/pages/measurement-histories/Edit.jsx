import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "@/apiService";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/Components/LoadingData";
import Svg from "@/components/Svg";
import DeleteSvg from "@/Assets/Svg/DeleteSvg";

export default function Edit() {
  const navigate = useNavigate();
  const { ulid } = useParams();

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [customer, setCustomer] = useState(null);
  const [clothingType, setClothingType] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);

  const [formData, setFormData] = useState({
    customer_ulid: "",
    clothing_type_ulid: "",
    category: "",
    measured_by: "",
    measured_at: "",
    notes: "",
  });

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/measurement-histories/${ulid}`);
        const data = response.data.data;

        setFormData({
          customer_ulid: data.customer?.ulid || "",
          clothing_type_ulid: data.clothing_type?.ulid || "",
          category: data.category || "",
          measured_by: data.measured_by || "",
          measured_at: data.measured_at || "",
          notes: data.notes || "",
        });

        setCustomer(data.customer);
        setClothingType(data.clothing_type);
        setMeasurementDetails(
          Array.isArray(data.measurement_details)
            ? data.measurement_details
            : [],
        );
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || "Gagal memuat data ukuran.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ulid]);

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

    const cleanedDetails = measurementDetails.filter(
      (item) => item.name.trim() !== "",
    );

    const payload = {
      ...formData,
      measurement_details: cleanedDetails,
    };

    try {
      setProcessing(true);
      // REST API standar Laravel: PUT/PATCH JSON ke /api/measurement-histories/{ulid}
      await api.put(`/api/measurement-histories/${ulid}`, payload);

      navigate(`/dashboard/customers/${customer?.ulid}`, {
        state: { message: "Pembaruan data riwayat pengukuran berhasil!" },
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setGetErrors(err.response.data.errors || {});
      } else {
        setErrorMessage(
          err.response?.data?.message ||
            "Terjadi kesalahan saat memperbarui data.",
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
        <HeaderEdit
          titleEdit="Edit Data Pengukuran"
          backUrl={`/customers/${customer?.ulid}`}
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="p-3 my-2 text-sm text-red-700 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
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

            <label className="flex font-semibold w-full p-2 mt-4 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
              INFORMASI PENGUKURAN
            </label>
            <div className="flex items-center p-2">
              <label className="w-40">Kategori Pakaian</label>
              <label>:</label>
              <label className="ml-2 font-semibold uppercase">
                {formData.category || "-"}
              </label>
            </div>
            <div className="flex items-center p-2">
              <label className="w-40">Jenis Pakaian</label>
              <label>:</label>
              <label className="ml-2 font-semibold uppercase">
                {clothingType?.type || "-"}
              </label>
            </div>

            <div className="p-2">
              <div className="flex items-center">
                <label className="w-40">Diukur Oleh</label>
                <label>:</label>
                <input
                  name="measured_by"
                  value={formData.measured_by}
                  onChange={handleChange}
                  type="text"
                  className="ml-2 px-2 border rounded-md h-8 text-sm w-72"
                  placeholder="Nama pengukur"
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
                  value={formData.measured_at}
                  onChange={handleChange}
                  type="date"
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

            <label className="flex font-semibold mt-4 p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
              Keterangan
            </label>
            <textarea
              name="notes"
              placeholder="Masukkan keterangan tambahan"
              value={formData.notes}
              rows={4}
              onChange={handleChange}
              className="w-full border rounded-sm border-gray-200 p-1 font-semibold text-sm bg-gray-50 mt-2"
            />
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
                    placeholder="Nama bagian"
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
          </div>
        </div>
      </form>
    </div>
  );
}
