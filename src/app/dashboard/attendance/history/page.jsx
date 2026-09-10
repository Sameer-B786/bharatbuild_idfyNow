"use client";

import { useState } from "react";
import { Search, MoreVertical, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AttendanceHistory() {
  const [searchQuery, setSearchQuery] = useState("");

  const history = [
    { id: 1, date: "Apr 22, 2025", section: "B.E CSE - A", present: 45, absent: 3, percentage: 93, status: "Completed" },
    { id: 2, date: "Apr 20, 2025", section: "B.E ECE - B", present: 40, absent: 2, percentage: 95, status: "Completed" },
    { id: 3, date: "Apr 18, 2025", section: "B.E CSE - A", present: 46, absent: 2, percentage: 95, status: "Completed" },
    { id: 4, date: "Apr 15, 2025", section: "B.E ME - A", present: 30, absent: 5, percentage: 85, status: "Completed" },
    { id: 5, date: "Apr 10, 2025", section: "B.E CSE - B", present: 42, absent: 6, percentage: 87, status: "Completed" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance History</h2>
          <p className="text-sm text-gray-500 mt-1">View and export past attendance records across all sections.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by section or date..." 
              className="pl-9 bg-white border-gray-200"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl shrink-0">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" className="rounded-xl shrink-0 border-orange-200 text-orange-600 hover:bg-orange-50">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="pl-6 py-4">Date</TableHead>
              <TableHead className="py-4">Section</TableHead>
              <TableHead className="py-4 text-center">Present</TableHead>
              <TableHead className="py-4 text-center">Absent</TableHead>
              <TableHead className="py-4 text-center">Percentage</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4 text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {history.map((record) => (
              <TableRow key={record.id} className="hover:bg-gray-50/50 cursor-pointer">
                <TableCell className="pl-6 py-4 font-medium text-gray-900">{record.date}</TableCell>
                <TableCell className="py-4 font-medium">{record.section}</TableCell>
                <TableCell className="py-4 text-center text-emerald-600 font-semibold">{record.present}</TableCell>
                <TableCell className="py-4 text-center text-rose-600 font-semibold">{record.absent}</TableCell>
                <TableCell className="py-4 text-center">
                  <div className="inline-flex items-center">
                    <span className="font-semibold text-gray-900 mr-2">{record.percentage}%</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${record.percentage >= 90 ? 'bg-emerald-500' : record.percentage >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        style={{ width: `${record.percentage}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-0 font-medium">
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Download Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
