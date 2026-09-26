import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import SaveSvg from "@/assets/Svg/SaveSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function CustomerForm({
  setCustomerOptions,
  setSelectedCustomer,
  setCustomer,
  setCustomerModalOpen,
}) {
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const errorRef = useRef();
  const [processing, setProcessing] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    code: "",
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevNewCustomer) => ({
      ...prevNewCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const dataCustomer = new FormData();
    dataCustomer.append("code", newCustomer.code);
    dataCustomer.append("name", newCustomer.name);
    dataCustomer.append("email", newCustomer.email);
    dataCustomer.append("phone", newCustomer.phone);
    dataCustomer.append("address", newCustomer.address);

    try {
      setProcessing(true);
      const response = await api.post("/api/customers", dataCustomer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const newCustomerOption = {
        value: response.data.customer.ulid,
        label: response.data.customer.name,
        code: response.data.customer.code,
        name: response.data.customer.name,
        address: response.data.customer.address,
        phone: response.data.customer.phone,
        email: response.data.customer.email,
      };
      const getNewCustomer = {
        ulid: response.data.customer.ulid,
        code: response.data.customer.code,
        name: response.data.customer.name,
        address: response.data.customer.address,
        phone: response.data.customer.phone,
        email: response.data.customer.email,
      };
      setCustomerOptions((customerOptions) => [
        newCustomerOption,
        ...customerOptions,
      ]);
      setSelectedCustomer(newCustomerOption);
      setCustomer(getNewCustomer);
      alert(response.data.message);
      setCustomerModalOpen(false);
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-slate-200 shadow-xl rounded-xl p-4 mt-4 w-120">
        <label>Nama Pelanggan</label>
        <input
          type="text"
          name="name"
          className="flex p-2 h-8 w-full mt-1"
          placeholder="Masukkan Nama Pelanggan"
          autoComplete="off"
          onChange={handleChange}
          required
        />
        {getErrors?.name && (
          <span
            ref={errorRef}
            className={
              getErrors
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.name}
          </span>
        )}
        <label className="flex mt-4">Alamat</label>
        <textarea
          name="address"
          className="flex p-1 w-full mt-1"
          placeholder="Masukkan Alamat"
          rows={3}
          onChange={handleChange}
        />
        {getErrors?.address && (
          <span
            ref={errorRef}
            className={
              errorMessage
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.address}
          </span>
        )}
        <label className="flex mt-4">Nomor Hp.</label>
        <input
          type="text"
          name="phone"
          className="flex p-2 h-8 w-full mt-1"
          placeholder="Masukkan Nomor Hp."
          autoComplete="off"
          onChange={handleChange}
          required
        />
        {getErrors?.phone && (
          <span
            ref={errorRef}
            className={
              getErrors
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.phone}
          </span>
        )}
        <label className="flex mt-4">Email</label>
        <input
          type="email"
          name="email"
          className="flex p-2 h-8 w-full mt-1"
          placeholder="Masukkan email"
          autoComplete="off"
          onChange={handleChange}
        />
        {getErrors?.email && (
          <span
            ref={errorRef}
            className={
              getErrors
                ? "flex w-full text-red-500 text-xs items-center"
                : "hidden"
            }
          >
            {getErrors?.email}
          </span>
        )}
      </div>
      <div className="flex w-full justify-end mt-2 px-2">
        <button
          type="submit"
          disabled={processing}
          className={
            processing
              ? "flex-all-center button-disabled"
              : "flex-all-center button-success cursor-pointer"
          }
        >
          {processing ? (
            <Svg title="Spin" c={"w-4 fill-current mx-1 animate-spin"}>
              <SpinSvg />
            </Svg>
          ) : (
            <Svg title="Save" c={"w-4 fill-current mx-1"}>
              <SaveSvg />
            </Svg>
          )}
          <span className="mx-1">
            {processing ? "Menyimpan data..." : "Simpan"}
          </span>
        </button>
      </div>
    </form>
  );
}
