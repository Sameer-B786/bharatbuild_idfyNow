"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import ExcelDropzone from '@/components/upload/ExcelDropzone';
import TemplateJsonUploader from '@/components/upload/TemplateJsonUploader';
import BulkRenderEngine from '@/components/rendering/BulkRenderEngine';
import { useGeneratorStore } from '@/store/useGeneratorStore';

// SSR Guard for Konva
const KonvaPreviewStage = dynamic(
  () => import('@/components/canvas/KonvaPreviewStage'),
  { ssr: false }
);

export default function EventPassGeneratorPage() {
  const schemaType = 'eventpass';
  const templateJson = useGeneratorStore((state) => state.templateJson);
  const records = useGeneratorStore((state) => state.records);

  const previewRecord = records?.[0] || null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Pass Generation</h1>
          <p className="text-gray-500">Upload attendee data and design template to generate passes.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-6 text-gray-800">1. Data & Template Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExcelDropzone schemaType={schemaType} />
          <TemplateJsonUploader />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-800">2. Live Preview</h2>
        <div className="flex justify-center bg-gray-50 p-4 border border-gray-200 rounded-xl overflow-auto min-h-[400px]">
          {templateJson ? (
            <KonvaPreviewStage templateJson={templateJson} record={previewRecord} />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full min-h-[300px]">
               <p>Upload a JSON template to see preview</p>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-gray-800">3. Final Output</h2>
          <BulkRenderEngine />
        </div>
      </div>
    </div>
  );
}
