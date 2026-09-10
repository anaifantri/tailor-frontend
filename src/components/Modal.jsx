import React, { useEffect } from "react";

import Svg from "@/components/Svg";
import DeleteSvg from "@/assets/Svg/DeleteSvg";

export default function Modal({ title, isOpen, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity"
      onClick={onClose}
    >
      <div
        className="transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-lg font-medium text-gray-950">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 font-bold text-xl leading-none cursor-pointer"
          >
            <Svg title="Back" c={"w-5 fill-current mx-1"}>
              <DeleteSvg />
            </Svg>
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-6">{children}</div>
      </div>
    </div>
  );
}
