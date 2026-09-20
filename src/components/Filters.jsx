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
    <div className="flex items-center">
      <div className="mt-2">
        <label className="flex w-20">Pilih Bulan</label>
        <select
          id="month-select"
          value={month}
          onChange={monthAction}
          className="w-36 p-1"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2 ml-4">
        <label className="flex w-20">Pilih Tahun</label>
        <select
          id="year-select"
          value={year}
          onChange={yearAction}
          className="w-24 p-1"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2 ml-4">
        <label className="flex w-20">Pencarian</label>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={searchAction}
            className="py-1 px-2"
          />
          <div className="flex items-center border border-gray-200 shadow-sm rounded-md py-1 px-3 ml-4">
            <span className="text-sm">Tampilkan</span>
            <select
              value={perPage}
              onChange={pageAction}
              className="w-14 px-2 ml-4"
            >
              <option value={1}>1</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm ml-1">data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
