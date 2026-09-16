import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [errorPassword, setErrorPassword] = useState(null);
  const [message, setMessage] = useState("");
  const passwordRef = useRef();
  const errorRef = useRef();

  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "password_confirmation") {
      if (formData.password !== value) {
        setErrorPassword("Password tidak cocok");
      } else {
        setErrorPassword("");
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      setProcessing(true);
      const response = await api.post("/api/users/change-password", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      alert(response.data.message);
      logout();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        setMessage("Terjadi masalah, silahkan coba lagi..!!");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex justify-center w-150 h-120 border border-slate-200 rounded-4xl shadow-2xl p-4 mt-6">
      <div>
        <div className="flex-all-center w-full">
          {/* <img className="w-32" src={LogoRiori} alt="" /> */}
        </div>
        <div className="flex-all-center p-2">
          <h2 className="tracking-widest font-bold text-xl ">Ganti Password</h2>
        </div>
        {message && (
          <span
            className={
              message
                ? "flex-all-center m-auto w-full text-red-700 text-sm items-center"
                : "hidden"
            }
          >
            {message}
          </span>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex-all-center mt-6">
            <div>
              <label className="">Password Lama</label>
              <input
                type="password"
                name="current_password"
                className="flex items-center mt-2 py-1 px-2 w-80"
                placeholder="Input New Password"
                autoComplete="off"
                required
                ref={passwordRef}
                onChange={handleChange}
              />
              {errors.current_password && (
                <span
                  ref={errorRef}
                  className={
                    errors.current_password
                      ? "flex text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {errors.current_password}
                </span>
              )}
              <label className="flex  mt-4">Password Baru</label>
              <input
                type="password"
                name="password"
                className="flex items-center mt-2 py-1 px-2 w-80"
                placeholder="Input New Password"
                autoComplete="off"
                required
                onChange={handleChange}
              />
              {errors.password && (
                <span
                  ref={errorRef}
                  className={
                    errors.password
                      ? "flex text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {errors.password}
                </span>
              )}
              <label className=" mt-4 flex">Konfirmasi Password</label>
              <input
                name="password_confirmation"
                type="password"
                className="flex items-center mt-2 py-1 px-2 w-80"
                placeholder="Password Confirmation"
                autoComplete="off"
                required
                onChange={handleChange}
              />
              {errorPassword && <p style={{ color: "red" }}>{errorPassword}</p>}
              {errors.password_confirmation && (
                <span
                  ref={errorRef}
                  className={
                    errors.password_confirmation
                      ? "flex text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {errors.password_confirmation}
                </span>
              )}
              <button
                type="submit"
                className={
                  processing
                    ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                    : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
                }
                disabled={processing}
              >
                {processing && (
                  <Svg title="Spin" c={"w-5 fill-current mx-2 animate-spin"}>
                    <SpinSvg />
                  </Svg>
                )}
                <span>Ganti Password</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
