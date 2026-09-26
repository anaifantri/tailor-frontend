import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";

import InputSearch from "@/components/InputSearch";
import OrderChart from "@/components/OrderChart";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const slides = [
//   {
//     id: 1,
//     title: "Lacak Pesanan Pelanggan",
//   },
//   {
//     id: 2,
//     title: "Performa Pesanan Bulanan",
//   },
// ];
// Contoh komponen custom yang akan dimasukkan ke dalam slider
const CardProduct = ({ title, price, category, color }) => (
  <div
    className={`p-6 rounded-2xl text-white ${color} shadow-lg flex flex-col justify-between h-72`}
  >
    <div>
      <span className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
        {category}
      </span>
      <h3 className="text-2xl font-bold mt-4">{title}</h3>
    </div>
    <div>
      <p className="text-sm opacity-80">Mulai dari</p>
      <p className="text-3xl font-extrabold">{price}</p>
      <button className="mt-4 w-full py-2 bg-white text-gray-900 font-semibold rounded-xl hover:bg-opacity-90 transition">
        Beli Sekarang
      </button>
    </div>
  </div>
);

function Dashboard() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Daftar komponen yang dimasukkan ke slider
  const items = [<InputSearch />, <OrderChart />];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="w-full mx-auto py-2 px-4">
        {/* Container utama slider */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Track tempat komponen disusun secara horizontal */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="w-full shrink-0 flex justify-center items-start overflow-hidden rounded-4xl border bg-white border-gray-200 shadow-sm p-4"
              >
                {item}
              </div>
            ))}
          </div>

          {/* Navigasi Kiri */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition"
          >
            ❮
          </button>

          {/* Navigasi Kanan */}
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition"
          >
            ❯
          </button>
        </div>

        {/* Indikator Titik (Dots) */}
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === index ? "w-8 bg-blue-600" : "w-2.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      {/* <div className="overflow-hidden w-full h-160 rounded-xl border border-gray-200 shadow-sm">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          // loop={true}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-160 w-full p-10">
                <InputSearch />
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <h2 className="text-white text-xl md:text-2xl font-bold">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div> */}
      {/* <div className="w-full">
        <div className="flex w-full justify-center p-2">
          <div>
            <label className="flex w-full justify-center text-lg font-semibold text-stone-700 mt-8">
              Lacak Pesanan Pelanggan
            </label>
            <InputSearch />
          </div>
        </div>
        <div className="flex w-full justify-center p-2 mt-6">
          <OrderChart />
        </div>
      </div> */}
    </>
  );
}

export default Dashboard;
