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
        // We removed 'qrbox' so the entire camera feed acts as a scanner.
        // This is much better for wide 1D barcodes found on ID cards.
        videoConstraints: {
          facingMode: "environment", // Use the back camera on mobile
          width: { ideal: 1280 },    // Higher resolution to detect thin barcode lines
          height: { ideal: 720 }
        },
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true // Uses fast native browser decoding if available
        }
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
