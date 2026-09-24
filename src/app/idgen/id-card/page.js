"use client";
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ExcelDropzone from '@/components/upload/ExcelDropzone';
import TemplateJsonUploader from '@/components/upload/TemplateJsonUploader';
import BulkRenderEngine from '@/components/rendering/BulkRenderEngine';
import { useGeneratorStore } from '@/store/useGeneratorStore';

// SSR Guard for Konva
const KonvaPreviewStage = dynamic(
  () => import('@/components/canvas/KonvaPreviewStage'),
  { ssr: false }
);

function IdCardGeneratorContent() {
  const searchParams = useSearchParams();
  const initialSchema = searchParams.get('schema') || 'k12';
  
  const [schemaType, setSchemaType] = useState(initialSchema);
  const templateJson = useGeneratorStore((state) => state.templateJson);
  const records = useGeneratorStore((state) => state.records);

  // Update schema if URL changes
  useEffect(() => {
    if (searchParams.get('schema')) {
      setSchemaType(searchParams.get('schema'));
    }
  }, [searchParams]);

  const previewRecord = records?.[0] || null;

  const schemaTitles = {
    'k12': 'K-12 Student ID Cards',
    'ugpg': 'UG/PG Student ID Cards',
    'faculty': 'Faculty & Staff ID Cards'
  };

  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm text-gray-600"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{schemaTitles[schemaType] || 'Educational ID Cards'}</h1>
          <p className="text-gray-500">Upload your data and template to generate badges.</p>
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

export default function IdCardGeneratorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <IdCardGeneratorContent />
    </Suspense>
  );
}
