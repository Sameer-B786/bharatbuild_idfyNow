"use client";
import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            // Request the highest possible resolution up to 1080p
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: "environment",
          },
          // MASSIVE SPEED BOOST: Only scan the middle horizontal strip of the camera feed.
          // This stops Quagga from wasting CPU on the background.
          area: {
            top: "25%",
            right: "10%",
            left: "10%",
            bottom: "25%",
          },
        },
        locator: {
          patchSize: "large", // Better for physical ID cards
          halfSample: false,  // CRITICAL: Do not compress the image, we need all the thin barcode lines intact
        },
        numOfWorkers: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4,
        decoder: {
          readers: ["code_128_reader"],
          multiple: false
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga initialization failed:", err);
          if (onScanError) onScanError(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onProcessed((result) => {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
          result.boxes.filter(function (box) {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });

    Quagga.onDetected((result) => {
      if (result && result.codeResult && result.codeResult.code) {
        const code = result.codeResult.code;
        Quagga.stop();
        onScanSuccess(code, result, { resume: () => Quagga.start() });
      }
    });

    return () => {
      Quagga.stop();
      Quagga.offProcessed();
      Quagga.offDetected();
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div 
      id="interactive" 
      className="viewport" 
      ref={scannerRef} 
      style={{ width: "100%", maxWidth: "600px", margin: "0 auto", position: "relative", overflow: "hidden", backgroundColor: "black", borderRadius: "0.5rem" }}
    >
      {/* Targeting Box UI to show exactly where Quagga is scanning */}
      <div style={{ 
        position: 'absolute', top: '25%', bottom: '25%', left: '10%', right: '10%', 
        border: '3px solid rgba(255, 0, 0, 0.6)', borderRadius: '8px', zIndex: 10, pointerEvents: 'none',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)' // Darkens everything outside the scan area
      }}></div>

      <style dangerouslySetInnerHTML={{__html: `
        #interactive video { width: 100%; height: auto; border-radius: 0.5rem; display: block; }
        #interactive canvas.drawingBuffer { position: absolute; top: 0; left: 0; width: 100%; height: auto; z-index: 5; }
      `}} />
    </div>
  );
};

export default BarcodeScanner;
