import React from "react";
import { Check, Circle } from "lucide-react";

import Svg from "@/components/Svg";
import ArrowSvg from "@/assets/svg/ArrowSvg";

const ProdcutionProgress = () => {
  // Definisi tahapan/milestone beserta statusnya
  const stages = [
    { name: "Antrian", status: "completed" },
    { name: "Potong", status: "completed" },
    { name: "Jahit", status: "completed" },
    { name: "Fitting", status: "current", label: "Progress Saat Ini" },
    { name: "Selesai", status: "upcoming" },
    { name: "Diambil", status: "upcoming" },
  ];

  return (
    <div className="bg-white p-4 mt-4 rounded-xl shadow-sm border border-slate-200 w-full max-w-4xl font-sans">
      <h3 className="text-base font-semibold text-slate-800 mb-8">
        Progress Pengerjaan
      </h3>

      <div className="relative w-full h-12 px-4">
        {/* Line / Track */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-4 left-0 h-1 bg-cyan-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: "60%" }}
        />

        {/* Nodes / Points */}
        <div className="relative z-10 flex justify-between items-center w-full">
          {stages.map((stage, index) => {
            const isCompleted = stage.status === "completed";
            const isCurrent = stage.status === "current";
            const isUpcoming = stage.status === "upcoming";

            return (
              <div
                key={index}
                className="flex flex-col items-center relative group"
              >
                {/* Milestone Label Header (jika ada) */}
                {stage.label && (
                  <div className="absolute -top-10 flex flex-col justify-center items-center whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-700">
                      {stage.label}
                    </span>
                    <div className="text-cyan-500">
                      <Svg title="Save" c={"w-4 fill-current mx-1"}>
                        <ArrowSvg />
                      </Svg>
                    </div>
                  </div>
                )}

                {/* Node Icon/Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-cyan-500 text-white"
                      : isCurrent
                        ? "bg-cyan-500 text-white ring-4 ring-cyan-100"
                        : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4 stroke-1" />}
                  {isCurrent && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                  {isUpcoming && (
                    <div className="w-2 h-2 bg-slate-300 rounded-full" />
                  )}
                </div>

                {/* Stage Name */}
                <span
                  className={`mt-3 text-xs font-medium text-center ${
                    isCurrent
                      ? "text-cyan-600 font-semibold"
                      : isCompleted
                        ? "text-slate-700"
                        : "text-slate-400"
                  }`}
                >
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProdcutionProgress;
