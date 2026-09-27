import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import api from "@/apiService";

import HeaderCreate from "@/components/HeaderCreate";
import LoadingData from "@/components/LoadingData";

export default function Create() {
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const navigate = useNavigate();
  const { customerUlid } = useParams();

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceOptions, setServiceOptions] = useState([]);

  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    service_ulid: "",
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
        const [responseCustomer, responseServices] = await Promise.all([
          api.get(`/api/customers/${customerUlid}`),
          api.get("/api/services"),
        ]);

        const formattedServiceOptions = responseServices.data.data
          .filter((item) => item.category === "tailoring")
          .map((item) => ({
            value: item.ulid,
            label: item.code + " | " + item.name,
            category: item.category,
          }));

        setServiceOptions(formattedServiceOptions);
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

  const handleSelectServiceChange = (selectedOption) => {
    setSelectedService(selectedOption);
    setFormData((prev) => ({
      ...prev,
      service_ulid: selectedOption?.value || "",
      category: selectedOption?.category || "",
    }));
  };

  const handleCategory = (e) => {
    const foundPreset = presetMeasurements.find(
      (preset) => preset.name.toLowerCase() === e.target.value.toLowerCase(),
    );

    if (foundPreset) {
      const formattedMeasurements = foundPreset.items.map((itemName) => ({
        name: itemName,
        value: "",
      }));
      setMeasurementDetails(formattedMeasurements);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors({});
    setErrorMessage("");

    if (!formData.service_ulid) {
      alert("Silakan pilih jenis pakaian terlebih dahulu!");
      return;
    }

    const cleanedDetails = measurementDetails.filter(
      (item) => item.name.trim() !== "",
    );

    if (cleanedDetails.length === 0) {
      alert(
        "Detail ukuran tidak boleh kosong, silahkan pilih katagori dan inpput ukuran terlebih dahulu..!!!",
      );
      return;
    }

    const payload = {
      customer_ulid: customerUlid,
      service_ulid: formData.service_ulid,
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderCreate
          titleCreate="Tambah Data Pengukuran"
          backUrl={`/dashboard/customers/${customerUlid}`}
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          <div className="border-slate-800 bg-slate-900 rounded-xl shadow-sm p-4 space-y-5 border">
            <div>
              <h3 className="text-sm font-semibold bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2.5 rounded-lg border uppercase tracking-wide">
                Informasi Pelanggan
              </h3>
              <div className="mt-3 space-y-2 text-sm text-gray-400 px-1">
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Nama Pelanggan</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium text-gray-100">
                    {customer?.name || "-"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-400">Nomor Telepon</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium text-gray-100">
                    {customer?.phone || "-"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-36 text-slate-400 pt-1">Alamat</span>
                  <span className="mr-2 pt-1">:</span>
                  <span className="font-medium text-gray-100 pt-1 w-80">
                    {customer?.address || "-"} klklkl
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-sm font-semibold bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2.5 rounded-lg border uppercase tracking-wide">
                Informasi Pengukuran
              </h3>
              <div className="mt-3 space-y-3 text-sm px-1">
                <div>
                  <div className="flex items-center">
                    <label className="w-36 text-gray-400">Diukur Oleh</label>
                    <span className="mr-2">:</span>
                    <input
                      name="measured_by"
                      value={formData.measured_by}
                      onChange={handleChange}
                      type="text"
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Masukkan nama pengukur"
                      required
                    />
                  </div>
                  {getErrors?.measured_by && (
                    <span className="text-red-500 text-xs ml-38 mt-1 block">
                      {getErrors.measured_by[0]}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center">
                    <label className="w-36 text-gray-400">Tanggal Ukur</label>
                    <span className="mr-2">:</span>
                    <input
                      name="measured_at"
                      onChange={handleChange}
                      type="date"
                      value={formData.measured_at}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  {getErrors?.measured_at && (
                    <span className="text-red-500 text-xs ml-38 mt-1 block">
                      {getErrors.measured_at[0]}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center">
                    <label className="w-36 text-gray-400">Jenis Pakaian</label>
                    <span className="mr-2">:</span>
                    <div className="flex-1">
                      <Select
                        className="text-sm text-gray-800"
                        classNamePrefix="react-select"
                        placeholder="Pilih jenis pakaian"
                        value={selectedService}
                        onChange={handleSelectServiceChange}
                        options={serviceOptions}
                        isClearable
                        required
                      />
                    </div>
                  </div>
                  {getErrors?.service_ulid && (
                    <span className="text-red-500 text-xs ml-38 mt-1 block">
                      {getErrors.service_ulid[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-sm font-semibold bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2.5 rounded-lg border uppercase tracking-wide">
                Keterangan
              </h3>
              <textarea
                name="notes"
                placeholder="Masukkan keterangan tambahan..."
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {getErrors?.notes && (
                <span className="text-red-500 text-xs mt-1 block">
                  {getErrors.notes[0]}
                </span>
              )}
            </div>
          </div>

          <div className="border-slate-800 bg-slate-900 rounded-xl shadow-sm flex flex-col justify-between p-4 border">
            <div>
              <div className="flex justify-between items-center bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2.5 rounded-lg border">
                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Detail Ukuran
                </span>
              </div>
              <div className="flex-all-center text-sm font-semibold bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2 mt-2 rounded-lg border uppercase tracking-wide">
                <label>Katagori :</label>
                <input
                  type="radio"
                  onClick={handleCategory}
                  name="category"
                  value={"baju"}
                  className="ml-4"
                />
                <span className="ml-2">Baju</span>
                <input
                  type="radio"
                  onClick={handleCategory}
                  name="category"
                  value={"celana"}
                  className="ml-4"
                />
                <span className="ml-2">Celana</span>
                <input
                  type="radio"
                  name="category"
                  onClick={handleCategory}
                  value={"rok"}
                  className="ml-4"
                />
                <span className="ml-2">Rok</span>
              </div>

              <div className="mt-4 space-y-2">
                {measurementDetails?.map((measurement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border-b border-slate-100 pb-2"
                  >
                    <span className="w-6 text-xs text-slate-400 text-center font-medium">
                      {index + 1}.
                    </span>
                    <span className="flex-1 font-medium text-slate-400">
                      {measurement.name}
                    </span>
                    <input
                      type="text"
                      name="value"
                      placeholder="Ukuran"
                      value={measurement.value}
                      onChange={(e) => handleMeasurementsChange(e, index)}
                      className="w-24 px-3 py-1.5 text-center border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-400 w-6">cm</span>
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
        </div>
      </form>
    </div>
  );
}
