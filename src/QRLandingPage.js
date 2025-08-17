import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Use QRCodeCanvas instead of default import

function QRLandingPage() {
  const analyticsId = process.env.RAILWAY_PUBLIC_DOMAIN;
  const qrValue = `${analyticsId}/products`; // replace with your deployed link

  console.log("analyticsId", analyticsId)
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Scan to View Products</h1>
        <p style={styles.text}>
          Use your phone camera or a QR scanner app to view the latest product
          list instantly.
        </p>

        {/* ✅ Fixed QRCode */}
        <QRCodeCanvas value={qrValue} size={200} style={styles.qrCode} />

        <p style={styles.footer}>Point your camera and explore now!</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f9fafc",
    padding: "20px",
  },
  card: {
    textAlign: "center",
    background: "#ffffff",
    padding: "30px 40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    maxWidth: "400px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "15px",
    color: "#333",
  },
  text: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#555",
  },
  qrCode: {
    margin: "20px auto",
    display: "block",
  },
  footer: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#777",
  },
};

export default QRLandingPage;
