import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/Components/Svg";
import SpinSvg from "@/Assets/Svg/SpinSvg";
import LogoRiori from "@/assets/Images/logo-riori-tailor-01.png";

function verifyEmail() {
  const navigate = useNavigate();
  const { user, verifyEmail } = useAuth();
  const { id, hash } = useParams();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await verifyEmail(id, hash, searchParams);
        setMessage(response.data.message);
        setLoading(false);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 403) {
          setError(err.response.data.message);
        } else {
          setError(err.response.data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    return () => fetchData();
  }, []);

  return (
    <>
      <div className="flex-all-center mt-6">
        <>
          <div className="flex-all-center w-full h-screen top-0 bg-stone-50">
            <div className="flex-all-center bg-stone-900 w-150 h-100 border-slate-100 rounded-4xl drop-shadow-xl">
              <div className="flex-all-center">
                <div>
                  <div className="flex-all-center w-full">
                    <img className="w-32" src={LogoRiori} alt="" />
                  </div>
                  <div className="flex-all-center p-2">
                    <h2 className="tracking-widest font-bold text-xl text-amber-500">
                      Verifikasi Email
                    </h2>
                  </div>
                  {loading && (
                    <div>
                      <div className="flex-all-center w-full">
                        <Svg
                          title="Back"
                          c={"w-5 fill-current mx-1 animate-spin"}
                        >
                          <SpinSvg />
                        </Svg>
                      </div>
                      <span className="flex-all-center w-full">
                        {" "}
                        Proses verifikasi email...
                      </span>
                    </div>
                  )}
                  {message && (
                    <>
                      <span
                        className={
                          message
                            ? "flex-all-center m-auto w-full text-amber-500 text-sm items-center"
                            : "hidden"
                        }
                      >
                        {message}
                      </span>
                      {user ? (
                        <Link
                          to="/dashboard"
                          reloadDocument
                          className="text-amber-500 mt-4 flex justify-center hover:text-amber-300"
                        >
                          To Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/"
                          className="text-amber-500 mt-4 flex justify-center hover:text-amber-300"
                        >
                          Back to login
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default verifyEmail;
