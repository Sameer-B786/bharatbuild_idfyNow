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
          target: scannerRef.current, // Render the video inside our div
          constraints: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment", // Force back camera
          },
        },
        locator: {
          patchSize: "medium", // Optimizes search grid for standard barcodes
          halfSample: true,
        },
        numOfWorkers: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4,
        decoder: {
          // Changed to strictly Code 39 as requested.
          readers: ["code_39_reader"],
          multiple: false
        },
        locate: true, // Helps Quagga find the barcode in the image
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
        // Pause scanning so it doesn't read the same card 20 times in a row
        Quagga.stop();
        
        // Pass a mock scanner object with a resume function so your AttendanceScanner works exactly the same
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
      style={{ width: "100%", maxWidth: "600px", margin: "0 auto", position: "relative", overflow: "hidden" }}
    >
      {/* Inject CSS so Quagga's injected video and canvas overlap correctly */}
      <style dangerouslySetInnerHTML={{__html: `
        #interactive video { width: 100%; height: auto; border-radius: 0.5rem; }
        #interactive canvas.drawingBuffer { position: absolute; top: 0; left: 0; width: 100%; height: auto; }
      `}} />
    </div>
  );
};

export default BarcodeScanner;
