import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Data penjualan riil (dalam Rupiah)
const data = [
  { bulan: "Jan", "Tahun Ini": 45000000, "Tahun Lalu": 34000000 },
  { bulan: "Feb", "Tahun Ini": 52000000, "Tahun Lalu": 41000000 },
  { bulan: "Mar", "Tahun Ini": 61000000, "Tahun Lalu": 52000000 },
  { bulan: "Apr", "Tahun Ini": 58000000, "Tahun Lalu": 63000000 }, // Contoh penurunan
  { bulan: "Mei", "Tahun Ini": 71000000, "Tahun Lalu": 59000000 },
  { bulan: "Jun", "Tahun Ini": 80000000, "Tahun Lalu": 68000000 },
  { bulan: "Jul", "Tahun Ini": 75000000, "Tahun Lalu": 72000000 },
  { bulan: "Agu", "Tahun Ini": 82000000, "Tahun Lalu": 75000000 },
  { bulan: "Sep", "Tahun Ini": 89000000, "Tahun Lalu": 81000000 },
  { bulan: "Okt", "Tahun Ini": 94000000, "Tahun Lalu": 85000000 },
  { bulan: "Nov", "Tahun Ini": 105000000, "Tahun Lalu": 92000000 },
  { bulan: "Des", "Tahun Ini": 120000000, "Tahun Lalu": 100000000 },
];
const fullMonth = {
  Jan: "Januari",
  Feb: "Februari",
  Mar: "Maret",
  Apr: "April",
  Mei: "Mei",
  Jun: "Juni",
  Jul: "Juli",
  Agu: "Agustus",
  Sep: "September",
  Okt: "Oktobeer",
  Nov: "November",
  Des: "Desember",
};

// FORMATTER UTILITAS
const formatRupiahLengkap = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatRupiahRingkas = (value) => {
  if (value >= 1000000000)
    return `${(value / 1000000000).toFixed(1).replace(".0", "")} M`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)} Jt`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)} Rb`;
  return value;
};

// 1. KOMPONEN CUSTOM TOOLTIP (HOVER BOX)
const CustomHoverTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Mengambil nilai data berdasarkan Key 'name' di Recharts
    const dataTahunIni =
      payload.find((p) => p.name === "Tahun Ini")?.value || 0;
    const dataTahunLalu =
      payload.find((p) => p.name === "Tahun Lalu")?.value || 0;

    // Logika perhitungan pertumbuhan (%)
    const selisih = dataTahunIni - dataTahunLalu;
    const persentaseGrowth =
      dataTahunLalu > 0 ? (selisih / dataTahunLalu) * 100 : 0;
    const isPositive = selisih >= 0;
    const bulanPanjang = fullMonth[label] || label;

    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 p-4 rounded-xl shadow-xl min-w-60">
        {/* Nama Bulan */}
        <p className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2">
          Bulan {bulanPanjang}
        </p>

        {/* Detail Data Penjualan */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              Tahun Ini:
            </span>
            <span className="font-bold text-gray-900">
              {formatRupiahLengkap(dataTahunIni)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
              Tahun Lalu:
            </span>
            <span className="font-semibold text-gray-700">
              {formatRupiahLengkap(dataTahunLalu)}
            </span>
          </div>

          {/* Baris Pertumbuhan (Growth %) */}
          <div className="pt-2 mt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
            <span className="text-gray-500 font-medium">Pertumbuhan:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 ${
                isPositive
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span>{isPositive ? "▲" : "▼"}</span>
              <span>{Math.abs(persentaseGrowth).toFixed(1)}%</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// 2. KOMPONEN UTAMA GRAFIK
export default function SalesComparisonChart() {
  return (
    <div className="w-full max-w-4xl p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Performa Pesanan Bulanan
        </h3>
        <p className="text-sm text-gray-500">
          Arahkan kursor untuk melihat persentase pertumbuhan bulanan
        </p>
      </div>

      <div className="w-full h-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            barGap={10}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />

            <XAxis
              dataKey="bulan"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#9ca3af"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#9ca3af"
              tickFormatter={formatRupiahRingkas}
              width={50}
            />

            {/* Memasukkan Custom Tooltip yang telah dibuat di atas */}
            <Tooltip
              content={<CustomHoverTooltip />}
              cursor={{ fill: "#f8fafc", opacity: 0.6 }} // Mengubah warna background highlight kolom saat hover
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "13px", paddingBottom: "10px" }}
            />

            {/* Batang Tahun Lalu */}
            <Bar
              dataKey="Tahun Lalu"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />

            {/* Batang Tahun Ini */}
            <Bar
              dataKey="Tahun Ini"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
              className="cursor-pointer hover:fill-blue-600 transition-colors duration-200"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
