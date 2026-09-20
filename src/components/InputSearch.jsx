import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import ProductionProgress from "@/components/ProductionProgress";

export default function SearchSection() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  // const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await api.get("/api/orders/search", {
  //         params: {
  //           search,
  //         },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       // setOrders(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       setError(error);
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get("/api/orders/search", {
        params: {
          search: searchQuery,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex w-full justify-center">
        <label className="flex justify-center text-lg font-semibold text-stone-700">
          Lacak Pesanan Pelanggan
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="w-full flex justify-center min-w-xl max-w-4xl space-y-4 mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan Nomor Pesanan, Nama Pelanggan, atau No. Telepon...!!"
            className="w-full h-10 px-5 bg-white border border-gray-300 rounded-l-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring focus:ring-stone-400 focus:border-transparent shadow-sm transition-all"
          />
          <button className="cursor-pointer hover:bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-300 shadow-sm rounded-r-full h-10 w-10 bg-gray-200">
            <Search size={20} />
          </button>
        </div>
      </form>
      <ProductionProgress />
    </div>
  );
}
