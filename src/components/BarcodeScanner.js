"use client";
import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const isPausedRef = useRef(false);

  useEffect(() => {
    let html5QrCode;
    let active = true;

    const startScanner = async () => {
      html5QrCode = new Html5Qrcode("reader");
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 350, height: 150 }, // Rectangular box is better for 1D barcodes
            aspectRatio: 1.777778, // 16:9
          },
          (decodedText, decodedResult) => {
            if (active && !isPausedRef.current) {
                isPausedRef.current = true;
                if (html5QrCode.pause) {
                    try { html5QrCode.pause(); } catch(e) {}
                }
                onScanSuccess(decodedText, decodedResult, {
                    resume: () => {
                        isPausedRef.current = false;
                        if (html5QrCode.resume) {
                            try { html5QrCode.resume(); } catch(e) {}
                        }
                    }
                });
            }
          },
          (errorMessage) => {
            // These are expected per frame when no barcode is found
          }
        );
      } catch (err) {
        console.error("Scanner error:", err);
        if (onScanError) onScanError(err);
      }
    };

    startScanner();

    return () => {
      active = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <div 
        id="reader" 
        style={{ width: "100%", margin: "0 auto", overflow: "hidden", borderRadius: "0.5rem" }}
      ></div>
    </div>
  );
};

export default BarcodeScanner;
