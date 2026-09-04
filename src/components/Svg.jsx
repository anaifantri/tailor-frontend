import React from "react";

const Svg = ({ title, c, children }) => {
  return (
    <svg
      className={c}
      title={title}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};

export default Svg;
