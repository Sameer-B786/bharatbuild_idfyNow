"use client";

import { useState } from "react";
import { ArrowLeft, UploadCloud, FileSpreadsheet, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default function CreateSection() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    className: "",
    sectionName: "",
    semester: "",
    academicYear: ""
  });
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);

  // Mock file upload and parsing
  const handleFileUpload = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Mock parsing after a short delay
      setTimeout(() => {
        setPreviewData([
          { id: "101", name: "Rahul Sharma" },
          { id: "102", name: "Priya Singh" },
          { id: "103", name: "Amit Kumar" },
          { id: "104", name: "Neha Gupta" },
          { id: "105", name: "Vikram Reddy" },
        ]);
        setStep(2);
      }, 1000);
    }
  };

  const handleCreate = () => {
    // Mock save
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Section</h2>
          <p className="text-sm text-gray-500 mt-1">Add a new class/section and upload student data.</p>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input id="className" placeholder="e.g. B.E CSE" 
                value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectionName">Section Name</Label>
              <Input id="sectionName" placeholder="e.g. A" 
                value={formData.sectionName} onChange={e => setFormData({...formData, sectionName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input id="semester" placeholder="e.g. 4" 
                value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input id="academicYear" placeholder="e.g. 2025-26" 
                value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Student Data Source</h3>
            <label 
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileUpload}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-orange-300 transition-colors cursor-pointer"
            >
              <div className="p-4 bg-orange-50 text-orange-500 rounded-full mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-gray-900 text-lg mb-1">Upload Excel File</h4>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Drag and drop your .xlsx or .xls file here, or click to browse. Ensure it contains Student ID and Name columns.
              </p>
              <Button type="button" variant="outline" className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50">
                Browse Files
              </Button>
              <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{file?.name || "students.xlsx"}</h3>
                <p className="text-xs text-gray-500">{previewData.length} students detected</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500">
              Change File
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] pl-6">#</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((student, i) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-gray-500 pl-6">{i + 1}</TableCell>
                  <TableCell className="font-semibold">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreate} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
              Save Section Data
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl border shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Section Created Successfully!</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            The section {formData.className} {formData.sectionName} has been created with {previewData.length} students.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button asChild className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white p-0">
              <Link href="/dashboard/attendance" className="flex flex-row items-center justify-center gap-2 w-full h-full px-4 py-2">
                <span>Take Attendance Now</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
