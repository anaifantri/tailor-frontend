export default function Filters({
  pageAction,
  perPage,
  monthAction,
  yearAction,
  searchAction,
  month,
  year,
  search,
}) {
  const months = [
    "All",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const startYear = 2026;
  const endYear = 2031;
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 backdrop-blur-md shadow-lg">
      {/* Filter Bulan */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="month-select"
          className="text-xs font-semibold text-slate-400 tracking-wider uppercase"
        >
          Pilih Bulan
        </label>
        <select
          id="month-select"
          value={month}
          onChange={monthAction}
          className="w-36 px-3 py-2 text-sm bg-slate-800/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-150 cursor-pointer"
        >
          {months.map((month, index) => (
            <option
              key={index}
              value={index}
              className="bg-slate-900 text-slate-200"
            >
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Tahun */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="year-select"
          className="text-xs font-semibold text-slate-400 tracking-wider uppercase"
        >
          Pilih Tahun
        </label>
        <select
          id="year-select"
          value={year}
          onChange={yearAction}
          className="w-28 px-3 py-2 text-sm bg-slate-800/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-150 cursor-pointer"
        >
          {years.map((year) => (
            <option
              key={year}
              value={year}
              className="bg-slate-900 text-slate-200"
            >
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Input Pencarian */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Pencarian
        </label>
        <input
          type="text"
          placeholder="Cari data..."
          value={search}
          onChange={searchAction}
          className="w-64 px-3 py-2 text-sm bg-slate-800/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-150"
        />
      </div>

      {/* Pagination Per Page */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg text-sm text-slate-300">
        <span className="text-slate-400">Tampilkan</span>
        <select
          value={perPage}
          onChange={pageAction}
          className="bg-slate-900 border border-slate-700 text-indigo-400 rounded px-2 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-slate-400">data</span>
      </div>
    </div>
  );
}
