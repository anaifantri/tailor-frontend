import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "@/apiService";

import FormattedDateLong from "@/utils/FormattedDateLong";
import LoadingData from "@/Components/LoadingData";
import BtnBack from "@/components/BtnBack";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";

export default function Show() {
  const { ulid } = useParams();
  const [loading, setLoading] = useState(true);
  const [measurementHistory, setMeasurementHistory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/measurement-histories/${ulid}`);
        // Backend mengembalikan object bertingkat data
        setMeasurementHistory(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Data ukuran tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ulid]);

  if (loading) return <LoadingData />;

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">{error}</div>
    );
  }

  const customer = measurementHistory?.customer;
  const clothingType = measurementHistory?.clothing_type;
  const details = measurementHistory?.measurement_details || [];

  return (
    <div className="w-300">
      <div className="grid grid-cols-2 gap-2 w-full border-b pb-2">
        <div className="flex w-full font-semibold text-lg items-center">
          Detail Data Pengukuran
        </div>
        <div className="flex justify-end w-full gap-2">
          <BtnBack backUrl={`/dashboard/customers/${customer?.ulid}`} />
          <BtnEdit
            editUrl={`/dashboard/customers/measurement-histories/edit/${ulid}`}
          />
          <BtnDelete
            deleteUrl="/api/measurement-histories"
            deleteId={ulid}
            getToken={token}
            returnUrl={`/dashboard/customers/${customer?.ulid}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Sisi Kiri: Informasi Pelanggan dan Pengukuran */}
        <div className="p-4 border border-gray-200 shadow-lg rounded-xl w-full">
          <div className="divide-y divide-gray-200">
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
                {measurementHistory?.category || "-"}
              </label>
            </div>
            <div className="flex items-center p-2">
              <label className="w-40">Jenis Pakaian</label>
              <label>:</label>
              <label className="ml-2 font-semibold uppercase">
                {clothingType?.type || "-"}
              </label>
            </div>
            <div className="flex items-center p-2">
              <label className="w-40">Tanggal Ukur</label>
              <label>:</label>
              <label className="ml-2 font-semibold">
                {measurementHistory?.measured_at
                  ? FormattedDateLong(measurementHistory.measured_at)
                  : "-"}
              </label>
            </div>
            <div className="flex items-center p-2">
              <label className="w-40">Diukur Oleh</label>
              <label>:</label>
              <label className="ml-2 font-semibold">
                {measurementHistory?.measured_by || "-"}
              </label>
            </div>

            <label className="flex font-semibold mt-4 p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
              Keterangan
            </label>
            <div className="border border-gray-200 shadow-inner rounded-md w-full min-h-16 px-2 py-1 mt-2 bg-gray-50 text-sm">
              {measurementHistory?.notes || "Tidak ada keterangan."}
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Detail Ukuran */}
        <div className="p-4 border border-gray-200 shadow-lg rounded-xl w-full">
          <div className="flex font-semibold w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-sm">
            <label className="w-40">Detail Ukuran</label>
          </div>
          <div className="mt-2 divide-y divide-gray-100">
            {details.map((measurement, index) => (
              <div key={index} className="flex items-center py-2 px-1 text-sm">
                <span className="w-6 text-gray-500">{index + 1}.</span>
                <span className="w-48 font-medium">{measurement.name}</span>
                <span className="mr-2">:</span>
                <span className="font-semibold text-blue-700">
                  {measurement.value}
                </span>
                <span className="ml-1 text-gray-500">cm</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
