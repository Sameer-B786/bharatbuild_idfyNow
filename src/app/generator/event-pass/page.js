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
      <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Event Pass Generation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExcelDropzone schemaType={schemaType} />
          <TemplateJsonUploader />
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Live Preview (First Record)</h2>
        <div className="flex justify-center bg-gray-100 p-4 border rounded overflow-auto min-h-[400px]">
          {templateJson ? (
            <KonvaPreviewStage templateJson={templateJson} record={previewRecord} />
          ) : (
            <div className="flex items-center justify-center text-gray-400 h-full w-full min-h-[300px]">
               Upload a JSON template to see preview
            </div>
          )}
        </div>
        
        <BulkRenderEngine />
      </div>
    </div>
  );
}
