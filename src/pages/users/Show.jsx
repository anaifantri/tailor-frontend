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
          titleShow="Data User"
          url="/users"
          getId={user.hashed_id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex-all-center col-span-1">
            {user.photo ? (
              <img
                src={user.photo}
                alt=""
                className="flex w-56 h-56 mx-2 rounded-full"
              />
            ) : (
              <Svg title="Profile" c={"w-36 fill-current mx-2"}>
                <ProfileSvg />
              </Svg>
            )}
          </div>
          <div className=" border rounded-xl p-2 col-span-2 texl-lg w-120 h-60">
            <div className="flex w-full p-1">
              <label className="flex w-32">Nama</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{user.name}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Username</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{user.username}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Email</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{user.email}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Nomor Hp.</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{user.phone}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Status</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {user.is_active == true ? "Aktif" : "Non Aktif"}
              </label>
            </div>
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
