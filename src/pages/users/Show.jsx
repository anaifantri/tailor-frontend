import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderShow from "@/components/HeaderShow";
import BtnBack from "@/components/BtnBack";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

import ProfileSvg from "@/assets/Svg/ProfileSvg";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [user, setUser] = useState(null);
  // const [roles, setRoles] = useState([]);
  // const [permissions, setPermissions] = useState([]);
  // const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/users/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // response.data.user.roles.map((role) =>
        //   role.permissions.map((permission) => {
        //     if (!permissions.includes(permission.name)) {
        //       setPermissions((prevPermissions) => [
        //         ...prevPermissions,
        //         permission.name,
        //       ]);
        //     }
        //   }),
        // );
        setUser(response.data.user);
        // setRoles(response.data.user.roles);
        // setAllPermissions(response.data.allPermissions);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>
        <HeaderShow
          titleShow="Data Pengguna"
          url="/settings/users"
          deleteUrl="/users"
          getId={user.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="grid grid-cols-3 gap-4 mt-4 w-full">
          <div className="flex-all-center col-span-1">
            <div>
              <label className="flex-all-center w-full font-semibold">
                Photo Profile
              </label>
              {user.photo ? (
                <img
                  src={user.photo}
                  alt=""
                  className="flex border border-slate-200 shadow-xl w-64 h-64 mx-2 mt-2 rounded-full"
                />
              ) : (
                <Svg title="Profile" c={" w-64 h-64 fill-current mx-2 mt-2"}>
                  <ProfileSvg />
                </Svg>
              )}
            </div>
          </div>
          <div className="border border-slate-200 shadow-xl rounded-xl p-4 col-span-2 w-full text-lg">
            <label className="flex w-full">Nama Lengkap</label>
            <label className="flex font-semibold">{user.name}</label>
            <label className="flex mt-2">Username</label>
            <label className="flex font-semibold">{user.username}</label>
            <label className="flex mt-2">Email</label>
            <label className="flex font-semibold">{user.email}</label>
            <label className="flex mt-2">Nomor Hp.</label>
            <label className="flex font-semibold">{user.phone}</label>
            <label className="flex mt-2">Status</label>
            <label className="flex font-semibold">
              {user.is_active == true ? "Aktif" : "Non Aktif"}
            </label>
          </div>
        </div>
        {/* <div className="grid grid-cols-3 gap-2 w-full p-1 mt-2">
          <div>
            <label className="flex w-32">Roles</label>
            <div className="grid grid-cols-2 py-2">
              {roles.map((role, index) => (
                <li className="ml-4" key={index}>
                  {role.name}
                </li>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="flex w-32">Permissions</label>
            <div className="grid grid-cols-2 py-2">
              {allPermissions.map((permission, i) => (
                <div className="flex items-center" key={i}>
                  {permissions.includes(permission.name) ? (
                    <input type="checkbox" defaultChecked={true} />
                  ) : (
                    <input type="checkbox" />
                  )}

                  <span className="ml-2">{permission.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
