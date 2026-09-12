"use client";
import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

export default function AttendanceScanner({ sessionId, date }) {
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [kpis, setKpis] = useState({ present: 0, absent: 0, total: 0 });

  const handleScanSuccess = async (decodedText, decodedResult, scanner) => {
    setMessage(`Scanned ID: ${decodedText}. Sending to backend...`);
    
    try {
      // Send the decoded barcode string to our Lambda 2 API
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const response = await fetch(`${API_BASE}/attendance/sessions/${sessionId}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNo: decodedText, date }) 
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
        // Update the KPI dashboard automatically
        if (result.data) {
          setKpis({
            present: result.data.present,
            absent: result.data.absent,
            total: result.data.total
          });
        }
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Network Error: ${error.message}`);
    }

    // Wait 2 seconds before resuming the scanner so the user has time to see the success message
    setTimeout(() => {
      scanner.resume();
      setMessage("Ready for next ID card...");
    }, 2000);
  };

  return (
    <div className="p-4 border rounded shadow-sm flex flex-col items-center bg-white">
      <h2 className="text-xl font-bold mb-4">Student ID Scanner</h2>
      
      <div className="flex gap-4 mb-4 text-sm font-medium">
        <span className="text-green-600">Present: {kpis.present}</span>
        <span className="text-red-600">Absent: {kpis.absent}</span>
        <span className="text-gray-600">Total: {kpis.total}</span>
      </div>
      
      {!isScanning ? (
        <button 
          onClick={() => setIsScanning(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition"
        >
          Open Camera & Scan
        </button>
      ) : (
        <div className="w-full flex flex-col items-center">
           <button 
            onClick={() => setIsScanning(false)}
            className="bg-red-500 text-white px-4 py-1 rounded mb-4 hover:bg-red-600 transition"
          >
            Stop Camera
          </button>
          
          <BarcodeScanner 
            onScanSuccess={handleScanSuccess} 
            onScanError={() => {}} // Ignore noisy frame errors
          />
        </div>
      )}

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded w-full text-center font-medium">
          {message}
        </div>
      )}
    </div>
  );
}
