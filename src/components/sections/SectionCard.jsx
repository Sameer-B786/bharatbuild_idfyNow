"use client";

import { useState } from "react";
import { MoreVertical, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Download } from "lucide-react";

import { useRouter } from "next/navigation";

export function SectionCard({ id, title, subtitle, students, sem, status, studentsList, onDelete }) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  
  const handleExportExcel = async () => {
    try {
      if (!studentsList || studentsList.length === 0) {
        alert("No student data to export.");
        return;
      }
      const XLSX = await import("xlsx");
      // Create worksheet from studentsList JSON
      // XLSX automatically makes columns out of the object keys, which will perfectly include the new date keys (e.g. "2026-09-18": "P")
      const ws = XLSX.utils.json_to_sheet(studentsList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      // Save it
      XLSX.writeFile(wb, `${title}_Attendance.xlsx`);
    } catch (e) {
      console.error("Error exporting excel", e);
      alert("Failed to export Excel");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections';
      const response = await fetch(`${apiUrl}?sectionId=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete section');
      }
      
      setIsDeleteOpen(false);
      router.refresh();
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem onClick={handleExportExcel} className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Export Attendance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsConnectOpen(true)} className="text-blue-600 focus:bg-blue-50 focus:text-blue-700">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Connect to ERP / PowerBI
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
          <div className="flex items-center">
            <Users className="w-3.5 h-3.5 mr-1" />
            {students} Students
          </div>
          <span>•</span>
          <span>Sem {sem}</span>
        </div>

        <div className="mt-4">
          <Badge variant="secondary" className={
            status === 'Excel Connected' 
              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium' 
              : 'bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium'
          }>
            {status}
          </Badge>
        </div>

        <Button asChild className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm p-0">
          <Link href="/dashboard/attendance" className="flex flex-row items-center justify-center gap-2 w-full h-full px-4 py-2">
            <span>Take Attendance</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </Button>
      </div>

      {/* Delete Section Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-gray-900">{title}</span>? This action cannot be undone and will remove all associated attendance records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connect Integration Dialog */}
      <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Live Data</DialogTitle>
            <DialogDescription>
              Use these live URLs to connect {title}'s attendance data to Google Sheets, PowerBI, or your College ERP. Data updates instantly when attendance is taken.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>CSV Endpoint (Best for Google Sheets / Excel)</Label>
              <div className="flex gap-2">
                <Input readOnly value={`https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections?sectionId=${id}&format=csv`} className="text-xs font-mono bg-gray-50" />
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(`https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections?sectionId=${id}&format=csv`)}>Copy</Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Formula: <code className="bg-gray-100 px-1 rounded">=IMPORTDATA("...")</code></p>
            </div>
            
            <div className="grid gap-2 mt-2">
              <Label>JSON Endpoint (Best for custom ERPs)</Label>
              <div className="flex gap-2">
                <Input readOnly value={`https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections?sectionId=${id}`} className="text-xs font-mono bg-gray-50" />
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(`https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections?sectionId=${id}`)}>Copy</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsConnectOpen(false)} className="w-full">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
