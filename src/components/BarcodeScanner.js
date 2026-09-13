"use client";
import React, { useEffect, useRef, useState } from "react";

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const containerRef = useRef(null);
  const barkoderInstanceRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    const initScanner = async () => {
      try {
        const BarkoderSDK = await import('barkoder-wasm');
        
        // Pass empty string as license key.
        const barkoder = await BarkoderSDK.initialize("", { wasmPath: '/' });
        
        if (!active) {
            barkoder.stopScanner();
            return;
        }

        barkoderInstanceRef.current = barkoder;
        
        barkoder.setBarcodeTypeEnabled(barkoder.constants.Decoders.Code128, true);
        barkoder.setBarcodeTypeEnabled(barkoder.constants.Decoders.Ean13, true);
        
        barkoder.setCameraResolution(barkoder.constants.CameraResolution.FHD);
        barkoder.setDecodingSpeed(barkoder.constants.DecodingSpeed.Normal);

        setIsInitializing(false);

        const callbackMethod = (result) => {
          if (result && result.textualData) {
            barkoder.stopScanner();
            onScanSuccess(result.textualData, result, { resume: () => barkoder.startScanner(callbackMethod) });
          }
        };

        barkoder.startScanner(callbackMethod);

      } catch (err) {
        console.error("Barkoder initialization failed:", err);
        if (onScanError) onScanError(err);
      }
    };

    initScanner();

    return () => {
      active = false;
      if (barkoderInstanceRef.current) {
        barkoderInstanceRef.current.stopScanner();
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      {isInitializing && <div style={{ color: "black", textAlign: "center", padding: "20px" }}>Initializing Scanner...</div>}
      <div 
        id="barkoder-container" 
        ref={containerRef} 
        style={{ width: "100%", height: "400px", margin: "0 auto", position: "relative", overflow: "hidden", backgroundColor: "black", borderRadius: "0.5rem" }}
      >
      </div>
    </div>
  );
};

export default BarcodeScanner;
