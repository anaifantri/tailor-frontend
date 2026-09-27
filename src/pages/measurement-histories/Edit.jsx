import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "@/apiService";

import HeaderEdit from "@/components/HeaderEdit";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const navigate = useNavigate();
  const { ulid } = useParams();

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [customer, setCustomer] = useState(null);
  const [service, setService] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);

  const [formData, setFormData] = useState({
    customer_ulid: "",
    service_ulid: "",
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
          service_ulid: data.service?.ulid || "",
          category: data.category || "",
          measured_by: data.measured_by || "",
          measured_at: data.measured_at || "",
          notes: data.notes || "",
        });

        setCustomer(data.customer);
        setService(data.service);
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit}>
        <HeaderEdit
          titleEdit="Edit Data Pengukuran"
          backUrl={`/dashboard/customers/${customer?.ulid}`}
          getProcessing={processing}
        />

        {errorMessage && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="border-slate-800 bg-slate-900 rounded-xl shadow-sm p-5 space-y-5">
            <div>
              <h3 className="bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2.5 rounded-lg border uppercase tracking-wide">
                Informasi Pelanggan
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600 px-1">
                <div className="flex items-center">
                  <span className="w-36 text-slate-500">Nama Pelanggan</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium text-gray-100">
                    {customer?.name || "-"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-500">Nomor Telepon</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium text-gray-100">
                    {customer?.phone || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2.5 rounded-lg border uppercase tracking-wide">
                Informasi Pengukuran
              </h3>
              <div className="mt-3 space-y-3 text-sm px-1">
                <div className="flex items-center">
                  <span className="w-36 text-slate-500">Kategori Pakaian</span>
                  <span className="mr-2">:</span>
                  <span className="font-semibold text-gray-100 uppercase">
                    {formData.category || "-"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-36 text-slate-500">Jenis Pakaian</span>
                  <span className="mr-2">:</span>
                  <span className="font-semibold text-gray-100 uppercase">
                    {service?.name || "-"}
                  </span>
                </div>

                <div>
                  <div className="flex items-center">
                    <label className="w-36 text-slate-600">Diukur Oleh</label>
                    <span className="mr-2">:</span>
                    <input
                      name="measured_by"
                      value={formData.measured_by}
                      onChange={handleChange}
                      type="text"
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nama pengukur"
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
                    <label className="w-36 text-slate-600">Tanggal Ukur</label>
                    <span className="mr-2">:</span>
                    <input
                      name="measured_at"
                      value={formData.measured_at}
                      onChange={handleChange}
                      type="date"
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
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="bg-slate-950/80 text-slate-300 border-b border-slate-800 p-2.5 rounded-lg border uppercase tracking-wide">
                Keterangan
              </h3>
              <textarea
                name="notes"
                placeholder="Masukkan keterangan tambahan..."
                value={formData.notes}
                rows={3}
                onChange={handleChange}
                className="w-full border border-slate-800 text-sm rounded-lg p-2.5 bg-gray-100 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {getErrors?.notes && (
                <span className="text-red-500 text-xs mt-1 block">
                  {getErrors.notes[0]}
                </span>
              )}
            </div>
          </div>

          <div className="border-slate-800 bg-slate-900 rounded-xl shadow-sm p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center p-2.5 rounded-lg border bg-slate-950/80 text-slate-300 border-b border-slate-800">
                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Detail Ukuran
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {measurementDetails?.map((measurement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border-b border-slate-100 pb-2"
                  >
                    <span className="w-6 text-xs text-slate-300 text-center font-medium">
                      {index + 1}.
                    </span>
                    <span className="flex-1 font-medium text-slate-400">
                      {measurement.name}
                    </span>
                    <input
                      type="text"
                      name="value"
                      placeholder="Ukuran"
                      onChange={(e) => handleMeasurementsChange(e, index)}
                      value={measurement.value}
                      className="w-24 px-3 py-1.5 text-center border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-slate-500 w-6">cm</span>
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
