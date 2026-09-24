import { StatCard } from "@/components/dashboard/StatCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, LayoutGrid, Calendar, Plus, ScanLine, FilePlus, Settings, MoreVertical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getSession } from "@/lib/session";

import { Greeting } from "@/components/dashboard/Greeting";
import { DashboardSections } from "@/components/dashboard/DashboardSections";

export default async function Dashboard() {
  const session = await getSession();
  const userName = session?.userInfo?.name || session?.userInfo?.email?.split('@')[0] || "User";

  let totalSections = 0;
  let totalStudents = 0;
  let attendanceSessions = 0;

  try {
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections';
    const email = session?.userInfo?.email || 'anonymous';
    const apiUrl = `${baseApiUrl}?userEmail=${encodeURIComponent(email)}`;
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: { 'x-user-email': email }
    });
    if (res.ok) {
      const result = await res.json();
      if (result.data) {
        totalSections = result.data.length;
        result.data.forEach(section => {
          if (section.students) {
            totalStudents += section.students.length;
            if (section.students.length > 0) {
              const studentKeys = Object.keys(section.students[0]);
              const dateKeys = studentKeys.filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
              attendanceSessions += dateKeys.length;
            }
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-3xl p-8 flex justify-between items-center relative overflow-hidden border border-indigo-100">
        <div className="relative z-10">
          <Greeting />
          <h1 className="text-4xl font-extrabold text-indigo-600 mt-1 capitalize">{userName}</h1>
          <p className="text-gray-600 mt-3 max-w-md">
            Manage your classes, take attendance and keep track of your students — all in one place.
          </p>
        </div>
        
        {/* Quote floating card */}
        <div className="hidden lg:flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm z-10 border border-white">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <ScanLine className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-700 italic">&quot;Technology makes<br/>attendance effortless.&quot;</p>
        </div>

        {/* Decorative elements - using pseudo-like divs to mimic the background waves in the image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-200/50 to-transparent z-0 pointer-events-none" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Sections" value={totalSections.toString()} icon={LayoutGrid} />
        <StatCard title="Total Students" value={totalStudents.toString()} icon={Users} />
        <StatCard title="Attendance Sessions" value={attendanceSessions.toString()} icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (Sections & Recent Activity) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Your Sections</h3>
              <Link href="/dashboard/sections" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All →</Link>
            </div>
            
            <DashboardSections />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Take Attendance Promo Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-8 border border-indigo-100 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ScanLine className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Take Attendance<br/>in Seconds</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-[200px]">
                Select a section, scan student ID and mark attendance effortlessly.
              </p>
              <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-0 shadow-md shadow-indigo-200 mt-4 w-max">
                <Link href="/dashboard/attendance" className="flex flex-row items-center justify-center gap-2 px-6 py-2">
                  <span>Start Attendance</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/sections/create" className="flex items-center p-4 bg-white border rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl mr-4 group-hover:bg-indigo-100">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Create Section</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Add a new class/section with student data</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500" />
              </Link>

              <Link href="/dashboard/attendance" className="flex items-center p-4 bg-white border rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl mr-4 group-hover:bg-indigo-100">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Take Attendance</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Scan student ID cards and mark attendance</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500" />
              </Link>

              <Link href="/dashboard/sections" className="flex items-center p-4 bg-white border rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl mr-4 group-hover:bg-indigo-100">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Manage Sections</h4>
                  <p className="text-xs text-gray-500 mt-0.5">View, edit and manage your sections</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500" />
              </Link>
            </div>
          </div>

          {/* Bottom IdilyNow Logo/Ad area */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-6 border flex flex-col items-center justify-center text-center mt-8 shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold text-indigo-600 mb-2">
               <ScanLine className="w-6 h-6" /> IdilyNow
            </div>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Fast • Secure • Reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
