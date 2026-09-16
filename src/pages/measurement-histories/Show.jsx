import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import FormattedDateLong from "@/utils/FormattedDateLong";
import LoadingData from "@/Components/LoadingData";
import BtnBack from "@/components/BtnBack";
// import BtnPdf from "@/components/BtnPdf";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";

export default function Create() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clothingType, setClothingType] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [measurementDetails, setMeasurementDetails] = useState([]);
  const [measurementHistory, setMeasurementHistory] = useState([]);

  const errorRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/measurement-histories/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeasurementHistory(response.data.measurement_history);
        setMeasurementDetails(
          JSON.parse(response.data.measurement_history.measurement_details),
        );
        setCustomer(response.data.measurement_history.customer);
        setCustomerId(response.data.measurement_history.customer.hashed_id);
        setClothingType(response.data.measurement_history.clothing_type);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
          console.log(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingData />;
  }

  return (
    <>
      <div className="w-150">
        <div className="grid grid-cols-2 gap-1 w-full border-b">
          <div className="flex w-full font-semibold p-1 text-lg">
            Detail Data Pengukuran
          </div>
          <div className="flex justify-end w-full mx-1 p-1">
            <BtnBack backUrl={"/dashboard/customers/" + customerId} />
            <BtnEdit editUrl={"/dashboard/measurement-histories/edit/" + id} />
            <BtnDelete
              deleteUrl={`/api/measurement-histories/delete/`}
              deleteId={id}
              getToken={token}
              returnUrl={"/dashboard/customers/" + customerId}
            />
          </div>
        </div>
        <div className="flex-all-center mt-4">
          <div>
            <label className="font-semibold mt-4 ml-2">
              INFORMASI PELANGGAN
            </label>
            <div className="flex p-4 border border-gray-200 shadow-lg rounded-xl w-full mt-1">
              <div>
                <div className="flex items-center">
                  <label className="w-44">Nama Pelanggan</label>
                  <label>:</label>
                  <label className="ml-2 font-semibold">
                    {customer ? customer.name : "-"}
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-44">Nomor Telepon</label>
                  <label>:</label>
                  <label className="ml-2 font-semibold">
                    {customer ? customer.phone : "-"}
                  </label>
                </div>
                <div className="flex mt-2">
                  <label className="w-44">Alamat</label>
                  <label>:</label>
                  <label className="ml-2 w-96 h-10 font-semibold">
                    {customer ? customer.address : "-"}
                  </label>
                </div>
              </div>
            </div>

            <label className="flex font-semibold mt-4 ml-2">
              DETAIL PENGUKURAN
            </label>
            <div className="flex p-4 border border-gray-200 shadow-lg rounded-xl w-full mt-1">
              <div>
                <div className="flex items-center">
                  <label className="w-44">Jenis Pakaian</label>
                  <label>:</label>
                  <label className="ml-2 font-semibold">
                    {clothingType?.type}
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-44">Tanggal Ukur</label>
                  <label>:</label>
                  <label className="ml-2 font-semibold">
                    {FormattedDateLong(measurementHistory?.measured_at)}
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-44">Diukur Oleh</label>
                  <label>:</label>
                  <label className="ml-2 font-semibold">
                    {measurementHistory?.measured_by}
                  </label>
                </div>
                <div className="mt-4">
                  <div className="flex items-center border-b p-1 w-72">
                    <label className="w-44">Detail Ukuran</label>
                  </div>
                  {measurementDetails?.map((measurement, index) => {
                    return (
                      measurement.name != "" && (
                        <div key={index} className="flex items-start">
                          <label className="w-6">{index + 1}. </label>
                          <label className="w-36 font-semibold">
                            {measurement.name}
                          </label>
                          <label>=</label>
                          <label className="ml-2 font-semibold">
                            {measurement.value}
                          </label>
                          <label className="flex w-6 ml-2">cm</label>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
            <label className="flex font-semibold mt-4 ml-2">Keterangan</label>
            <label className="flex mt-2 border border-gray-200 shadow-md rounded-md w-full min-h-16 px-2 py-1">
              {measurementHistory?.notes}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
