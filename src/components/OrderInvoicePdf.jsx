import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import FormattedDateShort from "@/Utils/FormattedDateShort";
import QRCode from "@/components/QRCode";

import Logo from "@/assets/Images/logo-riori-tailor-gold.png";

const styles = StyleSheet.create({
  logo: {
    display: "flex",
    width: 72,
  },
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#333" },
  header: {
    flexDirection: "row",
    padding: 6,
    boxSizing: "border-box",
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderRadius: 8,
  },
  headerLogo: {
    display: "flex",
    justifyContent: "center",
  },
  companyName: { fontSize: 20, fontWeight: "bold", color: "#007bff" },
  companyAddress: {
    display: "flex",
    marginLeft: 20,
    lineHeight: 1.5,
    fontSize: 9,
    // color: "#bfbfbf",
  },
  title: {
    borderBottom: "1px solid #bfbfbf",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "start",
    marginLeft: 80,
    fontSize: 12,
    letterSpacing: 2,
    textAlign: "right",
    textTransform: "uppercase",
  },
  number: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "start",
    marginLeft: 80,
    marginTop: 6,
    fontSize: 10,
    textAlign: "right",
  },
  customer: {
    marginTop: 8,
    padding: 4,
    boxSizing: "border-box",
    width: "65%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderRadius: 8,
  },
  orderDate: {
    marginTop: 8,
    marginLeft: 8,
    padding: 4,
    boxSizing: "border-box",
    width: "35%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderRadius: 8,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f0f0f0",
    padding: 4,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 4,
    fontSize: 9,
  },
  totalSection: { marginTop: 20, textAlign: "right", paddingRight: 10 },
});

const OrderInvoice = ({
  order,
  customer,
  orderDetails,
  downPayment,
  grandTotal,
  getId,
}) => {
  if (!order) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Nota */}
        <View style={styles.header}>
          <View>
            <Image src={Logo} style={styles.logo} alt="" />
          </View>
          <View style={styles.companyAddress}>
            <Text>RIORI TAILOR & TEXTILE</Text>
            <Text>Jl. Teuku Umar No. 65 E, Denpasar - Bali 80113</Text>
            <Text>phone : 08170666222</Text>
            <Text>email : rioritailor.id@gmail.com</Text>
            <Text>email : website : www.rioritailor.com</Text>
          </View>
          <View>
            <Text style={styles.title}>Nota Pesanan</Text>
            <Text style={styles.number}>No. Nota : {order?.number}</Text>
          </View>
        </View>

        {/* Informasi Pelanggan */}
        <View style={{ flexDirection: "row" }}>
          <View style={styles.customer}>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ width: 100 }}>Nama Pelanggan</Text>
              <Text>:</Text>
              <Text style={{ marginLeft: 4 }}>{customer?.name}</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ width: 100 }}>Alamat</Text>
              <Text>:</Text>
              <Text style={{ marginLeft: 4 }}>{customer?.address}</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ width: 100 }}>No. Hp.</Text>
              <Text>:</Text>
              <Text style={{ marginLeft: 4 }}>{customer?.phone}</Text>
            </View>
          </View>
          <View style={styles.orderDate}>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ width: 64 }}>Tgl. Order</Text>
              <Text>:</Text>
              <Text style={{ marginLeft: 4 }}>
                {FormattedDateShort(order?.order_date)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ width: 64 }}>Tgl. Fitting</Text>
              <Text>:</Text>
              <Text style={{ marginLeft: 4 }}>
                {FormattedDateShort(order?.fitting_date)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text style={{ width: 64 }}>Tgl. Selesai</Text>
              <Text>:</Text>
              <Text style={{ marginLeft: 4 }}>
                {FormattedDateShort(order?.due_date)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.tableColHeader,
                { width: "5%", textAlign: "center" },
              ]}
            >
              <Text>No.</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "15%", textAlign: "center" },
              ]}
            >
              <Text>Nomor Kain</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "40%", textAlign: "center" },
              ]}
            >
              <Text>Jenis Pesanan</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "10%", textAlign: "center" },
              ]}
            >
              <Text>Jumlah</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "15%", textAlign: "center" },
              ]}
            >
              <Text>Harga</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "15%", textAlign: "center" },
              ]}
            >
              <Text>Total</Text>
            </View>
          </View>
          {orderDetails.map((detail, index) => {
            return (
              <View style={styles.tableRow}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "5%", textAlign: "center" },
                  ]}
                >
                  <Text>{index + 1}</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "15%", textAlign: "center" },
                  ]}
                >
                  <Text>{detail.material.code}</Text>
                </View>
                <View style={[styles.tableCol, { width: "40%" }]}>
                  <Text>{detail.clothing_type.type}</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "10%", textAlign: "center" },
                  ]}
                >
                  <Text>{detail.quantity}</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "15%", textAlign: "right" },
                  ]}
                >
                  <Text>{Number(detail.price).toLocaleString()}</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "15%", textAlign: "right" },
                  ]}
                >
                  <Text>
                    {Number(detail.price * detail.quantity).toLocaleString()}
                  </Text>
                </View>
              </View>
            );
          })}

          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "70%", padding: 4 }]}>
              <Text>Catatan :</Text>
              <View style={{ flexDirection: "row", marginTop: 2 }}>
                <Text>1.</Text>
                <Text style={{ marginLeft: 4, paddingRight: 4 }}>
                  Lebih dari 2 bulan barang tidak diambil, segala kehilangan /
                  kerusakan dan lain-lain diluar tanggung jawab kami
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 2 }}>
                <Text>2.</Text>
                <Text style={{ marginLeft: 4, paddingRight: 4 }}>
                  Dengan nota tersebut barang bisa diterima
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 2 }}>
                <Text>3.</Text>
                <Text style={{ marginLeft: 4, paddingRight: 4 }}>
                  Kehilangan nota pengambilan bukan tanggung jawab kami
                </Text>
              </View>
            </View>
            <View>
              <View style={{ flexDirection: "row", width: "155" }}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>SUB TOTAL</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>{Number(order.total).toLocaleString()}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", width: "155" }}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>DP</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>{Number(downPayment).toLocaleString()}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", width: "155" }}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>DISKON</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>{Number(order.discount).toLocaleString()}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", width: "155" }}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>GRAND TOTAL</Text>
                </View>
                <View
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text>{Number(grandTotal).toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", fontSize: 10, marginTop: 10 }}>
            <View style={{ textAlign: "center", width: 80 }}>
              <Text>Hormat kami,</Text>
              <Text style={{ marginTop: 30 }}>
                (.............................)
              </Text>
            </View>
            <View style={{ marginLeft: 50, textAlign: "center", width: 80 }}>
              <Text>Pelanggan,</Text>
              <Text style={{ marginTop: 30 }}>
                (.............................)
              </Text>
            </View>
            <View style={{ marginLeft: 50, textAlign: "center", width: 80 }}>
              {/* <QRCode
                url={
                  "http://localhost:5173/dashboard/transactions/orders/order-pdf/" +
                  getId
                }
                size={100}
              /> */}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderInvoice;
