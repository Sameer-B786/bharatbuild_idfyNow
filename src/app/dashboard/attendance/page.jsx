"use client";

import { useState } from "react";
import { ArrowLeft, ScanLine, Users, CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AttendancePage() {
  const [sessionState, setSessionState] = useState("IDLE"); // IDLE, SCANNING, SUBMITTING, SUBMITTED
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock data
  const sections = ["B.E CSE - A", "B.E CSE - B", "B.E ECE - A", "B.E ME - A"];
  
  const [students, setStudents] = useState([
    { id: "101", name: "Rahul Sharma", present: false, time: null },
    { id: "102", name: "Priya Singh", present: false, time: null },
    { id: "103", name: "Amit Kumar", present: false, time: null },
    { id: "104", name: "Neha Gupta", present: false, time: null },
    { id: "105", name: "Vikram Reddy", present: false, time: null },
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [recentScans, setRecentScans] = useState([]);

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;
  const percentage = Math.round((presentCount / students.length) * 100) || 0;

  const handleStartSession = (e) => {
    e.preventDefault();
    if (!selectedSection || !date) return;
    setSessionState("SCANNING");
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (!barcodeInput) return;
    
    // Simulate finding a student
    const studentIndex = students.findIndex(s => s.id === barcodeInput || s.id === barcodeInput.replace('STU', ''));
    
    if (studentIndex >= 0) {
      const student = students[studentIndex];
      if (!student.present) {
        const newStudents = [...students];
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        newStudents[studentIndex] = { ...student, present: true, time };
        setStudents(newStudents);
        setRecentScans([{ ...student, status: "SUCCESS", time }, ...recentScans].slice(0, 5));
      } else {
        setRecentScans([{ ...student, status: "DUPLICATE", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...recentScans].slice(0, 5));
      }
    } else {
       setRecentScans([{ id: barcodeInput, name: "Unknown", status: "INVALID", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }, ...recentScans].slice(0, 5));
    }
    
    setBarcodeInput("");
  };

  const handleSubmit = () => {
    setSessionState("SUBMITTING");
    // Mock API call
    setTimeout(() => {
      setSessionState("SUBMITTED");
    }, 1500);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.includes(searchQuery)
  );

  if (sessionState === "SUBMITTED") {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-white rounded-2xl border shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Attendance Submitted Successfully!</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Session for {selectedSection} on {date} has been recorded.
          </p>
          <div className="flex gap-6 w-full max-w-sm mb-8">
            <div className="flex-1 bg-gray-50 p-4 rounded-xl border text-center">
               <p className="text-sm text-gray-500 mb-1">Present</p>
               <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
            </div>
            <div className="flex-1 bg-gray-50 p-4 rounded-xl border text-center">
               <p className="text-sm text-gray-500 mb-1">Absent</p>
               <p className="text-2xl font-bold text-rose-600">{absentCount}</p>
            </div>
          </div>
          <Button asChild className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white w-full max-w-sm">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (sessionState === "IDLE") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Take Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">Select a section and date to start scanning.</p>
          </div>
        </div>

        <form onSubmit={handleStartSession} className="bg-white rounded-2xl border shadow-sm p-8 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="section">Select Section</Label>
            <select 
              id="section"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              required
            >
              <option value="" disabled>Choose a section...</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required
            />
          </div>

          <Button type="submit" className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg mt-4 shadow-sm" disabled={!selectedSection}>
            <ScanLine className="w-5 h-5 mr-2" /> Start Session
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border shadow-sm sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{selectedSection}</h2>
          <p className="text-sm text-gray-500 mt-1">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex flex-col items-center min-w-[90px]">
            <span className="text-xs font-semibold uppercase tracking-wider mb-0.5">Present</span>
            <span className="text-xl font-bold leading-none">{presentCount}</span>
          </div>
          <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 flex flex-col items-center min-w-[90px]">
            <span className="text-xs font-semibold uppercase tracking-wider mb-0.5">Absent</span>
            <span className="text-xl font-bold leading-none">{absentCount}</span>
          </div>
          <div className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 flex flex-col items-center min-w-[90px]">
             <span className="text-xs font-semibold uppercase tracking-wider mb-0.5">Total</span>
             <span className="text-xl font-bold leading-none">{percentage}%</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setSessionState("IDLE")} className="rounded-xl border-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={sessionState === "SUBMITTING"}
            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-6 shadow-sm"
          >
            {sessionState === "SUBMITTING" ? "Submitting..." : "Submit Attendance"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Scanner & Recent */}
        <div className="space-y-6">
          {/* Scanner Area */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-4">Barcode Scanner</h3>
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative mb-4 flex items-center justify-center">
               {/* Mock Scanner Feed */}
               <div className="absolute inset-0 border-2 border-orange-500/50 m-8 rounded-lg">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
                  <div className="w-full h-0.5 bg-orange-500/80 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_2px_rgba(249,115,22,0.5)] animate-pulse" />
               </div>
               <p className="text-white/50 text-sm">Camera Feed Active</p>
            </div>
            
            <form onSubmit={handleScan} className="flex gap-2">
              <Input 
                autoFocus
                placeholder="Or type Student ID..." 
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                className="bg-gray-50 border-gray-200"
              />
              <Button type="submit" variant="secondary" className="bg-gray-100 hover:bg-gray-200">Scan</Button>
            </form>
          </div>

          {/* Recent Scans */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm">Recent Scans</h3>
            </div>
            <div className="p-2 space-y-1">
              {recentScans.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No students scanned yet</p>
              ) : (
                recentScans.map((scan, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {scan.status === "SUCCESS" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {scan.status === "DUPLICATE" && <AlertCircle className="w-5 h-5 text-amber-500" />}
                      {scan.status === "INVALID" && <XCircle className="w-5 h-5 text-rose-500" />}
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{scan.name}</p>
                        <p className="text-xs text-gray-500">{scan.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <Badge variant="outline" className={
                         scan.status === "SUCCESS" ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                         scan.status === "DUPLICATE" ? "border-amber-200 text-amber-700 bg-amber-50" :
                         "border-rose-200 text-rose-700 bg-rose-50"
                       }>
                         {scan.status === "SUCCESS" ? "Present" : scan.status === "DUPLICATE" ? "Already Scanned" : "Invalid ID"}
                       </Badge>
                       <p className="text-[10px] text-gray-400 mt-1">{scan.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Roster */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
          <div className="p-4 border-b flex justify-between items-center gap-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Class Roster <span className="text-gray-400 font-normal text-sm ml-1">({students.length})</span>
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search roster..." 
                className="pl-9 h-9 text-sm bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-0">
            <Table>
              <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[100px] pl-6">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className={student.present ? "bg-emerald-50/30" : ""}>
                    <TableCell className="font-medium text-gray-600 pl-6">{student.id}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{student.name}</TableCell>
                    <TableCell>
                      {student.present ? (
                        <Badge className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-0">Present</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 border-gray-200">Absent</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 text-sm text-gray-500">
                      {student.time || "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                      No students found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}
