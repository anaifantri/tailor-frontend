import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";

import api from "@/apiService";
import LoadingData from "@/Components/LoadingData";
import FormattedDateLong from "@/Utils/FormattedDateLong";
import FormattedDateShort from "@/Utils/FormattedDateShort";

import Modal from "@/components/Modal";
import CustomerForm from "@/components/CustomerForm";
import OrderNotes from "@/components/OrderNotes";
import PaymentForm from "@/components/PaymentForm";
import HeaderCreate from "@/components/HeaderCreate";
import BlackLogo from "@/components/BlackLogo";
import BtnPay from "@/components/BtnPay";
import Svg from "@/components/Svg";

import DeleteSvg from "@/Assets/Svg/DeleteSvg";
import AddSvg from "@/assets/Svg/AddSvg";
import EditSvg from "@/Assets/Svg/EditSvg";

const BASIC_MEASUREMENTS = [
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

export default function CreateOrder() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  // Master Data & Options
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [clothingTypeOptions, setClothingTypeOptions] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  // Selected Main State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  // Payment & Form Meta
  const [downPayment, setDownPayment] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [formData, setFormData] = useState({
    number: "",
    order_date: today,
    fitting_date: "",
    due_date: "",
    payment_method: "Cash",
    payment_notes: "",
    payment_date: today,
  });

  // Modal Control States
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [downPaymentModalOpen, setDownPaymentModalOpen] = useState(false);

  // Detail Order Modal Form State
  const [itemForm, setItemForm] = useState({
    clothing_type_id: "",
    clothing_type_label: "",
    category: "",
    material_id: null,
    material_label: "",
    qty: 1,
    price: 0,
    measurements: [],
  });

  // Measurement States inside Modal Detail Order
  const [measurementHistories, setMeasurementHistories] = useState([]);
  const [isCreatingNewMeasurement, setIsCreatingNewMeasurement] =
    useState(false);
  const [newMeasurements, setNewMeasurements] = useState([]);

  // Form errors
  const [getErrors, setGetErrors] = useState({});

  // 1. Fetch initial options (Updated using ULID `id`)
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    const fetchMasterData = async () => {
      try {
        setLoading(true);
        const [resCustomers, resMaterials, resClothingTypes] =
          await Promise.all([
            api.get("/api/customers", { headers }),
            api.get("/api/materials", { headers }),
            api.get("/api/clothing-types", { headers }),
          ]);

        setCustomerOptions(
          (resCustomers.data.data || []).map((c) => ({
            value: c.id, // ULID ID
            label: `${c.code} - ${c.name}`,
            raw: c,
          })),
        );

        const loadedClothingTypes = resClothingTypes.data.data || [];
        setClothingTypes(loadedClothingTypes);
        setClothingTypeOptions(
          loadedClothingTypes.map((ct) => ({
            value: ct.id, // ULID ID
            label: ct.type,
            category: ct.category,
            code: ct.code,
          })),
        );

        setMaterialOptions(
          (resMaterials.data.data || []).map((m) => ({
            value: m.id, // ULID ID
            label: `${m.code} | ${m.name}`,
          })),
        );
      } catch (err) {
        console.error("Gagal mengambil data master:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, [token]);

  // Calculations
  const subTotal = useMemo(() => {
    return orderDetails.reduce((acc, item) => acc + item.qty * item.price, 0);
  }, [orderDetails]);

  const balance = useMemo(() => {
    const calc = subTotal - downPayment - discount;
    return calc < 0 ? 0 : calc;
  }, [subTotal, downPayment, discount]);

  // Handler Pilih Pelanggan
  const handleSelectCustomer = (option) => {
    setSelectedCustomer(option);
    setCustomerData(option ? option.raw : null);
  };

  // Handler Tambah Customer Baru dari Modal
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setGetErrors({});

    const formDataObj = new FormData(e.target);
    const payload = Object.fromEntries(formDataObj.entries());

    try {
      const response = await api.post("/api/customers", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const added = response.data.customer || response.data.data;
      const newOption = {
        value: added.id, // ULID ID
        label: `${added.code} - ${added.name}`,
        raw: added,
      };

      setCustomerOptions((prev) => [newOption, ...prev]);
      handleSelectCustomer(newOption);
      setCustomerModalOpen(false);
    } catch (err) {
      setGetErrors(err.response?.data?.errors || {});
    } finally {
      setProcessing(false);
    }
  };

  // Reset & Open Modal Detail Order
  const handleOpenDetailModal = () => {
    setItemForm({
      clothing_type_id: "",
      clothing_type_label: "",
      category: "",
      material_id: null,
      material_label: "",
      qty: 1,
      price: 0,
      measurements: [],
    });
    setMeasurementHistories([]);
    setIsCreatingNewMeasurement(false);
    setOrderDetailModalOpen(true);
  };

  // Handler Ganti Clothing Type di dalam Modal Detail Order
  const handleClothingTypeChangeInModal = async (selected) => {
    if (!selected) return;

    // Pencarian memakai id (ULID)
    const typeObj = clothingTypes.find((t) => t.id === selected.value);
    const categoryName = typeObj?.category || selected.category;

    setItemForm((prev) => ({
      ...prev,
      clothing_type_id: selected.value,
      clothing_type_label: selected.label,
      category: categoryName,
      measurements: [],
    }));

    // Reset Form Ukuran Baru
    const defaultTemplate = BASIC_MEASUREMENTS.find(
      (m) => m.name?.toLowerCase() === categoryName?.toLowerCase(),
    );
    const initialNewMeasurements = (defaultTemplate?.measurements || []).map(
      (name) => ({
        name,
        value: "",
      }),
    );
    setNewMeasurements(initialNewMeasurements);

    // Fetch Measurement History menggunakan ID ULID
    try {
      const res = await api.get("/api/getbycustomerandclothing", {
        params: {
          customerId: customerData.id, // Menggunakan ULID ID
          clothingTypeId: selected.value, // Menggunakan ULID ID
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeasurementHistories(res.data.measurement_histories || []);
    } catch (err) {
      console.error("Gagal memuat riwayat ukuran", err);
      setMeasurementHistories([]);
    }
  };

  // Simpan Detail Order ke Tabel
  const handleAddDetailToTable = () => {
    if (!itemForm.clothing_type_id) {
      alert("Harap pilih jenis pakaian!");
      return;
    }

    let finalMeasurements = itemForm.measurements;

    // Jika memilih opsi buat ukuran baru
    if (isCreatingNewMeasurement) {
      finalMeasurements = newMeasurements.filter(
        (m) => m.name && m.value !== "",
      );
    }

    const newItem = {
      ...itemForm,
      measurements: finalMeasurements,
      total: itemForm.qty * itemForm.price,
    };

    setOrderDetails((prev) => [...prev, newItem]);
    setOrderDetailModalOpen(false);
  };

  // Delete Detail Item
  const handleRemoveDetailItem = (index) => {
    setOrderDetails((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Final Order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customerData) {
      alert("Pilih pelanggan terlebih dahulu!");
      return;
    }
    if (orderDetails.length === 0) {
      alert("Tambahkan minimal satu detail pesanan!");
      return;
    }

    const payload = {
      user_id: user.id, // ULID ID User
      number: formData.number,
      customer_id: customerData.id, // ULID ID Customer
      order_date: formData.order_date,
      fitting_date: formData.fitting_date,
      due_date: formData.due_date,
      discount,
      total: subTotal,
      amount_paid: downPayment,
      payment_method: formData.payment_method,
      payment_date: formData.payment_date,
      order_details: orderDetails.map((item) => ({
        clothing_type_id: item.clothing_type_id, // ULID
        material_id: item.material_id, // ULID
        qty: item.qty,
        price: item.price,
        measurements: JSON.stringify(item.measurements),
      })),
    };

    try {
      setProcessing(true);
      await api.post("/api/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/dashboard/transactions/orders", {
        state: { message: "Berhasil membuat pesanan baru!" },
      });
    } catch (err) {
      setGetErrors(err.response?.data?.errors || {});
      alert("Terjadi kesalahan saat menyimpan pesanan.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingData />;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <form onSubmit={handleSubmitOrder}>
        <HeaderCreate
          titleCreate="Buat Pesanan Baru"
          backUrl="/dashboard/orders"
          getProcessing={processing}
        />

        {/* NOTA HEADER */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-2 border-stone-900 rounded-2xl p-4 bg-white gap-4 mt-4">
          <BlackLogo />
          <div className="text-right w-full sm:w-auto">
            <h2 className="font-bold text-xl border-b-2 border-stone-900 inline-block pb-1">
              NOTA PESANAN
            </h2>
            <div className="flex items-center mt-3 gap-2">
              <label className="text-sm font-semibold">NOMOR NOTA:</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="w-48 px-2 py-1 font-semibold border rounded text-center"
                placeholder="Ex: ORD-001"
                required
              />
            </div>
            {getErrors?.number && (
              <span className="text-red-500 text-xs block">
                {getErrors.number}
              </span>
            )}
          </div>
        </div>

        {/* STEP 1: PILIH PELANGGAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 border border-stone-900 rounded-xl p-4 bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="w-36 text-sm font-bold">
                1. Pilih Pelanggan <span className="text-red-500">*</span>
              </label>
              <div className="flex-1 w-full">
                <Select
                  placeholder="Cari Pelanggan..."
                  value={selectedCustomer}
                  onChange={handleSelectCustomer}
                  options={customerOptions}
                  isClearable
                />
              </div>
              <button
                type="button"
                onClick={() => setCustomerModalOpen(true)}
                className="flex items-center gap-1 bg-stone-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-stone-800 whitespace-nowrap"
              >
                <Svg title="Add" c="w-4 fill-current">
                  <AddSvg />
                </Svg>
                <span>Tambah Pelanggan</span>
              </button>
            </div>

            {/* RINGKASAN PELANGGAN TERPILIH */}
            {customerData ? (
              <div className="mt-4 p-3 bg-stone-50 border rounded-lg text-sm space-y-1">
                <p>
                  <span className="w-28 inline-block text-gray-500">Nama:</span>{" "}
                  <strong>{customerData.name}</strong>
                </p>
                <p>
                  <span className="w-28 inline-block text-gray-500">
                    Alamat:
                  </span>{" "}
                  {customerData.address || "-"}
                </p>
                <p>
                  <span className="w-28 inline-block text-gray-500">
                    Telepon:
                  </span>{" "}
                  {customerData.phone || "-"}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-amber-600 font-medium">
                * Silakan pilih atau tambah pelanggan terlebih dahulu untuk
                mengaktifkan form rincian pesanan.
              </p>
            )}
          </div>

          {/* TANGGAL TRANSAKSI */}
          <div className="border border-stone-900 rounded-xl p-4 bg-white text-sm space-y-3">
            <div className="flex justify-between items-center">
              <span>Tgl. Pesan:</span>
              <strong className="text-base">{FormattedDateLong(today)}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>Tgl. Fitting:</span>
              <input
                type="date"
                value={formData.fitting_date}
                onChange={(e) =>
                  setFormData({ ...formData, fitting_date: e.target.value })
                }
                className="border rounded px-2 py-1"
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Tgl. Selesai:</span>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* STEP 2: DETAIL ORDER */}
        <div className="mt-6 border border-stone-900 rounded-xl p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">2. Rincian Item Pesanan</h3>
            <button
              type="button"
              disabled={!customerData}
              onClick={handleOpenDetailModal}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                customerData
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Svg title="Add" c="w-4 fill-current">
                <AddSvg />
              </Svg>
              <span>Tambah Detail Order</span>
            </button>
          </div>

          {/* TABEL ITEM */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-stone-100 text-stone-800 border-b">
                  <th className="p-2 border text-center w-12">No.</th>
                  <th className="p-2 border text-left">Jenis Pakaian</th>
                  <th className="p-2 border text-left">Material / Kain</th>
                  <th className="p-2 border text-left">Detail Ukuran</th>
                  <th className="p-2 border text-center w-20">Qty</th>
                  <th className="p-2 border text-right w-32">Harga</th>
                  <th className="p-2 border text-right w-36">Total</th>
                  <th className="p-2 border text-center w-16">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-6 text-center text-gray-400 italic"
                    >
                      Belum ada detail pesanan. Klik "Tambah Detail Order" di
                      atas.
                    </td>
                  </tr>
                ) : (
                  orderDetails.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-stone-50">
                      <td className="p-2 border text-center">{idx + 1}</td>
                      <td className="p-2 border font-medium">
                        {item.clothing_type_label}
                      </td>
                      <td className="p-2 border">
                        {item.material_label || "-"}
                      </td>
                      <td className="p-2 border">
                        {item.measurements.length > 0 ? (
                          <div className="text-xs space-y-0.5">
                            {item.measurements.map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className="inline-block bg-stone-100 px-1.5 py-0.5 rounded mr-1 mb-1"
                              >
                                {m.name}: {m.value} cm
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Tanpa Ukuran
                          </span>
                        )}
                      </td>
                      <td className="p-2 border text-center">{item.qty}</td>
                      <td className="p-2 border text-right">
                        Rp {item.price.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2 border text-right font-semibold">
                        Rp {item.total.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveDetailItem(idx)}
                          className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Svg title="Delete" c="w-4 fill-current">
                            <DeleteSvg />
                          </Svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}

                {/* SUMMARY ROW */}
                <tr>
                  <td colSpan={4} rowSpan={4} className="p-2 border align-top">
                    <OrderNotes />
                  </td>
                  <td colSpan={2} className="p-2 border text-right font-bold">
                    Subtotal
                  </td>
                  <td className="p-2 border text-right font-bold">
                    Rp {subTotal.toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 border bg-gray-50"></td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="p-2 border text-right font-semibold"
                  >
                    Uang Muka (DP)
                  </td>
                  <td className="p-2 border text-right">
                    {downPayment > 0 ? (
                      <button
                        type="button"
                        onClick={() => setDownPaymentModalOpen(true)}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Rp {downPayment.toLocaleString("id-ID")}
                      </button>
                    ) : (
                      <BtnPay action={() => setDownPaymentModalOpen(true)} />
                    )}
                  </td>
                  <td className="p-2 border bg-gray-50"></td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="p-2 border text-right font-semibold"
                  >
                    Diskon
                  </td>
                  <td className="p-2 border text-right">
                    <input
                      type="number"
                      min={0}
                      value={discount}
                      onChange={(e) =>
                        setDiscount(Math.max(0, Number(e.target.value)))
                      }
                      className="w-28 border rounded text-right p-1"
                    />
                  </td>
                  <td className="p-2 border bg-gray-50"></td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="p-2 border text-right font-bold text-red-600"
                  >
                    Sisa Tagihan
                  </td>
                  <td className="p-2 border text-right font-bold text-red-600">
                    Rp {balance.toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 border bg-gray-50"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>

      {/* 1. MODAL CREATE PELANGGAN BARU */}
      <Modal
        title="Tambah Pelanggan Baru"
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      >
        <CustomerForm
          actionForm={handleCustomerSubmit}
          getErrors={getErrors}
          processing={processing}
        />
      </Modal>

      {/* 2. MODAL TAMBAH DETAIL ORDER */}
      <Modal
        title="Tambah Detail Pesanan"
        isOpen={orderDetailModalOpen}
        onClose={() => setOrderDetailModalOpen(false)}
      >
        <div className="space-y-4">
          {/* Pilih Clothing Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Jenis Pakaian <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Pilih jenis pakaian..."
              options={clothingTypeOptions}
              onChange={handleClothingTypeChangeInModal}
            />
          </div>

          {/* Measurement History & New Measurement Section */}
          {itemForm.clothing_type_id && (
            <div className="border rounded-lg p-3 bg-stone-50 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-bold text-stone-700">
                  Data Ukuran Pakaian
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="measurement_type"
                      checked={!isCreatingNewMeasurement}
                      onChange={() => setIsCreatingNewMeasurement(false)}
                    />
                    Pilih Riwayat
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="measurement_type"
                      checked={isCreatingNewMeasurement}
                      onChange={() => setIsCreatingNewMeasurement(true)}
                    />
                    Ukuran Baru
                  </label>
                </div>
              </div>

              {!isCreatingNewMeasurement ? (
                /* Riwayat Ukuran */
                <div>
                  {measurementHistories.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">
                      Tidak ditemukan riwayat ukuran untuk jenis pakaian ini.
                      Silakan buat ukuran baru.
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {measurementHistories.map((hist, idx) => {
                        let parsed = [];
                        try {
                          parsed =
                            typeof hist.measurement_details === "string"
                              ? JSON.parse(hist.measurement_details)
                              : hist.measurement_details || [];
                        } catch (e) {
                          parsed = [];
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              setItemForm((prev) => ({
                                ...prev,
                                measurements: parsed,
                              }))
                            }
                            className={`p-2 border rounded cursor-pointer text-xs transition-all ${
                              JSON.stringify(itemForm.measurements) ===
                              JSON.stringify(parsed)
                                ? "border-emerald-600 bg-emerald-50"
                                : "bg-white hover:border-gray-400"
                            }`}
                          >
                            <div className="flex justify-between font-semibold mb-1">
                              <span>
                                Tgl: {FormattedDateShort(hist.measured_at)}
                              </span>
                              <span>Oleh: {hist.measured_by || "-"}</span>
                            </div>
                            <div className="text-stone-600 truncate">
                              {parsed
                                .map((p) => `${p.name}: ${p.value}`)
                                .join(" | ")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Input Ukuran Baru */
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {newMeasurements.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs w-28 truncate">{m.name}:</span>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-xs"
                        value={m.value}
                        onChange={(e) => {
                          const updated = [...newMeasurements];
                          updated[idx].value = e.target.value;
                          setNewMeasurements(updated);
                        }}
                        placeholder="cm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pilih Material */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Pilih Kain / Material
            </label>
            <Select
              placeholder="Pilih kain (opsional)..."
              options={materialOptions}
              isClearable
              onChange={(selected) =>
                setItemForm((prev) => ({
                  ...prev,
                  material_id: selected?.value || null,
                  material_label: selected?.label || "",
                }))
              }
            />
          </div>

          {/* Qty & Harga */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Jumlah (Qty)
              </label>
              <input
                type="number"
                min={1}
                className="w-full border rounded p-2 text-sm"
                value={itemForm.qty}
                onChange={(e) =>
                  setItemForm((prev) => ({
                    ...prev,
                    qty: Math.max(1, Number(e.target.value)),
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Harga Satuan (Rp)
              </label>
              <input
                type="number"
                min={0}
                className="w-full border rounded p-2 text-sm"
                value={itemForm.price}
                onChange={(e) =>
                  setItemForm((prev) => ({
                    ...prev,
                    price: Math.max(0, Number(e.target.value)),
                  }))
                }
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOrderDetailModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleAddDetailToTable}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-semibold hover:bg-stone-800"
            >
              Simpan Item
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. MODAL PEMBAYARAN DP */}
      <Modal
        title="Input Pembayaran Uang Muka (DP)"
        isOpen={downPaymentModalOpen}
        onClose={() => setDownPaymentModalOpen(false)}
      >
        <PaymentForm
          data={formData}
          action={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setDownPaymentModalOpen(false)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => setDownPaymentModalOpen(false)}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-sm font-semibold hover:bg-emerald-700"
          >
            Simpan DP
          </button>
        </div>
      </Modal>
    </div>
  );
}
