"use client";
import React, { useState } from 'react';
import { useGeneratorStore } from '@/store/useGeneratorStore';

export default function TemplateJsonUploader() {
  const setTemplateJson = useGeneratorStore((state) => state.setTemplateJson);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.canvas || !json.elements) {
          throw new Error("Invalid template format. Must contain 'canvas' and 'elements'.");
        }
        setTemplateJson(json);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTemplateJson(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded text-center">
      <input type="file" accept=".json" onChange={handleFileUpload} className="mb-4" />
      <p className="text-gray-500">Upload JSON Canvas Template</p>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

