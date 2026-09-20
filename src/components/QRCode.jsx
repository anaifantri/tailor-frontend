import React from "react";
import { QRCodeSVG } from "qrcode.react"; // You can also import QRCodeCanvas

const QRCodeGenerator = ({ url, size }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* <h2>Scan this QR Code</h2> */}
      <QRCodeSVG
        value={url}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
      />
    </div>
  );
};

export default QRCodeGenerator;
