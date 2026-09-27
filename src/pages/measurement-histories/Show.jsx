import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import FormattedDateLong from "@/utils/FormattedDateLong";
import LoadingData from "@/components/LoadingData";
import BtnBack from "@/components/BtnBack";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";

export default function Show() {
  const { ulid } = useParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [measurementHistory, setMeasurementHistory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/measurement-histories/${ulid}`);
        setMeasurementHistory(response.data.data);
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
      <div className="max-w-6xl mx-auto p-4 my-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  const customer = measurementHistory?.customer;
  const details = measurementHistory?.measurement_details || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4 text-brand-accent">
        <h1 className="text-xl font-bold tracking-tight">
          Detail Data Pengukuran
        </h1>
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border-slate-800 bg-slate-900 border overflow-hidden shadow-inner rounded-xl p-5 space-y-5">
          <div>
            <h3 className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-sm font-semibold p-2.5 rounded-lg border uppercase tracking-wide">
              Informasi Pelanggan
            </h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600 px-1">
              <div className="flex items-center">
                <span className="w-36 text-slate-400">Nama Pelanggan</span>
                <span className="mr-2">:</span>
                <span className="font-medium text-slate-300">
                  {customer?.name || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-sm font-semibold p-2.5 rounded-lg border uppercase tracking-wide">
              Informasi Pengukuran
            </h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600 px-1">
              <div className="flex items-center">
                <span className="w-36 text-slate-400">Kategori Pakaian</span>
                <span className="mr-2">:</span>
                <span className="font-semibold text-slate-300 uppercase">
                  {measurementHistory?.category || "-"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-36 text-slate-400">Jenis Pakaian</span>
                <span className="mr-2">:</span>
                <span className="font-semibold text-slate-300 uppercase">
                  {measurementHistory?.service?.name || "-"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-36 text-slate-400">Tanggal Ukur</span>
                <span className="mr-2">:</span>
                <span className="font-medium text-slate-300">
                  {measurementHistory?.measured_at
                    ? FormattedDateLong(measurementHistory.measured_at)
                    : "-"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-36 text-slate-400">Diukur Oleh</span>
                <span className="mr-2">:</span>
                <span className="font-medium text-slate-300">
                  {measurementHistory?.measured_by || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-sm font-semibold p-2.5 rounded-lg border uppercase tracking-wide">
              Keterangan
            </h3>
            <div className="text-slate-400 border border-slate-800 text-sm rounded-lg p-3 mt-2 min-h-20">
              {measurementHistory?.notes || "Tidak ada keterangan."}
            </div>
          </div>
        </div>

        <div className="border-slate-800 bg-slate-900 border rounded-xl shadow-sm p-5">
          <h3 className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-sm font-semibold p-2.5 rounded-lg border uppercase tracking-wide">
            Detail Ukuran
          </h3>
          <div className="p-2 divide-y divide-slate-100">
            {details.length > 0 ? (
              details.map((measurement, index) => (
                <div
                  key={index}
                  className="flex items-center py-2.5 px-4 text-sm hover:bg-slate-700 rounded-md transition"
                >
                  <span className="w-8 text-xs text-slate-400 font-medium">
                    {index + 1}.
                  </span>
                  <span className="flex-1 font-medium text-slate-400">
                    {measurement.name}
                  </span>
                  <span className="font-bold w-12 text-center text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                    {measurement.value}
                  </span>
                  <span className="ml-2 text-xs text-slate-400 font-medium">
                    cm
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm py-4 text-center">
                Tidak ada detail ukuran.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
