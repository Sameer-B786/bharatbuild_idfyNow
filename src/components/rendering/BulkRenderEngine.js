"use client";
import React from 'react';
import jsPDF from 'jspdf';
import { generateBarcodeDataUrl } from '@/lib/barcodeGenerator';
import { renderRecordToCanvas } from '@/lib/konvaToPdf';
import { useGeneratorStore } from '@/store/useGeneratorStore';

export default function BulkRenderEngine() {
  const records = useGeneratorStore((state) => state.records);
  const templateJson = useGeneratorStore((state) => state.templateJson);
  const isGenerating = useGeneratorStore((state) => state.isGenerating);
  const setIsGenerating = useGeneratorStore((state) => state.setIsGenerating);
  const progress = useGeneratorStore((state) => state.progress);
  const setProgress = useGeneratorStore((state) => state.setProgress);

  const executeBatchGeneration = async () => {
    if (!records || records.length === 0 || !templateJson) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      const { width, height } = templateJson.canvas;
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      });

      for (let idx = 0; idx < records.length; idx++) {
        const record = records[idx];

        // Resolve dynamic barcode image if barcode node exists
        const barcodeNode = templateJson.elements.find(el => el.type === 'DYNAMIC_BARCODE');
        let barcodeDataUrl = '';
        if (barcodeNode) {
          const rawVal = record[barcodeNode.fieldMapping] || '';
          barcodeDataUrl = generateBarcodeDataUrl(rawVal, barcodeNode.barcodeFormat);
        }

        // Process frame to Canvas snapshot
        const stageCanvas = await renderRecordToCanvas(record, templateJson, barcodeDataUrl);
        const frameData = stageCanvas.toDataURL({ pixelRatio: 2, mimeType: 'image/jpeg', quality: 0.92 });

        if (idx > 0) {
            pdf.addPage([width, height]);
        }
        
        pdf.addImage(frameData, 'JPEG', 0, 0, width, height);
        
        setProgress(Math.round(((idx + 1) / records.length) * 100));
      }

      pdf.save(`Bulk_Output_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Error during batch generation", err);
      alert("Failed to generate PDF. See console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!records || records.length === 0 || !templateJson) {
      return null;
  }

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
      <p className="mb-4">{records.length} records loaded.</p>
      
      {isGenerating ? (
        <div className="w-full max-w-md">
          <div className="h-4 w-full bg-gray-200 rounded overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <p className="text-center mt-2">{progress}% completed</p>
        </div>
      ) : (
        <button 
          onClick={executeBatchGeneration}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Start Batch Render (PDF)
        </button>
      )}
    </div>
  );
}



