"use client";

import { useState } from "react";
import { ArrowLeft, UploadCloud, FileSpreadsheet, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function CreateSection() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    className: "",
    sectionName: "",
    subject: "",
    semester: "",
    academicYear: ""
  });
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Map the parsed data to expected format (id, name)
        const mappedData = data.map((row, index) => ({
          id: row['Student ID'] || row['ID'] || row['Roll No'] || row['RollNo'] || `temp-${index}`,
          name: row['Student Name'] || row['Name'] || row['StudentName'] || 'Unknown'
        }));
        
        setPreviewData(mappedData);
        setStep(2);
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        students: previewData
      };

      // Replace with your actual API Gateway URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'YOUR_API_GATEWAY_URL_HERE';
      
      // We still mock it if there's no API URL set to prevent crashes during demo
      if (apiUrl === 'YOUR_API_GATEWAY_URL_HERE') {
        console.log('Mocking API call with payload:', payload);
        setTimeout(() => setStep(3), 1000);
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create section');
      }

      setStep(3);
    } catch (error) {
      console.error('Error creating section:', error);
      alert('Failed to save section data.');
    } finally {
      setIsSubmitting(false);
    }
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
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g. Mathematics" 
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
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

          <div className="mt-8 flex justify-end">
            <Button onClick={handleCreate} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-8">
              Save Section
            </Button>
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
            <Button onClick={handleCreate} disabled={isSubmitting} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
              {isSubmitting ? 'Saving...' : 'Save Section Data'}
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
            The section {formData.className} {formData.sectionName} for {formData.subject || "the selected subject"} has been created with {previewData.length} students.
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
