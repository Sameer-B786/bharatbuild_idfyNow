"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import { SectionCard } from "@/components/sections/SectionCard";
import Link from "next/link";

export function DashboardSections() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      try {
        const apiUrl = '/api/proxy/sections';
        
        const response = await fetch(apiUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch sections');
        
        const result = await response.json();
        
        if (result.data) {
          const mappedSections = result.data.map(item => ({
            id: item.id,
            title: `${item.className || ''} - ${item.sectionName || ''}`.trim(),
            subtitle: item.subject || 'N/A',
            students: item.students?.length || 0,
            sem: item.semester || '-',
            status: item.students && item.students.length > 0 ? "Excel Connected" : "File Pending",
            studentsList: item.students || []
          }));
          // Only show up to 5 recent sections on dashboard to leave room for the "Create New" button
          setSections(mappedSections.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSections();
  }, []);

  const handleDeleteSection = (deletedId) => {
    setSections(prev => prev.filter(section => section.id !== deletedId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {isLoading ? (
        <div className="col-span-full py-8 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          {sections.map((section, index) => (
            <SectionCard key={section.id || index} {...section} onDelete={handleDeleteSection} />
          ))}
        </>
      )}

      {/* Create New Section Card */}
      <Link href="/dashboard/sections/create" className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:border-orange-300 hover:bg-indigo-50/50 transition-colors cursor-pointer group min-h-[280px]">
        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl mb-3 group-hover:bg-indigo-100 transition-colors">
          <Plus className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-gray-900">Create New Section</h4>
        <p className="text-sm text-gray-500 mt-1 mb-4">Add a new class/section and upload student data.</p>
        <div className="border border-indigo-200 text-indigo-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 w-full rounded-xl flex flex-row items-center justify-center gap-2 py-2 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4 shrink-0" />
          <span>Create Section</span>
        </div>
      </Link>
    </div>
  );
}
