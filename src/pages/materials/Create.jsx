import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderCreate from "@/components/HeaderCreate";
import ImageSvg from "@/assets/Svg/ImageSvg";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const errorRef = useRef();
  const nameRef = useRef();
  const fileInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    unit: "pilih",
    description: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "photo") {
      const file = e.target.files[0];
      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
        }));
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      }
    } else if (e.target.name == "unit") {
      const selectedIndex = e.target.selectedIndex;
      const unit = e.target.options[selectedIndex].value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: unit,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    if (formData.unit === "pilih") {
      alert("Silahkan pilih satuan terlebih dahulu..!!!");
    } else {
      const dataMaterial = new FormData();
      dataMaterial.append("code", formData.code);
      dataMaterial.append("name", formData.name);
      dataMaterial.append("description", formData.description);
      dataMaterial.append("unit", formData.unit);

      if (formData.photo) {
        dataMaterial.append("photo", formData.photo);
      }
      try {
        setProcessing(true);
        const response = await api.post("/api/materials", dataMaterial, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        });
        navigate("/dashboard/materials", {
          state: {
            message: "Penambahan data kain berhasil..!!",
          },
        });
      } catch (err) {
        if (!err?.response) {
          setErrorMessage("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setErrorMessage("Unauthorized..!!");
        } else {
          setGetErrors(err.response.data.errors);
          nameRef.current.focus();
        }
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <>
      <div className="w-250">
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data Kain"
            backUrl="/dashboard/materials"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex-all-center col-span-1">
              <div>
                <div className="flex-all-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt=""
                      className="flex w-56 h-56 mx-2"
                    />
                  ) : (
                    <Svg title="Profile" c={"w-56 h-56 fill-current mx-2"}>
                      <ImageSvg />
                    </Svg>
                  )}
                </div>
                <div className="flex-all-center">
                  <input
                    type="file"
                    name="photo"
                    ref={fileInputRef}
                    onChange={handleChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <button
                    type="button"
                    className="flex-all-center bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 mt-2 cursor-pointer"
                    onClick={handlePhotoClick}
                  >
                    Pilih Foto Kain
                  </button>
                </div>
                {getErrors.photo && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.photo}
                  </span>
                )}
              </div>
            </div>
            <div className="flex p-2 border rounded-xl col-span-2">
              <div>
                <div className="flex items-center">
                  <label className="w-36">Kode Kain</label>
                  <input
                    type="text"
                    name="code"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input Kode Kain"
                    autoComplete="off"
                    onChange={handleChange}
                    required
                  />
                </div>
                {getErrors.code && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.code}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-36">Nama</label>
                  <input
                    type="text"
                    name="name"
                    className="flex p-2 h-8 w-120"
                    placeholder="Input Nama Kain"
                    autoComplete="off"
                    ref={nameRef}
                    onChange={handleChange}
                    required
                  />
                </div>
                {getErrors.name && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.name}
                  </span>
                )}
                <div className="flex mt-2">
                  <label className="w-36">Deskripsi</label>
                  <textarea
                    name="description"
                    className="flex p-1 w-120"
                    placeholder="Input Deskripsi Kain"
                    rows={3}
                    onChange={handleChange}
                  />
                </div>
                {getErrors.description && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.description}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-36">Satuan</label>
                  <select
                    className="h-8"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                  >
                    <option value="pilih">Pilih satuan</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Meter">Meter</option>
                    <option value="Box">Box</option>
                    <option value="Unit">Unit</option>
                  </select>
                </div>
                {getErrors.unit && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
