"use client";
import React, { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const isPausedRef = useRef(false);

  useEffect(() => {
    let html5QrCode;
    let active = true;

    const startScanner = async () => {
      // Limit to only specific formats for MASSIVE speed boost
      const formatsToSupport = [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
      ];

      html5QrCode = new Html5Qrcode("reader", { formatsToSupport });
      
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 30, // Increased frame rate
            qrbox: { width: 400, height: 100 }, // Narrow rectangular scan box limits pixel parsing area
            aspectRatio: 1.777778, // 16:9
            disableFlip: true, // Don't try scanning mirrored images (saves CPU)
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
      {/* UI Overlay to show the scan area clearly */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)',
        width: '400px', height: '100px',
        maxWidth: '90%',
        border: '3px solid rgba(0, 255, 0, 0.6)', 
        borderRadius: '8px', zIndex: 10, pointerEvents: 'none',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
      }}></div>
    </div>
  );
};

export default BarcodeScanner;
