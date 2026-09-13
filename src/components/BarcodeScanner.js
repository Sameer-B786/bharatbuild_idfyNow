"use client";
import React, { useEffect, useRef, useState } from "react";

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const containerRef = useRef(null);
  const barkoderInstanceRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;

    const initScanner = async () => {
      try {
        const BarkoderSDK = await import('barkoder-wasm');
        console.log("BarkoderSDK imported:", BarkoderSDK);
        
        let initFn = BarkoderSDK.initialize || (BarkoderSDK.default && BarkoderSDK.default.initialize);
        if (!initFn) {
            throw new Error("Could not find initialize function on imported module.");
        }

        // Pass empty string as license key.
        const barkoder = await initFn("", { wasmPath: '/' });
        
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
        setErrorMsg(err.message || String(err));
        setIsInitializing(false);
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
      {isInitializing && <div style={{ color: "white", textAlign: "center", padding: "20px" }}>Initializing Scanner...</div>}
      {errorMsg && <div style={{ color: "red", textAlign: "center", padding: "20px" }}>Error: {errorMsg}</div>}
      <div 
        id="barkoder-container" 
        ref={containerRef} 
        style={{ width: "100%", height: "400px", margin: "0 auto", position: "relative", overflow: "hidden", backgroundColor: "black", borderRadius: "0.5rem", display: (isInitializing || errorMsg) ? 'none' : 'block' }}
      >
      </div>
    </div>
  );
};

export default BarcodeScanner;
