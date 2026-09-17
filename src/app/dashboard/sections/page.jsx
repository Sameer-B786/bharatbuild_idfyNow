"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/sections/SectionCard";
import Link from "next/link";

export default function SectionsList() {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { title: "B.E CSE - A", subtitle: "Computer Science", students: 48, sem: 4, status: "Excel Connected" },
    { title: "B.E CSE - B", subtitle: "Computer Science", students: 48, sem: 4, status: "Excel Connected" },
    { title: "B.E ECE - A", subtitle: "Electronics", students: 42, sem: 4, status: "Excel Connected" },
    { title: "B.E ME - A", subtitle: "Mechanical", students: 35, sem: 4, status: "Excel Connected" },
    { title: "B.E CSE - C", subtitle: "Computer Science", students: 44, sem: 4, status: "File Pending" },
  ];

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              placeholder="Search sections..." 
              className="pl-9 bg-white border-gray-200"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm shrink-0 p-0">
            <Link href="/dashboard/sections/create" className="flex flex-row items-center justify-center gap-2 px-4 py-2 w-full h-full">
              <Plus className="w-4 h-4 shrink-0" />
              <span>New Section</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSections.map((section, index) => (
          <SectionCard key={index} {...section} />
        ))}
        {filteredSections.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed">
             <p className="text-gray-500">No sections found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
