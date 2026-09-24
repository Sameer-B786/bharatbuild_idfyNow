"use client";

import { useState, useEffect, Suspense } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/sections/SectionCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SectionsListContent() {
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") || "";
  const [prevQ, setPrevQ] = useState(currentQ);
  const [searchQuery, setSearchQuery] = useState(currentQ);

  if (currentQ !== prevQ) {
    setPrevQ(currentQ);
    setSearchQuery(currentQ);
  }

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
          setSections(mappedSections);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSections();
  }, []);

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSection = (deletedId) => {
    setSections(prev => prev.filter(section => section.id !== deletedId));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Sections</h2>
          <p className="text-sm text-gray-500 mt-1">View, edit, and manage all your assigned sections.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-9 bg-white border-gray-200"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-sm shrink-0 p-0">
            <Link href="/dashboard/sections/create" className="flex flex-row items-center justify-center gap-2 px-4 py-2 w-full h-full">
              <Plus className="w-4 h-4 shrink-0" />
              <span>New Section</span>
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSections.map((section, index) => (
            <SectionCard key={section.id || index} {...section} onDelete={handleDeleteSection} />
          ))}
          {filteredSections.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed">
               <p className="text-gray-500">No sections found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SectionsList() {
  return (
    <Suspense fallback={<div className="py-12 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>}>
      <SectionsListContent />
    </Suspense>
  );
}
