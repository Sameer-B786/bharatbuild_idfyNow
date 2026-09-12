"use client";
import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  useEffect(() => {
    // Initialize the scanner targeting the div with id "reader"
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        // Will support standard student ID barcodes like Code39, Code128, and QR
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText, decodedResult) => {
        // Pause scanning immediately when a barcode is found so we don't spam the API
        scanner.pause(true);
        onScanSuccess(decodedText, decodedResult, scanner);
      },
      (errorMessage) => {
        if (onScanError) onScanError(errorMessage);
      }
    );

    // Cleanup camera and UI on unmount
    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess, onScanError]);

  return <div id="reader" style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}></div>;
};

export default BarcodeScanner;
