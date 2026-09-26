export const BASIC_MEASUREMENTS = [
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

export const CUSTOM_SELECT_STYLES = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1e293b",
    borderColor: "#475569",
    color: "#f8fafc",
    minHeight: "2rem",
    height: "2rem",
  }),
  singleValue: (base) => ({ ...base, color: "#f8fafc" }),
  input: (base) => ({ ...base, color: "#f8fafc" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1e293b",
    borderColor: "#475569",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#334155" : "#1e293b",
    color: "#f8fafc",
    cursor: "pointer",
  }),
};

export const INITIAL_ORDER_DETAIL = {
  service_ulid: null,
  material_ulid: null,
  // item_type: null,
  quantity: 0,
  unit: "",
  price: 0,
  total: 0,
  measurements: null,
  fabric_consumed_meter: 0,
  notes: null,
  service_code: "",
  service_name: "",
  service_category: "",
};
